import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { contactUs } from "../api/users";
import SuccessModal from "../components/modals/SuccessModal";
import ErrorModal from "../components/modals/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const Contact = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await contactUs(data, token);
      reset();
      setSuccessMessage(result.message);
      openSuccessModal();
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

  return (
    <div className="w-full min-h-screen bg-[#fbfafa] p-6 sm:p-8 md:p-10">
      <div className="flex  mb-6 sm:mb-8" onClick={() => navigate(-1)}>
        <button
          className="flex items-center text-secondDarkColor "
          onClick={() => navigate(0)}
        >
          {!isRTL ? (
            <ArrowLeft className="size-6" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
          <span className="ml-2 text-sm font-medium font-tajawal leading-normal">
            <FormattedMessage id="Account.button.back" defaultMessage="عودة" />
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
            <FormattedMessage id="Contact.title" defaultMessage="اتصل بنا" />
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "Contact.form.name.placeholder",
                  defaultMessage: "الاسم",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.nom ? "border-main" : "border-border"
                }`}
                {...register("nom")}
              />
              {errors.nom && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "Contact.form.phone.placeholder",
                  defaultMessage: "رقم الهاتف",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.num_tel ? "border-main" : "border-border"
                }`}
                {...register("num_tel", {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: intl.formatMessage({
                      id: "Contact.form.phone.error",
                      defaultMessage: "رقم الهاتف غير صحيح",
                    }),
                  },
                })}
              />
              {errors.num_tel && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.num_tel.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                placeholder={intl.formatMessage({
                  id: "Contact.form.message.placeholder",
                  defaultMessage: "الرسالة",
                })}
                rows="4"
                className={`w-full px-4 py-2 border border-border rounded-[28px] focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.message ? "border-main" : "border-border"
                }`}
                {...register("message", {
                  required: intl.formatMessage({
                    id: "Contact.form.message.required",
                    defaultMessage: "هذا الحقل مطلوب",
                  }),
                })}
              ></textarea>
              {errors.message && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.message.message}
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
                  id="Contact.button.submit"
                  defaultMessage="ارسال"
                />
              )}
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={localErrorMessage}
      />
    </div>
  );
};

export default Contact;
