import { Modal, Form, Input, Button, Upload, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../app/types";
import { selectCategories, addProduct, editProduct, selectProducts } from "../../app/events.slice";
import {
    selectIsProductCreationVisible,
    selectNewProductImage,
    setIsProductCreationVisible,
    selectItemBeingEditedId,
    setItemBeingEditedId,
} from "../../app/ui.slice";
import { useDispatchAndSaveEvent } from "../App";
import { useForm } from "antd/lib/form/Form";

const { Option } = Select;

const ProductCreationModal: React.FC = () => {
    const dispatch = useDispatch();
    const dispatchAndSaveEvent = useDispatchAndSaveEvent();

    const isProductCreationVisible = useSelector(selectIsProductCreationVisible);
    const newProductImage = useSelector(selectNewProductImage);
    const categories = useSelector(selectCategories);
    const itemBeingEditedId = useSelector(selectItemBeingEditedId);
    const products = useSelector(selectProducts);

    const [form] = useForm<Product>();

    const newProductId = uuidv4();

    useEffect(() => {
        if (!itemBeingEditedId) form.resetFields();
        form.setFieldsValue(products[itemBeingEditedId]);
    }, [itemBeingEditedId, products]);

    const onFinish = (product: Product) => {
        if (itemBeingEditedId) {
            dispatchAndSaveEvent(editProduct(product));
        } else {
            dispatchAndSaveEvent(addProduct({ ...product, id: newProductId, image: newProductImage }));
        }
        onClose();
    };

    const onClose = () => {
        dispatch(setIsProductCreationVisible(false));
        dispatch(setItemBeingEditedId(undefined));
        form.resetFields();
    };

    // const onFinishFailed = (errorInfo: any) => {
    //   console.log('Failed:', errorInfo);
    // };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Modal title="Produkt erstellen" visible={isProductCreationVisible} onCancel={onClose} footer={null}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: false }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item label="ID" name="id" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="image">
                    {/* <Upload
                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={[]}
                        // onPreview={this.handlePreview}
                        onChange={() => {}}
                    >
                        {uploadButton}
                    </Upload> */}
                    {newProductImage && <img height="200" src={"productimage://" + newProductImage} />}
                    <Button
                        onClick={() => {
                            window.electronAPI.selectProductImage(newProductId);
                        }}
                    >
                        Upload image
                    </Button>
                </Form.Item>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Bitte Name eingeben!" }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="EAN" name="ean">
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Preis"
                    name="price"
                    rules={[{ required: true, message: "Bitte Kontostand eingeben!" }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Kategorie"
                    name="categoryId"
                    rules={[{ required: true, message: "Bitte Kategorie auswählen!" }]}
                >
                    <Select
                        // placeholder="Select a option and change input text above"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        {categories.map((c) => (
                            <Option key={c.id} value={c.id}>
                                {c.name}
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

export default ProductCreationModal;
