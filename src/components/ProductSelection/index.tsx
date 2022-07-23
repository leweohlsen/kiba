import { Collapse } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import ProductGrid from "../ProductGrid";
import { selectCategories } from "../../app/events.slice";
import ProductCreationModal from "../ProductCreationModal";
import { selectProductSearchTerm, setIsCategoryCreationVisible, setItemBeingEditedId } from "../../app/ui.slice";
import { Category } from "../../app/types";

import "./style.css";
import CategoryCreationModal from "../CategoryCreationModal";
import { selectActiveProducts } from "../../app/selectors";

const { Panel } = Collapse;

const ProductSelection = () => {
    const dispatch = useDispatch();

    const categories = useSelector(selectCategories);
    const activeProducts = useSelector(selectActiveProducts);
    const productSearchTerm = useSelector(selectProductSearchTerm);

    return (
        <>
            <CategoryCreationModal />
            <ProductCreationModal />
            <Collapse defaultActiveKey={categories.map((c) => c.id)} className="product-selection-collapse">
                {categories.map((category: Category, idx) => {
                    const categoryProducts = activeProducts
                        .filter((p) => p.categoryId === category.id)
                        .filter(
                            (p) => !productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                        );
                    if (!categoryProducts.length) return null;
                    return (
                        <Panel
                            header={category.name}
                            key={category.id}
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
