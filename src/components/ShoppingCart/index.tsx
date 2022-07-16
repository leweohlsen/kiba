import { Avatar, Tooltip, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts, addToCart } from "../../app/events.slice";

interface ShoppingCartProps {
    items: Record<string, number>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ items }) => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);

    return (
        <Avatar.Group
            className="shopping-cart"
            maxCount={4}
            size="large"
            maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf", marginLeft: "0px" }}
        >
            {Object.entries(items).map(([productId, quantity]) => {
                if (!quantity) return null;
                const product = products.find((p) => p.id === productId);
                return (
                    <div className="shopping-cart-item" style={{ marginRight: "8px" }}>
                        <Tooltip title={product.name} placement="top">
                            <Badge count={quantity} offset={[0, 0]}>
                                <Avatar
                                    style={{ boxShadow: "#5a5a5a 0px 0px 4px" }}
                                    src={"productimage://" + product.image}
                                />
                            </Badge>
                        </Tooltip>
                    </div>
                );
            })}
        </Avatar.Group>
    );
};

export default ShoppingCart;
