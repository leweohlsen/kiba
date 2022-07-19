import { Collapse } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import ProductGrid from "../ProductGrid";
import { addToCart, selectCategories, selectProducts } from "../../app/events.slice";
import ProductCreationModal from "../ProductCreationModal";
import { selectProductSearchTerm, setIsCategoryCreationVisible, setItemBeingEditedId } from "../../app/ui.slice";
import { Category } from "../../app/types";

import "./style.css";
import CategoryCreationModal from "../CategoryCreationModal";

const { Panel } = Collapse;

const ProductSelection = () => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const productSearchTerm = useSelector(selectProductSearchTerm);

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
                defaultActiveKey={categories.map((c) => c.id)}
                className="product-selection-collapse"
            >
                {categories.map((category: Category, idx) => {
                    const categoryProducts = Object.values(products)
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
                            extra={
                                <EditOutlined
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        dispatch(setIsCategoryCreationVisible(true));
                                        dispatch(setItemBeingEditedId(category.id));
                                    }}
                                />
                            }
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
