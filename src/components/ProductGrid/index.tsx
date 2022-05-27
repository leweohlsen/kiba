import { Product } from "../../app/types";
import { Row, Col, Card, Avatar } from "antd";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, selectShoppingCart } from "../../app/events.slice";

interface ProductGridProps {
    products: Product[];
}

const { Meta } = Card;

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const dispatch = useDispatch();
    const shoppingCart = useSelector(selectShoppingCart);

    return (
        <Row gutter={[24, 24]}>
            {products.map((product) => (
                <Col className="gutter-row" span={4}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                style={{ maxHeight: 200, width: "auto", margin: "0 auto" }}
                                src={"productimage://" + product.image}
                            />
                        }
                        actions={[
                            <PlusCircleOutlined onClick={() => dispatch(addToCart(product.id))} />,
                            <MinusCircleOutlined onClick={() => dispatch(removeFromCart(product.id))} />,
                            <EditOutlined key="edit" />,
                        ]}
                    >
                        <Meta
                            avatar={shoppingCart[product.id] && <Avatar>{shoppingCart[product.id]}x</Avatar>}
                            title={product.name}
                            // description="This is the description"
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;
