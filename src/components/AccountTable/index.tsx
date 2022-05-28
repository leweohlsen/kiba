import { Table } from "antd";
import { useDispatch } from "react-redux";
import { setCurrentMenuItem } from "../../app/ui.slice";
import { setCustomerId } from "../../app/events.slice";
import type { Account } from "../../app/types";

import "./style.css";

interface AccountTableProps {
    accounts: Account[];
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
    const dispatch = useDispatch();
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
            render: (value: number) => value.toFixed(2),
        },
    ];

    return (
        <Table<Account>
            className="accounts-table"
            columns={columns}
            dataSource={accounts}
            pagination={false}
            rowKey={(account) => account.id}
            onRow={(record) => {
                return {
                    onClick: () => {
                        dispatch(setCustomerId(record.id));
                        dispatch(setCurrentMenuItem("products"));
                    },
                };
            }}
        />
    );
};

export default AccountTable;
