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
