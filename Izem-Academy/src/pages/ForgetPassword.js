import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { demandeRenitialisation } from "../api/auth";
import { X } from "lucide-react";
import ErrorModal from "../components/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";

Modal.setAppElement("#root");

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await demandeRenitialisation(data);
      reset();
      setSubmittedEmail(data.email);
      setShowModal(true);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setLocalErrorMessage(error.response.data.message);
      } else {
        setLocalErrorMessage(errorMessage);
      }
      openErrorModal();
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      maxWidth: "450px",
      width: "90%",
      padding: "24px",
      borderRadius: "8px",
      border: "none",
    },
    overlay: {
      backgroundColor: "rgba(213, 64, 17, 0.21)",
      zIndex: 1000,
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-principal p-6 sm:p-8 md:p-10">
      <div className="w-full max-w-2xl">
        <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
          <FormattedMessage
            id="ForgetPassword.title"
            defaultMessage="تغيير كلمة السر"
          />
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder={intl.formatMessage({
                id: "ForgetPassword.form.email.placeholder",
                defaultMessage: "البريد الإلكتروني",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                errors.email ? "border-main" : "border-border"
              }`}
              {...register("email", {
                required: intl.formatMessage({
                  id: "ForgetPassword.form.email.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: intl.formatMessage({
                    id: "ForgetPassword.form.email.invalid",
                    defaultMessage: "البريد الإلكتروني غير صحيح",
                  }),
                },
              })}
            />
            {errors.email && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] md:h-[53px] flex items-center justify-center bg-main rounded-[8px] text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-red-600 transition"
          >
            {loading ? (
              <ClipLoader color="white" size={16} />
            ) : (
              <FormattedMessage
                id="ForgetPassword.button.submit"
                defaultMessage="تغيير كلمة السر"
              />
            )}
          </button>
        </form>
      </div>

      <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={localErrorMessage}
      />

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Password Reset Confirmation"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} color="#F64242" />
        </button>
        <div className="flex justify-center items-center py-6 h-full">
          <p className="text-[#606060] text-[16px]  font-normal font-roboto">
            <FormattedMessage
              id="ForgetPassword.modal.message"
              defaultMessage="تم إرسال رسالة إلى بريدك الإلكتروني"
            />{" "}
            <span className="text-red-500">{submittedEmail}</span>
            <br />
            <FormattedMessage
              id="ForgetPassword.modal.checkInbox"
              defaultMessage="يرجى التحقق من صندوق الوارد الخاص بك."
            />
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
