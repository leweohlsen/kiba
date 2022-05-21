import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  InputNumber,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../app/types";
import { selectCategories, addProduct } from "../../app/events.slice";
import {
  selectIsProductCreationVisible,
  setIsProductCreationVisible,
} from "../../app/ui.slice";
import { useDispatchAndSaveEvent } from "../App";

const { Option } = Select;

const ProductCreationModal: React.FC = () => {
  const dispatch = useDispatch();
  const dispatchAndSaveEvent = useDispatchAndSaveEvent();

  const isProductCreationVisible = useSelector(selectIsProductCreationVisible);
  const categories = useSelector(selectCategories);

  const onFinish = (product: Product) => {
    dispatchAndSaveEvent(addProduct({ ...product, id: uuidv4() }));
    dispatch(setIsProductCreationVisible(false));
  };

  const onClose = () => {
    dispatch(setIsProductCreationVisible(false));
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="Produkt erstellen"
      visible={isProductCreationVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Bitte Name eingeben!" }]}
        >
          <Input />
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
            {categories.map(c => (
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
