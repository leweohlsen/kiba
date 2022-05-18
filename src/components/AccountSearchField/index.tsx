import React, { useState } from "react";
import { AutoComplete } from "antd";
import { selectAccounts } from "../../app/events.slice";
import { useSelector } from "react-redux";

const Complete: React.FC = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const accounts = useSelector(selectAccounts);

  const onSearch = (searchText: string) => {
    setOptions(
      !searchText
        ? []
        : accounts
            .filter((a) =>
              a.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((a) => ({
              value: a.name,
            }))
    );
  };

  const onSelect = (data: string) => {
    console.log("onSelect", data);
  };

  const onChange = (data: string) => {
    setValue(data);
  };

  return (
    <div style={{ marginRight: "auto" }}>
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="Suche"
      />
    </div>
  );
};

export default () => <Complete />;
