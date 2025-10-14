import React from "react";
import Modal from "react-modal";
import { PartyPopper } from "lucide-react";

const RegisterPopup = ({ isOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md mx-auto text-center animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Cheerful Icon */}
        <div className="w-20 h-20 bg-[#F1BF5A] flex items-center justify-center rounded-full shadow-md">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-[#1296B3]">🎉 تهانينا!</h2>

        {/* Message */}
        <p className="text-gray-700 leading-relaxed text-lg">
          تم تسجيلك بنجاح! نحن سعداء بانضمامك إلى عائلتنا التعليمية 💛  
          ابدأ رحلتك الآن، فالمعرفة بانتظارك 🚀
        </p>

        {/* Button */}
        <button
          onClick={closeModal}
          className="mt-4 px-8 py-2 bg-[#1296B3] hover:bg-[#0F7A91] text-white rounded-lg font-medium transition-all duration-300 shadow hover:shadow-lg"
        >
          لنبدأ التعلم
        </button>
      </div>
    </Modal>
  );
};

export default RegisterPopup;
