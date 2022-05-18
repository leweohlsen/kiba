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
    <>
      <Table<Account>
        columns={columns}
        dataSource={accounts}
        pagination={false}
      />
    </>
  );
};

export default AccountTable;
