import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useState } from "react";
import {
  ShopOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import AccountSelection from "../AccountSelection";
import "./style.css";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
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
  getItem("Transaktionen", "events", <UnorderedListOutlined />),
  // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
];

const SiderDemo = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState("accounts");

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrentMenuItem(e.key);
  };

  const renderContent = () => {
    switch (currentMenuItem) {
      case "accounts":
        return <AccountSelection />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu
          theme="dark"
          selectedKeys={[currentMenuItem]}
          mode="inline"
          items={menuItems}
          onClick={onClick}
        />
      </Sider>
      <Layout className="site-layout">
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content style={{ margin: "16px" }}>{renderContent()}</Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default () => <SiderDemo />;
