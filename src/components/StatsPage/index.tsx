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

    const renderChart = () => {
        const primaryAxis = useMemo(
            (): AxisOptions<DailySales> => ({
                getValue: (datum) => new Date(datum.timestamp),
            }),
            []
        );

        const secondaryAxes = useMemo(
            (): AxisOptions<DailySales>[] => [
                {
                    getValue: (datum) => datum.sales,
                    elementType: "line",
                },
            ],
            []
        );

        console.log(stats);
        return (
            <Chart
                options={{
                    data: stats.dailyCategorySales,
                    primaryAxis,
                    secondaryAxes,
                }}
            />
        );
    };

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
                        {renderChart()}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default StatsPage;
