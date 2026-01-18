import { useState } from "react";
import Modal from "./Modal";
import Backdrop from "./Backdrop";

const Todo = ({ title, startDate, endDate, progress, assignedTo }) => {
  // modal state
  const [showModal, setShowModal] = useState(false);

  // helper methods
  const handleDelete = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    console.log(`${title} deleted!`);
    setShowModal(false);
  };
  const handleModalCancel = () => {
    console.log("Canceled");
    setShowModal(false);
  };

  // Return component
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="actions">
        <button className="btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
      {showModal && (
        <Modal onConfirm={handleModalConfirm} onCancel={handleModalCancel} />
      )}
      {showModal && <Backdrop onCancel={handleModalCancel} />}
    </div>
  );
};
export default Todo;
