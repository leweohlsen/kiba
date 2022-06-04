import { Collapse, Select, Tooltip, Button, Typography } from "antd";
import { UsergroupDeleteOutlined, UsergroupAddOutlined, UserAddOutlined } from "@ant-design/icons";

import AccountTable from "../AccountTable";
import { useDispatch, useSelector } from "react-redux";
import { selectAccounts, selectGroups } from "../../app/events.slice";
import AccountCreationModal from "../AccountCreationModal";
import {
    selectAccountSearchTerm,
    selectCurrentGroup,
    setCurrentGroup,
    setIsAccountCreationVisible,
    setIsGroupCreationVisible,
} from "../../app/ui.slice";
import { Group } from "../../app/types";
import SearchField from "../SearchField";
import { groupsColorPalette } from "../../app/constants";

import "./style.css";
import GroupCreationModal from "../GroupCreationModal";

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;

const AccountSelection = () => {
    const dispatch = useDispatch();
    const groups = useSelector(selectGroups);
    const accounts = useSelector(selectAccounts);
    const currentGroup = useSelector(selectCurrentGroup);
    const accountSearchTerm = useSelector(selectAccountSearchTerm);

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
            <GroupCreationModal />
            <AccountCreationModal />
            <Collapse
                accordion={!accountSearchTerm}
                onChange={handleChange}
                activeKey={!accountSearchTerm ? currentGroup : groups.map((g) => g.id)}
                className="account-selection-collapse"
            >
                {groups.map((group: Group, idx) => {
                    const groupAccounts = accounts
                        .filter((a) => a.groupId === group.id)
                        .filter(
                            (a) => !accountSearchTerm || a.name.toLowerCase().includes(accountSearchTerm.toLowerCase())
                        );
                    if (!groupAccounts.length) return null;
                    return (
                        <Panel
                            header={group.name}
                            key={group.id}
                            style={
                                {
                                    // backgroundColor: groupsColorPalette[idx % groupsColorPalette.length],
                                    // fontWeight: "bold",
                                }
                            }
                            extra={genExtra()}
                        >
                            <AccountTable key={group.id} accounts={groupAccounts} />
                        </Panel>
                    );
                })}
            </Collapse>
        </>
    );
};

export default AccountSelection;
