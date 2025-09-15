import React from 'react';
import Modal from 'react-modal';

const ErrorModal = ({ isOpen, closeModal,message }) => {
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={closeModal}
    className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto"
    overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
  >
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Icône d'erreur */}
      <div className="w-16 h-16 bg-[#EA5455] flex items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

      {/* Texte d'information */}
      <p className="text-textModal font-semibold text-lg">
       {message}
      </p>

      {/* Bouton OK */}
      <button
        className="px-6 py-2 bg-main text-white rounded-md text-sm font-medium hover:bg-red-600 transition"
        onClick={closeModal}
      >
        OK
      </button>
    </div>
  </Modal>
  );
};

export default ErrorModal;