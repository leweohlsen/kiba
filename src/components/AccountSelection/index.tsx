import { Collapse, Select } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

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

const { Panel } = Collapse;
const { Option } = Select;

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
    <UserAddOutlined
      onClick={(event) => {
        event.stopPropagation();
        dispatch(setIsAccountCreationVisible(true));
      }}
    />
  );

  const handleChange = (key: string) => {
    dispatch(setCurrentGroup(key));
  };

  return (
    <>
      <AccountCreationModal />
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
