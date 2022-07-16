import { Button, Col, Row, Statistic } from "antd";
import { useSelector } from "react-redux";
import { selectStats } from "../../app/events.slice";
import { selectNumAccounts, selectTotalBankBalance } from "../../app/selectors";

const StatsPage: React.FC = () => {
    const numAccounts = useSelector(selectNumAccounts);
    const totalBankBalance = useSelector(selectTotalBankBalance);
    const stats = useSelector(selectStats);

    return (
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
    );
};

export default StatsPage;
