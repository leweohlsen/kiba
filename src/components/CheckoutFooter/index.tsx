import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Statistic, Button, Avatar, Typography, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { selectCurrentTotal } from "../../app/selectors";
import { checkout, selectAccounts, selectCustomerId, selectShoppingCart } from "../../app/events.slice";
import ShoppingCart from "../ShoppingCart";
import { useDispatchAndSaveEvent } from "../App";

const { Text } = Typography;

const CheckoutFooter: React.FC = () => {
    const currentTotal = useSelector(selectCurrentTotal);
    const customerId = useSelector(selectCustomerId);
    const accounts = useSelector(selectAccounts);
    const shoppingCart = useSelector(selectShoppingCart);

    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    return (
        <Row gutter={16}>
            <Col span={4}>
                {customerId && (
                    <Row>
                        <Col>
                            <Avatar>
                                <UserOutlined />
                            </Avatar>
                        </Col>
                        <Col>
                            <Text style={{ lineHeight: "32px", marginLeft: "8px" }}>
                                {accounts.find((a) => a.id === customerId).name}
                            </Text>
                        </Col>
                    </Row>
                )}
                <Divider type="vertical" />
            </Col>
            <Col span={10}>
                {Object.keys(shoppingCart).length > 0 && (
                    <>
                        <Text style={{ marginRight: "16px" }}>kauft</Text>
                        <ShoppingCart items={shoppingCart} />
                    </>
                )}
            </Col>
            <Col span={4}>
                <Text style={{ fontSize: "32px", fontWeight: "bold" }}>{currentTotal.toFixed(2) + "€"}</Text>
            </Col>
            <Col span={6}>
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

export default CheckoutFooter;
