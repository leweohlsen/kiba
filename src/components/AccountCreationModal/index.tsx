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
import { Account } from "../../app/types";
import { selectGroups, addAccount } from "../../app/events.slice";
import {
  selectIsAccountCreationVisible,
  setIsAccountCreationVisible,
} from "../../app/ui.slice";

const { Option } = Select;

const AccountCreationModal = () => {
  const dispatch = useDispatch();

  const isAccountCreationVisible = useSelector(selectIsAccountCreationVisible);
  const groups = useSelector(selectGroups);

  const onFinish = (account: Account) => {
    dispatch(addAccount(account));
    // TODO: dispatch(appendEvent())
    dispatch(setIsAccountCreationVisible(false));
  };

  const onClose = () => {
    dispatch(setIsAccountCreationVisible(false));
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="Konto erstellen"
      visible={isAccountCreationVisible}
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
          label="Kontostand"
          name="balance"
          rules={[{ required: true, message: "Bitte Kontostand eingeben!" }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Gruppe"
          name="group"
          rules={[{ required: true, message: "Bitte Gruppe auswählen!" }]}
        >
          <Select
            // placeholder="Select a option and change input text above"
            // onChange={onGenderChange}
            allowClear
          >
            {groups.map((g) => (
              <Option value={g.id}>{g.name}</Option>
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
