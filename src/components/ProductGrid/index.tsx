import { Product } from "../../app/types";
import { Row, Col, Card, Avatar } from "antd";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";

interface ProductGridProps {
    products: Product[];
}

const { Meta } = Card;

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <Row gutter={[24, 24]}>
            {products.map((product) => (
                <Col className="gutter-row" span={4}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                style={{maxHeight: 200, width: "auto", margin: "0 auto"}}
                                src={"productimage://" + product.image}
                            />
                        }
                        actions={[<PlusCircleOutlined />, <MinusCircleOutlined />, <EditOutlined key="edit" />]}
                    >
                        <Meta
                            // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
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
