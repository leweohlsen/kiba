import { Product } from "../../app/types";
import { Row, Col, Card, Avatar } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";

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
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
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
