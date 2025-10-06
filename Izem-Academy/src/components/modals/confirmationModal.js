import React from "react";
import Modal from "react-modal";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  showReasonInput = false,
  reason,
  setReason,
  confirmColor = "primary", // 👈 new prop, default red
}) => {
  // pick button color classes based on prop
  const colorMap = {
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    primary: "bg-primary hover:bg-primary/70",
  };

  const confirmButtonColor = colorMap[confirmColor] || colorMap.red;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      ariaHideApp={false}
      className="bg-white rounded-lg shadow-xl p-6 w-[400px] mx-auto mt-40"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{message}</p>

      {showReasonInput && (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="أدخل سبب الرفض..."
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring focus:ring-red-300"
        />
      )}

      <div className="flex flex-row justify-start gap-2 mt-4">
        <button
          onClick={onConfirm}
          className={`${confirmButtonColor} text-white px-4 py-2 rounded-md`}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
