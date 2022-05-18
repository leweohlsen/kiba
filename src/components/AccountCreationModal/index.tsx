import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAccountCreationVisible,
  setIsAccountCreationVisible,
} from "../../app/ui.slice";

const AccountCreationModal = () => {
  const dispatch = useDispatch();
  const isAccountCreationVisible = useSelector(selectIsAccountCreationVisible);
  const handleSubmit = () => {};
  const handleClose = () => {
    dispatch(setIsAccountCreationVisible(false));
  };
  return (
    <Modal
      title="Konto erstellen"
      visible={isAccountCreationVisible}
      //   onOk={handleSubmit}
      onCancel={handleClose}
    >
      
    </Modal>
  );
};

export default AccountCreationModal;
