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
import { Group } from "../../app/types";
import { addGroup } from "../../app/events.slice";
import {
  selectIsGroupCreationVisible,
  setIsGroupCreationVisible,
} from "../../app/ui.slice";

const GroupCreationModal = () => {
  const dispatch = useDispatch();

  const isGroupCreationVisible = useSelector(selectIsGroupCreationVisible);

  const onFinish = (group: Group) => {
    dispatch(addGroup({ ...group, id: uuidv4() }));
    // TODO: dispatch(appendTransaction())
    onClose();
  };

  const onClose = () => {
    dispatch(setIsGroupCreationVisible(false));
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="Gruppe erstellen"
      visible={isGroupCreationVisible}
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

export default GroupCreationModal;
