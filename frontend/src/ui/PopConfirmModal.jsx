import { Modal, message } from "antd";
import PropTypes from "prop-types";

const PopConfirmModal = ({
  isModalOpen,
  setIsModalOpen,
  postData,
  endpoint,
  //   submitMessage,
  //   setSubmitMessage,
}) => {
  const handleOk = async () => {
    try {
      const fetchedData = await postData(endpoint, {});
      console.log(fetchedData);
      //   setSubmitMessage("Chat ended succefully.");
      message.success("Chat ended succefully.");
    } catch (err) {
      console.error(err.message);
      //   setSubmitMessage("Chat close failed.");
      message.error("Chat close failed.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Confirm End Chat"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <p>Are you sure you want close this chat?</p>
      <p>Clicking OK will end the chat.</p>
    </Modal>
  );
};

PopConfirmModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.node,
  postData: PropTypes.func,
  endpoint: PropTypes.string,
  //   submitMessage: PropTypes.string,
  //   setSubmitMessage: PropTypes.node,
};

export default PopConfirmModal;
