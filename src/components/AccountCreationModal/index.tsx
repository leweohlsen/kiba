import { Modal, Form, Input, Button, Checkbox, InputNumber, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Account } from "../../app/types";
import { selectGroups, addAccount, editAccount, selectAccounts } from "../../app/events.slice";
import {
    selectIsAccountCreationVisible,
    setIsAccountCreationVisible,
    selectItemBeingEditedId,
    setItemBeingEditedId,
} from "../../app/ui.slice";
import { useDispatchAndSaveEvent } from "../App";
import { useForm } from "antd/lib/form/Form";

const { Option } = Select;

const AccountCreationModal = () => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();
    const [form] = useForm<Account>();

    const isAccountCreationVisible = useSelector(selectIsAccountCreationVisible);
    const groups = useSelector(selectGroups);
    const accounts = useSelector(selectAccounts);
    const itemBeingEditedId = useSelector(selectItemBeingEditedId);

    useEffect(() => {
        if (!itemBeingEditedId) form.resetFields();
        form.setFieldsValue(accounts[itemBeingEditedId]);
    }, [itemBeingEditedId]);

    const onFinish = (account: Account) => {
        if (itemBeingEditedId) {
            dispatchAndSaveEvent(editAccount(account));
        } else {
            dispatchAndSaveEvent(addAccount({ ...account, id: uuidv4() }));
        }
        onClose();
    };

    const onClose = () => {
        dispatch(setIsAccountCreationVisible(false));
        dispatch(setItemBeingEditedId(undefined));
        form.resetFields();
    };

    return (
        <Modal title="Konto erstellen" visible={isAccountCreationVisible} onCancel={onClose} footer={null}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ groupId: null }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item label="ID" name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Bitte Name eingeben!" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Kontostand"
                    name="balance"
                    rules={[{ required: true, message: "Bitte Kontostand eingeben!" }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Gruppe"
                    name="groupId"
                >
                    <Select allowClear>
                        {groups.map((g) => (
                            <Option key={g.id} value={g.id}>
                                {g.name}
                            </Option>
                        ))}
                    </Select>
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

export default AccountCreationModal;
