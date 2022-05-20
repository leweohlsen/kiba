import { Table } from "antd";
import type { Account } from "../../app/types";

interface AccountTableProps {
    accounts: Account[];
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
    const columns = [
        {
            key: "name",
            title: "Name",
            dataIndex: "name",
        },
        {
            key: "balance",
            title: "Kontostand",
            dataIndex: "balance",
        },
    ];

    return (
        <Table<any>
            columns={columns}
            dataSource={accounts.map(a => ({ ...a, balance: a.balance.toFixed(2) }))}
            pagination={false}
            rowKey={(account) => account.id}
        />
    );
};

export default AccountTable;
