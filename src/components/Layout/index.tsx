import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { ShopOutlined, TeamOutlined, UnorderedListOutlined, LineChartOutlined } from "@ant-design/icons";

import AccountSelection from "../AccountSelection";
import ProductSelection from "../ProductSelection";
import TransactionsList from "../TransactionsList";
import AccountHeader from "../AccountHeader";
import ProductHeader from "../ProductHeader";
import StatsPage from "../StatsPage";

import "./style.css";
import CheckoutFooter from "../CheckoutFooter";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMenuItem, setCurrentMenuItem } from "../../app/ui.slice";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const menuItems: MenuItem[] = [
    getItem("Konten", "accounts", <TeamOutlined />),
    getItem("Produkte", "products", <ShopOutlined />),
    getItem("Transaktionen", "transactions", <UnorderedListOutlined />),
    getItem("Statistiken", "stats", <LineChartOutlined />),
];

const SiderDemo = () => {
    const [collapsed, setCollapsed] = useState(false);
    const currentMenuItem = useSelector(selectCurrentMenuItem);

    const dispatch = useDispatch();

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const onClick: MenuProps["onClick"] = (e) => {
        console.log("click ", e);
        dispatch(setCurrentMenuItem(e.key));
    };

    const renderContent = () => {
        switch (currentMenuItem) {
            case "accounts":
                return <AccountSelection />;
            case "products":
                return <ProductSelection />;
            case "transactions":
                return <TransactionsList />;
            case "stats":
                return <StatsPage />
            default:
                return null;
        }
    };

    const renderHeader = () => {
        switch (currentMenuItem) {
            case "accounts":
                return <AccountHeader />;
            case "products":
                return <ProductHeader />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ overflow: "hidden", zIndex: 99 }}>
                <div className="logo">🧃</div>
                <Menu theme="dark" selectedKeys={[currentMenuItem]} mode="inline" items={menuItems} onClick={onClick} />
            </Sider>
            <Layout className="site-layout">
                {renderHeader()}
                <Content style={{ padding: "16px", overflowY: "scroll", height: "calc(100vh - 200px)" }}>
                    {renderContent()}
                </Content>
                <Footer style={{ backgroundColor: "white", height: "100px", padding: 0 }}>
                    <CheckoutFooter />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default () => <SiderDemo />;
