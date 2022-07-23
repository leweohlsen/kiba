import { Product } from "../../app/types";
import { Row, Col, Card, Modal, Typography, Badge } from "antd";
import {
    EditOutlined,
    PlusCircleTwoTone,
    MinusCircleTwoTone,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteProduct, removeFromCart, selectShoppingCart } from "../../app/events.slice";

import "./style.css";
import { setIsProductCreationVisible, setItemBeingEditedId } from "../../app/ui.slice";
import { useDispatchAndSaveEvent } from "../App";

const { Title } = Typography;
const { confirm } = Modal;

interface ProductGridProps {
    products: Product[];
}

const { Meta } = Card;

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    const shoppingCart = useSelector(selectShoppingCart);

    const showDeleteConfirm = (product: Product) => {
        confirm({
            title: "Sicher?",
            icon: <ExclamationCircleOutlined />,
            content: "Soll dieses Produkt wirklich gelöscht werden?",
            okText: "Ja",
            okType: "danger",
            cancelText: "Oops, nee",
            onOk() {
                dispatchAndSaveEvent(deleteProduct(product));
            },
        });
    };

    return (
        <Row gutter={[24, 24]}>
            {products.map((product) => (
                <Col className="gutter-row" span={4}>
                    <Badge className="product-badge" count={shoppingCart[product.id] || 0}>
                        <Card
                            className="product-card"
                            onClick={() => {
                                dispatch(addToCart(product.id));
                            }}
                            cover={<img className="product-image" src={"productimage://" + product.image} />}
                            actions={[
                                <PlusCircleTwoTone
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(addToCart(product.id));
                                    }}
                                />,
                                <MinusCircleTwoTone
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeFromCart(product.id));
                                    }}
                                />,
                                <EditOutlined
                                    key="edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(setItemBeingEditedId(product.id));
                                        dispatch(setIsProductCreationVisible(true));
                                    }}
                                />,
                                <DeleteOutlined
                                    key="delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showDeleteConfirm(product);
                                    }}
                                />,
                            ]}
                        >
                            <Meta
                                className="product-meta"
                                title={
                                    <Title className="product-title" level={5}>
                                        {product.name}
                                    </Title>
                                }
                                description={`${product.price.toFixed(2)} €`}
                            />
                        </Card>
                    </Badge>
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;
