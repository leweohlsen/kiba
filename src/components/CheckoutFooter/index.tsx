import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Typography, Segmented } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import BarcodeReader from "react-barcode-reader";
import { selectCartTotal } from "../../app/selectors";
import {
    checkout,
    selectAccounts,
    selectCustomerId,
    selectCustomPrice,
    selectGroups,
    selectProducts,
    selectShoppingCart,
    setCustomPrice,
    addToCart,
} from "../../app/events.slice";
import ShoppingCart from "../ShoppingCart";
import { useDispatchAndSaveEvent } from "../App";

import "./style.css";
import { selectCurrentMenuItem, setCurrentMenuItem, setProductSearchTerm } from "../../app/ui.slice";

const { Text, Title } = Typography;

const CheckoutFooter: React.FC = () => {
    const currentTotal = useSelector(selectCartTotal);
    const customPrice = useSelector(selectCustomPrice);
    const customerId = useSelector(selectCustomerId);
    const accounts = useSelector(selectAccounts);
    const groups = useSelector(selectGroups);
    const products = useSelector(selectProducts);
    const shoppingCart = useSelector(selectShoppingCart);
    const currentMenuItem = useSelector(selectCurrentMenuItem);

    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    const handleScan = (ean: string) => {
        console.log("scanned", ean);

        const productToAdd = Object.values(products).find((p) => p.ean === parseInt(ean));
        if (!productToAdd) return;
        dispatch(addToCart(productToAdd.id));
    };

    const handleScanError = (err: Error) => {
        // TODO: display error message
        console.error(err);
    };

    const renderBuyerAccountInfo = (customerId: string) => {
        if (!customerId) return;
        const account = accounts[customerId];
        return (
            <>
                <Title level={5} style={{ marginBottom: 0 }}>
                    {account.name}
                </Title>
                <Text>{groups.find((g) => g.id === account.groupId)?.name || "Keine Gruppe"}</Text>
                <Text>Kontostand: {account.balance.toFixed(2)}€</Text>
            </>
        );
    };

    const renderTotalCheckout = (customerId: string, currentTotal: number, shoppingCart: Record<string, number>) => {
        if (!customerId) return;
        const account = accounts[customerId];
        const price = customPrice ? customPrice : currentTotal;
        const balanceAfterCheckout = account.balance - price;
        return (
            <Row gutter={16} style={{ height: "100%" }} className="checkout-footer-sum">
                <Col span={16} style={{ paddingLeft: "10px" }}>
                    <Text
                        editable={{
                            tooltip: "Sonderpreis eingeben",
                            onChange: (customPrice: string) => {
                                dispatch(setCustomPrice(parseFloat(customPrice)));
                            },
                        }}
                        style={{ fontSize: "24px" }}
                    >
                        {price.toFixed(2)}€
                    </Text>
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
                        onClick={() => {
                            dispatchAndSaveEvent(checkout({ id: uuidv4(), customerId, shoppingCart, customPrice }));
                            dispatch(setCurrentMenuItem("accounts"));
                            dispatch(setProductSearchTerm(""));
                        }}
                    >
                        Checkout
                    </Button>
                </Col>
            </Row>
        );
    };

    return (
        <>
            <BarcodeReader onError={handleScanError} onScan={handleScan} />
            <Segmented
                block
                className="checkout-footer"
                value={currentMenuItem}
                options={[
                    {
                        label: (
                            <Row gutter={16} style={{ height: "100%" }} className="checkout-footer-buyer-info">
                                <Col span={4}>
                                    <UserOutlined />
                                </Col>
                                <Col span={20}>{renderBuyerAccountInfo(customerId)}</Col>
                            </Row>
                        ),
                        value: "accounts",
                    },
                    {
                        label: (
                            <Row gutter={16} style={{ height: "100%" }} className="checkout-footer-shopping-cart">
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
