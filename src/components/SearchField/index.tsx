import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAccountSearchTerm,
    selectProductSearchTerm,
    setAccountSearchTerm,
    setProductSearchTerm,
} from "../../app/ui.slice";

interface SearchFieldProps {
    type: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ type }) => {
    const dispatch = useDispatch();

    const accountSearchTerm = useSelector(selectAccountSearchTerm);
    const productSearchTerm = useSelector(selectProductSearchTerm);

    const searchTerm = type === "accounts" ? accountSearchTerm : productSearchTerm;

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        switch (type) {
            case "accounts":
                dispatch(setAccountSearchTerm(e.currentTarget.value));
                break;
            case "products":
                dispatch(setProductSearchTerm(e.currentTarget.value));
                break;
            default:
                break;
        }
    };

    return (
        <div style={{ marginRight: "auto" }}>
            <Input prefix={<SearchOutlined />} allowClear size="large" onChange={onChange} value={searchTerm} />
        </div>
    );
};

export default SearchField;
