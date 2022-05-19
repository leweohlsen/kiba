import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setAccountSearchTerm } from "../../app/ui.slice";

const Complete: React.FC = () => {
    const dispatch = useDispatch();

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        dispatch(setAccountSearchTerm(e.currentTarget.value));
    };

    return (
        <div style={{ marginRight: "auto" }}>
            <Input prefix={<SearchOutlined />} allowClear size="large" onChange={onChange} />
        </div>
    );
};

export default () => <Complete />;
