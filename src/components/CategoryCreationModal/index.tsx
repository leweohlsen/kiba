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
import { Category } from "../../app/types";
import { addCategory } from "../../app/events.slice";
import { useDispatchAndSaveEvent } from '../App';
import {
  selectIsCategoryCreationVisible,
  setIsCategoryCreationVisible,
} from "../../app/ui.slice";

const CategoryCreationModal: React.FC = () => {
  const dispatch = useDispatch();
  const dispatchAndSaveEvent = useDispatchAndSaveEvent();

  const isCategoryCreationVisible = useSelector(selectIsCategoryCreationVisible);

  const onFinish = (category: Category) => {
    dispatchAndSaveEvent(addCategory({ ...category, id: uuidv4() }));
    onClose();
  };

  const onClose = () => {
    dispatch(setIsCategoryCreationVisible(false));
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="Kategorie erstellen"
      visible={isCategoryCreationVisible}
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
