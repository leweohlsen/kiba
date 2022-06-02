import { Collapse, Select, Tooltip, Button, Typography } from "antd";
import { FolderAddOutlined, FileAddOutlined } from "@ant-design/icons";

import ProductGrid from "../ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, selectProducts } from "../../app/events.slice";
import ProductCreationModal from "../ProductCreationModal";
import {
    selectProductSearchTerm,
    selectCurrentGroup,
    setCurrentGroup,
    setIsProductCreationVisible,
    setIsCategoryCreationVisible,
} from "../../app/ui.slice";
import { Category, Group } from "../../app/types";
import SearchField from "../SearchField";
import { groupsColorPalette } from "../../app/constants";

import "./style.css";
import CategoryCreationModal from "../CategoryCreationModal";

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const ProductSelection = () => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const currentGroup = useSelector(selectCurrentGroup);
    const productSearchTerm = useSelector(selectProductSearchTerm);

    // const genExtra = () => (
    //     <UsergroupDeleteOutlined
    //         onClick={(event) => {
    //             event.stopPropagation();
    //             // TODO dispatch();
    //         }}
    //     />
    // );

    // const handleChange = (key: string) => {
    //     dispatch(setCurrentGroup(key));
    // };

    return (
        <>
            <CategoryCreationModal />
            <ProductCreationModal />
            <div
                style={{
                    marginBottom: "16px",
                    justifyContent: "flex-end",
                    display: "flex",
                }}
            >
                <SearchField type={"products"} />
                <Tooltip title="Kategorie erstellen">
                    <Button
                        shape="circle"
                        size="large"
                        icon={<FolderAddOutlined style={{ fontSize: "1em" }} />}
                        style={{ marginLeft: "8px" }}
                        onClick={() => dispatch(setIsCategoryCreationVisible(true))}
                    />
                </Tooltip>
                <Tooltip title="Produkt erstellen">
                    <Button
                        shape="circle"
                        size="large"
                        icon={<FileAddOutlined style={{ fontSize: "1em" }} />}
                        style={{ marginLeft: "8px" }}
                        onClick={() => dispatch(setIsProductCreationVisible(true))}
                    />
                </Tooltip>
            </div>
            <Collapse
                // onChange={handleChange}
                // activeKey={!productSearchTerm ? currentGroup : groups.map((g) => g.id)}
                defaultActiveKey={categories.map(c => c.id)}
                className="product-selection-collapse"
            >
                {categories.map((category: Category, idx) => {
                    const categoryProducts = products
                        .filter((p) => p.categoryId === category.id)
                        .filter(
                            (p) => !productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                        );
                    if (!categoryProducts.length) return null;
                    return (
                        <Panel
                            header={category.name}
                            key={category.id}
                            style={
                                {
                                    // backgroundColor: groupsColorPalette[idx % groupsColorPalette.length],
                                    // fontWeight: "bold",
                                }
                            }
                            // extra={genExtra()}
                        >
                            <ProductGrid key={category.id} products={categoryProducts} />
                        </Panel>
                    );
                })}
            </Collapse>
        </>
    );
};

export default ProductSelection;
