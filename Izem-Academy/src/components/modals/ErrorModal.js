import React from "react";
import Modal from "react-modal";
import { CircleX } from "lucide-react";

const ErrorModal = ({ isOpen, closeModal, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm mx-auto z-50 transform transition-all"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#FD6C75]/10 flex items-center justify-center rounded-full">
          <CircleX size={36} className="text-[#FD6C75]" strokeWidth={2.5} />
        </div>

        {/* Title + Message */}
        {/* <h2 className="text-lg font-bold text-[#FD6C75]">حدث خطأ ما 😕</h2> */}
        <p className="text-gray-700 text-base leading-relaxed px-2">{message}</p>

        {/* Button */}
        <button
          onClick={closeModal}
          className="mt-2 px-6 py-2 rounded-lg bg-[#FD6C75] hover:bg-[#e85b64] text-white font-semibold transition-colors duration-200"
        >
          حسناً
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
