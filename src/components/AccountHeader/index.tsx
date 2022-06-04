import { Tooltip, Button, Layout } from "antd";
import { UsergroupAddOutlined, UserAddOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import SearchField from "../SearchField";
import { setIsGroupCreationVisible, setIsAccountCreationVisible } from "../../app/ui.slice";

const { Header } = Layout;

const AccountHeader: React.FC = () => {
    const dispatch = useDispatch();
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
