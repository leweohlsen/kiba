import { useSelector } from "react-redux";
import { Row, Col, Button, Typography, Segmented } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { selectCurrentTotal } from "../../app/selectors";
import { checkout, selectAccounts, selectCustomerId, selectGroups, selectShoppingCart } from "../../app/events.slice";
import ShoppingCart from "../ShoppingCart";
import { useDispatchAndSaveEvent } from "../App";

import "./style.css";
import { selectCurrentMenuItem } from "../../app/ui.slice";

const { Text, Title } = Typography;

const CheckoutFooter: React.FC = () => {
    const currentTotal = useSelector(selectCurrentTotal);
    const customerId = useSelector(selectCustomerId);
    const accounts = useSelector(selectAccounts);
    const groups = useSelector(selectGroups);
    const shoppingCart = useSelector(selectShoppingCart);
    const currentMenuItem = useSelector(selectCurrentMenuItem);

    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    const renderSelectedAccount = (customerId: string) => {
        if (!customerId) return;
        const account = accounts.find((a) => a.id === customerId);
        return (
            <>
                <Title level={5} style={{ marginBottom: 0 }}>
                    {account.name} ({groups.find((g) => g.id === account.groupId).name})
                </Title>
                <Text>Kontostand: {account.balance.toFixed(2)}€</Text>
            </>
        );
    };

    const renderTotalCheckout = (customerId: string, currentTotal: number, shoppingCart: Record<string, number>) => {
        if (!customerId) return;
        const account = accounts.find((a) => a.id === customerId);
        const balanceAfterCheckout = account.balance - currentTotal;
        return (
            <Row gutter={16} style={{ height: "100%" }}>
                <Col span={16} style={{ paddingLeft: "10px" }}>
                    <Text style={{ fontSize: "32px" }}>{currentTotal.toFixed(2)}€</Text>
                    <Text style={{ color: balanceAfterCheckout < 0 ? "red" : "black" }}>
                        Kontostand danach: {balanceAfterCheckout.toFixed(2)}€
                    </Text>
                </Col>
                <Col span={8}>
                    <Button
                        size={"large"}
                        style={{ width: "100%" }}
                        type="primary"
                        disabled={!customerId || !Object.keys(shoppingCart).length}
                        onClick={() => dispatchAndSaveEvent(checkout({ id: uuidv4(), customerId, shoppingCart }))}
                    >
                        Checkout
                    </Button>
                </Col>
            </Row>
        );
    };

    return (
        <>
            <Segmented
                block
                className="checkout-footer"
                value={currentMenuItem}
                options={[
                    {
                        label: (
                            <Row gutter={16} style={{ height: "100%" }}>
                                <Col span={4}>
                                    <UserOutlined />
                                </Col>
                                <Col span={20}>{renderSelectedAccount(customerId)}</Col>
                            </Row>
                        ),
                        value: "accounts",
                    },
                    {
                        label: (
                            <Row gutter={16} style={{ height: "100%" }}>
                                <Col span={4}>
                                    <ShoppingCartOutlined />
                                </Col>
                                {Object.keys(shoppingCart).length > 0 && (
                                    <Col span={20}>
                                        <ShoppingCart items={shoppingCart} />
                                    </Col>
                                )}
                            </Row>
                        ),
                        value: "products",
                    },
                    {
                        label: renderTotalCheckout(customerId, currentTotal, shoppingCart),
                        value: null,
                        disabled: true,
                    },
                ]}
            />
        </>
    );
};

export default CheckoutFooter;
