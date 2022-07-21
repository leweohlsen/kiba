import { useSelector } from "react-redux";
import { Timeline, Card } from "antd";
import {
    ShoppingCartOutlined,
    UserAddOutlined,
    UsergroupAddOutlined,
    FolderAddOutlined,
    FileAddOutlined,
    EditOutlined,
    UserDeleteOutlined,
} from "@ant-design/icons";
import { selectAccounts, selectGroups, selectTransactions } from "../../app/events.slice";
import { Transaction, Purchase, Account, Group, Product } from "../../app/types";
import ShoppingCart from "../ShoppingCart";

const TransactionsList: React.FC = () => {
    const transactions = useSelector(selectTransactions);
    const accounts = useSelector(selectAccounts);
    const groups = useSelector(selectGroups);

    const renderTransactionIcon = (transactionType: string) => {
        switch (transactionType) {
            case "events/checkout":
                return <ShoppingCartOutlined />;
            case "events/addAccount":
                return <UserAddOutlined />;
            case "events/addGroup":
                return <UsergroupAddOutlined />;
            case "events/addCategory":
                return <FolderAddOutlined />;
            case "events/addProduct":
                return <FileAddOutlined />;
            case "events/editAccount":
            case "events/editGroup":
            case "events/editProduct":
                return <EditOutlined />;
            case "events/deleteAccount":
                return <UserDeleteOutlined />;
            default:
                return null;
        }
    };

    const renderCheckoutTransaction = (t: Transaction<Purchase>) => {
        const customer = accounts.find((a) => a.id === t.payload.customerId);
        const group = groups.find((g) => g.id === customer.groupId);
        return (
            <div>
                <span style={{ marginRight: "10px" }}>
                    {customer.name} ({group?.name || "Keine Gruppe"}) kauft
                </span>
                <div style={{ padding: "10px" }}>
                    <ShoppingCart items={t.payload.shoppingCart} />
                </div>
                {t.payload.customPrice && <span>zum Sonderpreis von {t.payload.customPrice}€</span>}
            </div>
        );
    };

    const renderAddGroupTransaction = (t: Transaction<Group>) => {
        return `Gruppe ${t.payload.name} hinzugefügt`;
    };

    const renderAddUserTransaction = (t: Transaction<Account>) => {
        return `Konto ${t.payload.name} mit ${t.payload.balance.toFixed(2)}€ hinzugefügt`;
    };

    const renderEditAccountTransaction = (t: Transaction<Account>) => {
        // TODO: show what has changed
        return `Konto ${t.payload.name} bearbeitet. Kontostand: ${t.payload.balance}`;
    };

    const renderEditGroupTransaction = (t: Transaction<Group>) => {
        return `Gruppe ${t.payload.name} bearbeitet`;
    };

    const renderDeleteUserTransaction = (t: Transaction<Account>) => {
        return `Konto ${t.payload.name} gelöscht`;
    };

    const renderEditProductTransaction = (t: Transaction<Product>) => {
        return `Produkt ${t.payload.name} bearbeitet. Preis: ${t.payload.price.toFixed(2)}€`;
    };

    const renderAddCategoryTransaction = (t: Transaction<Group>) => {
        return `Kategorie ${t.payload.name} hinzugefügt`;
    };

    const renderAddProductTransaction = (t: Transaction<Product>) => {
        return `Produkt ${t.payload.name} für ${t.payload.price.toFixed(2)}€ hinzugefügt`;
    };

    const renderTransactionPayload = (transaction: Transaction<any>) => {
        switch (transaction.type) {
            case "events/checkout":
                return renderCheckoutTransaction(transaction);
            case "events/addAccount":
                return renderAddUserTransaction(transaction);
            case "events/addGroup":
                return renderAddGroupTransaction(transaction);
            case "events/addCategory":
                return renderAddCategoryTransaction(transaction);
            case "events/addProduct":
                return renderAddProductTransaction(transaction);
            case "events/deleteAccount":
                return renderDeleteUserTransaction(transaction);
            case "events/editAccount":
                return renderEditAccountTransaction(transaction);
            case "events/editGroup":
                return renderEditGroupTransaction(transaction);
            case "events/editProduct":
                return renderEditProductTransaction(transaction);
            default:
                return JSON.stringify(transaction);
        }
    };

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
                        {renderTransactionPayload(transaction)}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    );
};

export default TransactionsList;
