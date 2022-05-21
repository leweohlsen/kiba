import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setAccountSearchTerm, setProductSearchTerm } from "../../app/ui.slice";

interface SearchFieldProps {
    type: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ type }) => {
    const dispatch = useDispatch();

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
            <Input prefix={<SearchOutlined />} allowClear size="large" onChange={onChange} />
        </div>
    );
};

export default SearchField;
