import { Tooltip, Button, Layout } from "antd";
import { PrinterOutlined, UsergroupAddOutlined, UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import SearchField from "../SearchField";
import { setIsGroupCreationVisible, setIsAccountCreationVisible } from "../../app/ui.slice";
import { selectActiveAccounts } from "../../app/selectors";
import type { Account } from "../../app/types";

const { Header } = Layout;

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

const formatBalance = (balance: number) => balance.toFixed(2);

const buildPrintableAccountList = (accounts: Account[]) => {
    const rows = accounts
        .map(
            (account) => `
                <tr>
                    <td>${escapeHtml(account.name)}</td>
                    <td class="balance">${formatBalance(account.balance)}</td>
                </tr>
            `
        )
        .join("");

    return `
        <!doctype html>
        <html>
            <head>
                <title>Kontenliste</title>
                <style>
                    body {
                        color: #111;
                        font-family: Arial, sans-serif;
                        margin: 32px;
                    }

                    h1 {
                        font-size: 24px;
                        margin: 0 0 24px;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    th,
                    td {
                        border-bottom: 1px solid #ddd;
                        padding: 8px 0;
                        text-align: left;
                    }

                    th.balance,
                    td.balance {
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <h1>Kontenliste</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th class="balance">Kontostand</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
        </html>
    `;
};

const AccountHeader: React.FC = () => {
    const dispatch = useDispatch();
    const activeAccounts = useSelector(selectActiveAccounts);

    const printAccounts = () => {
        const sortedAccounts = [...activeAccounts].sort((a, b) => a.name.localeCompare(b.name, "de"));
        const printWindow = window.open("", "kiba-account-list");

        if (!printWindow) return;

        printWindow.document.open();
        printWindow.document.write(buildPrintableAccountList(sortedAccounts));
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <Header className="header" style={{ padding: 0, zIndex: 1 }}>
            <div
                style={{
                    marginBottom: "16px",
                    justifyContent: "flex-end",
                    display: "flex",
                }}
            >
                <SearchField type={"accounts"} />
                <Tooltip title="Konten drucken">
                    <Button
                        shape="circle"
                        size="large"
                        icon={<PrinterOutlined style={{ fontSize: "1em" }} />}
                        style={{ marginLeft: "8px" }}
                        disabled={!activeAccounts.length}
                        onClick={printAccounts}
                    />
                </Tooltip>
                <Tooltip title="Gruppe erstellen">
                    <Button
                        shape="circle"
                        size="large"
                        icon={<UsergroupAddOutlined style={{ fontSize: "1em" }} />}
                        style={{ marginLeft: "8px" }}
                        onClick={() => dispatch(setIsGroupCreationVisible(true))}
                    />
                </Tooltip>
                <Tooltip title="Konto erstellen">
                    <Button
                        shape="circle"
                        size="large"
                        icon={<UserAddOutlined style={{ fontSize: "1em" }} />}
                        style={{ marginLeft: "8px" }}
                        onClick={() => dispatch(setIsAccountCreationVisible(true))}
                    />
                </Tooltip>
            </div>
        </Header>
    );
};

export default AccountHeader;
