import { Modal, Form, Input, Button, Checkbox, InputNumber, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../../app/types";
import { addCategory, selectCategories, editCategory } from "../../app/events.slice";
import { useDispatchAndSaveEvent } from "../App";
import {
    selectIsCategoryCreationVisible,
    selectItemBeingEditedId,
    setIsCategoryCreationVisible,
    setItemBeingEditedId,
} from "../../app/ui.slice";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";

const CategoryCreationModal: React.FC = () => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();
    const [form] = useForm<Category>();

    const categories = useSelector(selectCategories);
    const itemBeingEditedId = useSelector(selectItemBeingEditedId);
    const isCategoryCreationVisible = useSelector(selectIsCategoryCreationVisible);

    useEffect(() => {
        if (!itemBeingEditedId) form.resetFields();
        form.setFieldsValue(categories.find((c) => c.id === itemBeingEditedId));
    }, [itemBeingEditedId]);

    const onFinish = (category: Category) => {
        if (itemBeingEditedId) {
            dispatchAndSaveEvent(editCategory(category));
        } else {
            dispatchAndSaveEvent(addCategory({ ...category, id: uuidv4() }));
        }

        onClose();
    };

    const onClose = () => {
        dispatch(setIsCategoryCreationVisible(false));
        dispatch(setItemBeingEditedId(undefined));
        form.resetFields();
    };

    // const onFinishFailed = (errorInfo: any) => {
    //   console.log('Failed:', errorInfo);
    // };

    return (
        <Modal title="Kategorie erstellen" visible={isCategoryCreationVisible} onCancel={onClose} footer={null}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
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

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Speichern
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryCreationModal;
