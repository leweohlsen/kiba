import { Table, Space, Tooltip, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCurrentMenuItem, setIsAccountCreationVisible, setItemBeingEditedId } from "../../app/ui.slice";
import { deleteAccount, setCustomerId } from "../../app/events.slice";
import { useDispatchAndSaveEvent } from "../App";
import type { Account } from "../../app/types";

import "./style.css";

const { confirm } = Modal;

interface AccountTableProps {
    accounts: Account[];
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    const showDeleteConfirm = (account: Account) => {
        confirm({
          title: 'Sicher?',
          icon: <ExclamationCircleOutlined />,
          content: 'Soll dieses Konto wirklich gelöscht werden?',
          okText: 'Ja',
          okType: 'danger',
          cancelText: 'Oops, nee',
          onOk() {
            dispatchAndSaveEvent(deleteAccount(account));
          },
        });
      };

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
        {
            title: "Aktionen",
            key: "action",
            render: (_: any, record: Account) => (
                <Space size="middle">
                    <Tooltip title="Konto bearbeiten">
                        <Button
                            type="primary"
                            size="small"
                            ghost
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(setItemBeingEditedId(record.id));
                                dispatch(setIsAccountCreationVisible(true));
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Konto löschen">
                        <Button
                            type="primary"
                            size="small"
                            ghost
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                showDeleteConfirm(record);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
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
