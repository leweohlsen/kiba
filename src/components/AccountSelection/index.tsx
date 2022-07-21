import { Collapse, Select, Tooltip, Button, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

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
    setItemBeingEditedId,
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
    const accountSearchTerm = useSelector(selectAccountSearchTerm);
    const currentGroup = useSelector(selectCurrentGroup);

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
                activeKey={!accountSearchTerm ? currentGroup : [...groups.map((g) => g.id), "null"]}
                className="account-selection-collapse"
            >
                {[...groups, { id: null, name: "Keine Gruppe" }].map((group: Group) => {
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
                            extra={
                                group.id && (
                                    <EditOutlined
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            dispatch(setIsGroupCreationVisible(true));
                                            dispatch(setItemBeingEditedId(group.id));
                                        }}
                                    />
                                )
                            }
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
