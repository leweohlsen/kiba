import { Col, Row, Statistic } from "antd";
import { Chart, AxisOptions } from "react-charts";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { DailySales } from "../../app/types";
import { selectStats } from "../../app/events.slice";
import { selectNumAccounts, selectTotalBankBalance } from "../../app/selectors";

const StatsPage: React.FC = () => {
    const numAccounts = useSelector(selectNumAccounts);
    const totalBankBalance = useSelector(selectTotalBankBalance);
    const stats = useSelector(selectStats);

    const primaryAxis = useMemo(
        (): AxisOptions<DailySales> => ({
            scaleType: "time",
            getValue: (datum) => new Date(datum.timestamp),
        }),
        []
    );

    const secondaryAxes = useMemo(
        (): AxisOptions<DailySales>[] => [
            {
                scaleType: "linear",
                getValue: (datum) => datum.sales,
                elementType: "line",
            },
        ],
        []
    );

    const hasSalesData = stats.dailyCategorySales.some((series) => series.data.length > 0);

    return (
        <>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="Konten" value={numAccounts} />
                </Col>
                <Col span={8}>
                    <Statistic title="Bankeinlagen" value={totalBankBalance} precision={2} suffix="€" />
                </Col>
                <Col span={8}>
                    <Statistic title="Umsatz" value={stats.totalTurnover} precision={2} suffix="€" />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "12px",
                            height: "400px",
                        }}
                    >
                        {hasSalesData ? (
                            <Chart
                                options={{
                                    data: stats.dailyCategorySales,
                                    primaryAxis,
                                    secondaryAxes,
                                }}
                            />
                        ) : (
                            <div>Noch keine Verkaufsdaten vorhanden.</div>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default StatsPage;
