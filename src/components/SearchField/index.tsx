import type { InputRef } from "antd";

import { Input } from "antd";
import { useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAccountSearchTerm,
    selectProductSearchTerm,
    setAccountSearchTerm,
    setProductSearchTerm,
} from "../../app/ui.slice";
import { selectCustomerId } from "../../app/events.slice";

interface SearchFieldProps {
    type: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ type }) => {
    const dispatch = useDispatch();

    const accountSearchTerm = useSelector(selectAccountSearchTerm);
    const productSearchTerm = useSelector(selectProductSearchTerm);
    const customerId = useSelector(selectCustomerId);
    const searchTerm = type === "accounts" ? accountSearchTerm : productSearchTerm;

    const inputRef = useRef<InputRef>(null);

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

    useEffect(() => {
        inputRef.current.blur();
    }, [customerId])

    return (
        <div style={{ marginRight: "auto" }}>
            <Input
                prefix={<SearchOutlined />}
                autoFocus
                allowClear
                size="large"
                onChange={onChange}
                value={searchTerm}
                ref={inputRef}
            />
        </div>
    );
};

export default SearchField;
