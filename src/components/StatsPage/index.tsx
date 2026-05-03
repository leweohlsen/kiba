import { Card, Col, Empty, Row, Segmented, Statistic, Table, Typography } from "antd";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { ColumnsType } from "antd/es/table";
import type { KioskSessionStats, KioskStats, StatsTimePeriod, TopProductSale, TopShopper } from "../../app/types";
import type { RootState } from "../../app/store";
import {
    makeSelectKioskStatsForPeriod,
    selectNumAccounts,
    statsTimePeriodOptions,
    selectTotalBankBalance,
} from "../../app/selectors";

const { Text } = Typography;

type BarDatum = {
    id: string;
    label: string;
    value: number;
    suffix?: string;
};

const formatCurrency = (value: number) => `${value.toFixed(2)}€`;

const formatSessionDuration = (session: KioskSessionStats) => {
    const start = new Date(session.startTimestamp).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const end = new Date(session.endTimestamp).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return start === end ? start : `${start} - ${end}`;
};

const SimpleBarChart: React.FC<{
    data: BarDatum[];
    emptyText: string;
    maxItems?: number;
    valueFormatter?: (value: number) => string;
}> = ({
    data,
    emptyText,
    maxItems = 8,
    valueFormatter = (value) => value.toLocaleString("de-DE"),
}) => {
    const visibleData = data.slice(0, maxItems);
    const maxValue = Math.max(...visibleData.map((item) => item.value), 0);

    if (!visibleData.length || maxValue === 0) {
        return <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {visibleData.map((item, index) => {
                const width = `${Math.max((item.value / maxValue) * 100, 4)}%`;
                return (
                    <div key={item.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <Text strong>
                                {index + 1}. {item.label}
                            </Text>
                            <Text type="secondary">
                                {valueFormatter(item.value)}
                                {item.suffix || ""}
                            </Text>
                        </div>
                        <div style={{ background: "#f0f2f5", borderRadius: "999px", height: "14px", overflow: "hidden" }}>
                            <div
                                style={{
                                    background: "linear-gradient(90deg, #1677ff, #52c41a)",
                                    borderRadius: "999px",
                                    height: "100%",
                                    width,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const topProductColumns: ColumnsType<TopProductSale> = [
    {
        title: "#",
        render: (_value, _record, index) => index + 1,
        width: 48,
    },
    {
        title: "Produkt",
        dataIndex: "name",
    },
    {
        title: "Anzahl",
        dataIndex: "quantity",
        align: "right",
    },
    {
        title: "Umsatz",
        dataIndex: "turnover",
        align: "right",
        render: (turnover: number) => formatCurrency(turnover),
    },
];

const topShopperColumns: ColumnsType<TopShopper> = [
    {
        title: "#",
        render: (_value, _record, index) => index + 1,
        width: 48,
    },
    {
        title: "Konto",
        dataIndex: "name",
    },
    {
        title: "Einkäufe",
        dataIndex: "purchases",
        align: "right",
    },
    {
        title: "Umsatz",
        dataIndex: "turnover",
        align: "right",
        render: (turnover: number) => formatCurrency(turnover),
    },
];

const StatsPage: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<StatsTimePeriod>("24h");
    const numAccounts = useSelector<RootState, number>(selectNumAccounts);
    const totalBankBalance = useSelector<RootState, number>(selectTotalBankBalance);
    const selectKioskStats = useMemo(() => makeSelectKioskStatsForPeriod(timePeriod), [timePeriod]);
    const stats = useSelector<RootState, KioskStats>(selectKioskStats);

    const topProductBars: BarDatum[] = stats.topProducts.map((product) => ({
        id: product.id,
        label: product.name,
        value: product.quantity,
        suffix: " Artikel",
    }));

    const sessionBars: BarDatum[] = stats.sessions.map((session) => ({
        id: session.id,
        label: `${session.label} (${formatSessionDuration(session)})`,
        value: session.turnover,
    }));

    const hourlyDemandBars: BarDatum[] = stats.hourlyDemand.map((hour) => ({
        id: hour.id,
        label: hour.label,
        value: hour.itemsSold,
        suffix: " Artikel",
    }));

    return (
        <>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: "16px" }}>
                <Col flex="auto">
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Statistiken
                    </Typography.Title>
                </Col>
                <Col>
                    <Segmented
                        options={statsTimePeriodOptions.map((option) => ({ label: option.label, value: option.value }))}
                        value={timePeriod}
                        onChange={(value) => setTimePeriod(value as StatsTimePeriod)}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Konten" value={numAccounts} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Bankeinlagen" value={totalBankBalance} precision={2} suffix="€" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={`Umsatz (${stats.selectedPeriod.label})`}
                            value={stats.totalTurnover}
                            precision={2}
                            suffix="€"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Ø Warenkorb" value={stats.averageBasket} precision={2} suffix="€" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Einkäufe" value={stats.purchases} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Verkaufte Artikel" value={stats.itemsSold} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={24}>
                    <Card title="Umsatz pro Kiosk-Session">
                        <SimpleBarChart
                            data={sessionBars}
                            emptyText="Keine Kiosk-Sessions im ausgewählten Zeitraum."
                            maxItems={Math.max(sessionBars.length, 1)}
                            valueFormatter={formatCurrency}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={12}>
                    <Card title="Renner-Produkte">
                        <SimpleBarChart
                            data={topProductBars}
                            emptyText="Keine Produktverkäufe im ausgewählten Zeitraum."
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Stoßzeiten nach Artikeln">
                        <SimpleBarChart
                            data={hourlyDemandBars}
                            emptyText="Keine Stoßzeiten im ausgewählten Zeitraum."
                            maxItems={6}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={12}>
                    <Card title={`Top-Produkte (${stats.selectedPeriod.label})`}>
                        <Table
                            columns={topProductColumns}
                            dataSource={stats.topProducts.slice(0, 10)}
                            locale={{ emptyText: "Keine Verkäufe im ausgewählten Zeitraum." }}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={`Top-Käufer (${stats.selectedPeriod.label})`}>
                        <Table
                            columns={topShopperColumns}
                            dataSource={stats.topShoppers.slice(0, 10)}
                            locale={{ emptyText: "Keine Einkäufe im ausgewählten Zeitraum." }}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default StatsPage;
