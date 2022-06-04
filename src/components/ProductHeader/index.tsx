import { Tooltip, Button, Layout } from "antd";
import { FolderAddOutlined, FileAddOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { setIsCategoryCreationVisible, setIsProductCreationVisible } from "../../app/ui.slice";
import SearchField from "../SearchField";

import "./style.css";

const { Header } = Layout;

const ProductHeader: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <Header className="header" style={{ padding: 0, zIndex: 1 }}>
            <div className="product-header">
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
        </Header>
    );
};

export default ProductHeader;
