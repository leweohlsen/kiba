import { useSelector } from "react-redux";
import { Timeline, Card } from "antd";
import { ShoppingCartOutlined, UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { selectTransactions } from "../../app/events.slice";
import { Transaction, Purchase } from "../../app/types";
import ShoppingCart from "../ShoppingCart";

const TransactionsList: React.FC = () => {
    const transactions = useSelector(selectTransactions);

    const renderTransactionIcon = (transactionType: string) => {
        switch (transactionType) {
            case "events/checkout":
                return <ShoppingCartOutlined />;
            case "events/addAccount":
                return <UserAddOutlined />;
            case "events/addGroup":
                return <UsergroupAddOutlined />;

            default:
                return null;
                break;
        }
    };

    // const renderPurchase = (purchase: Purchase) => {
    //     return null;
    // }

    // const renderTransactionPayload = (transaction: Transaction) => {
    //     switch (transaction.type) {
    //         case "events/checkout":
    //             return renderPurchase(transaction.payload)
    //             break;

    //         default:
    //             break;
    //     }
    // }

    return (
        <Card>
            <Timeline mode="left">
                {transactions.map((transaction) => (
                    <Timeline.Item
                        key={transaction.timestamp}
                        dot={<div style={{ fontSize: "2em" }}>{renderTransactionIcon(transaction.type)}</div>}
                        label={new Date(transaction.timestamp).toISOString()}
                        color="red"
                    >
                        {JSON.stringify(transaction)}
                        {/* renderTransactionPayload(transaction) */}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    );
};

export default TransactionsList;
