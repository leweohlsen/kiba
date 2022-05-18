import { Collapse, Select, Tooltip, Button, Typography } from "antd";
import {
  UsergroupDeleteOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import AccountTable from "../AccountTable";
import { useDispatch, useSelector } from "react-redux";
import { selectAccounts, selectGroups } from "../../app/events.slice";
import AccountCreationModal from "../AccountCreationModal";
import {
  selectCurrentGroup,
  setCurrentGroup,
  setIsAccountCreationVisible,
} from "../../app/ui.slice";
import { Group } from "../../app/types";
import AccountSearchField from "../AccountSearchField";

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const AccountSelection = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);
  const accounts = useSelector(selectAccounts);
  const currentGroup = useSelector(selectCurrentGroup);

  const genExtra = () => (
    <UsergroupDeleteOutlined
      onClick={(event) => {
        event.stopPropagation();
        // TODO dispatch();
      }}
    />
  );

  const handleChange = (key: string) => {
    dispatch(setCurrentGroup(key));
  };

  return (
    <>
      <AccountCreationModal />
      <div
        style={{
          marginBottom: "16px",
          justifyContent: "flex-end",
          display: "flex",
        }}
      >
        <AccountSearchField />
        <Tooltip title="Gruppe erstellen">
          <Button
            shape="circle"
            size="large"
            icon={<UsergroupAddOutlined style={{ fontSize: "1em" }} />}
            style={{ marginLeft: "8px" }}
          />
        </Tooltip>
        <Tooltip title="Konto erstellen">
          <Button
            shape="circle"
            size="large"
            icon={<UserAddOutlined style={{ fontSize: "1em" }} />}
            style={{ marginLeft: "8px" }}
            onClick={() => dispatch(setIsAccountCreationVisible(true))}
          />
        </Tooltip>
      </div>
      <Collapse accordion onChange={handleChange} activeKey={currentGroup}>
        {groups.map((group: Group) => (
          <Panel header={group.name} key={group.id} extra={genExtra()}>
            <AccountTable
              accounts={accounts.filter((a) => a.groupId === group.id)}
            />
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default AccountSelection;
