import { Modal, Form, Input, Button, Checkbox, InputNumber, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Group } from "../../app/types";
import { addGroup, editGroup, selectGroups } from "../../app/events.slice";
import { useDispatchAndSaveEvent } from "../App";
import {
    selectIsGroupCreationVisible,
    selectItemBeingEditedId,
    setIsGroupCreationVisible,
    setItemBeingEditedId,
} from "../../app/ui.slice";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";

const GroupCreationModal = () => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();
    const [form] = useForm<Group>();

    const groups = useSelector(selectGroups);
    const isGroupCreationVisible = useSelector(selectIsGroupCreationVisible);
    const itemBeingEditedId = useSelector(selectItemBeingEditedId);

    useEffect(() => {
        if (!itemBeingEditedId) form.resetFields();
        form.setFieldsValue(groups.find((g) => g.id === itemBeingEditedId));
    }, [itemBeingEditedId]);

    const onFinish = (group: Group) => {
        if (itemBeingEditedId) {
            dispatchAndSaveEvent(editGroup(group));
        } else {
            dispatchAndSaveEvent(addGroup({ ...group, id: uuidv4() }));
        }
        onClose();
    };

    const onClose = () => {
        dispatch(setIsGroupCreationVisible(false));
        dispatch(setItemBeingEditedId(undefined));
        form.resetFields();
    };

    // const onFinishFailed = (errorInfo: any) => {
    //   console.log('Failed:', errorInfo);
    // };

    return (
        <Modal
            title={itemBeingEditedId ? "Gruppe bearbeiten" : "Gruppe erstellen"}
            visible={isGroupCreationVisible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item label="ID" name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Bitte Name eingeben!" }]}>
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Speichern
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GroupCreationModal;
