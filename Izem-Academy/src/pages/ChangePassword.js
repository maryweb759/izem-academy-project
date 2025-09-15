import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changeMyPassword } from "../api/users";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      delete data.confirm_password;
      const result = await changeMyPassword(data, token);
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
    <div className="w-full min-h-screen bg-[#fbfafa] p-6 sm:p-10 md:p-20">
      <div className="flex  mb-6 sm:mb-8" onClick={() => navigate(-1)}>
        <button
          className="flex items-center text-secondDarkColor "
          onClick={() => navigate(-1)}
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
            <FormattedMessage
              id="ChangePassword.title"
              defaultMessage="تغيير كلمة السر"
            />
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder={intl.formatMessage({
                  id: "ChangePassword.form.oldPassword.placeholder",
                  defaultMessage: "كلمة السر الحالية",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.oldPassword ? "border-main" : "border-border"
                }`}
                {...register("oldPassword", {
                  required: intl.formatMessage({
                    id: "ChangePassword.form.oldPassword.required",
                    defaultMessage: "هذا الحقل مطلوب",
                  }),
                })}
              />
              {errors.oldPassword && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.oldPassword.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={` ${
                  isRTL ? "left-3" : "right-3"
                } absolute top-3 md:top-4  text-gray-500 flex items-center justify-center text-center`}
              >
                {passwordVisible ? (
                  <Eye className="h-5 w-5 text-main" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={newPasswordVisible ? "text" : "password"}
                placeholder={intl.formatMessage({
                  id: "ChangePassword.form.newPassword.placeholder",
                  defaultMessage: "كلمة السر الجديدة",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.newPassword ? "border-main" : "border-border"
                }`}
                {...register("newPassword", {
                  required: intl.formatMessage({
                    id: "ChangePassword.form.newPassword.required",
                    defaultMessage: "هذا الحقل مطلوب",
                  }),
                  minLength: {
                    value: 8,
                    message: intl.formatMessage({
                      id: "ChangePassword.form.newPassword.minLength",
                      defaultMessage:
                        "كلمة السر يجب أن تحتوي على الأقل على 8 أحرف",
                    }),
                  },
                })}
              />
              {errors.newPassword && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.newPassword.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                className={` ${
                  isRTL ? "left-3" : "right-3"
                } absolute top-3 md:top-4 text-gray-500 flex items-center justify-center text-center`}
              >
                {newPasswordVisible ? (
                  <Eye className="h-5 w-5 text-main" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder={intl.formatMessage({
                  id: "ChangePassword.form.confirmPassword.placeholder",
                  defaultMessage: "تأكيد كلمة السر الجديدة",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.confirm_password ? "border-main" : "border-border"
                }`}
                {...register("confirm_password", {
                  required: intl.formatMessage({
                    id: "ChangePassword.form.confirmPassword.required",
                    defaultMessage: "هذا الحقل مطلوب",
                  }),
                  validate: (value) =>
                    value === watch("newPassword") ||
                    intl.formatMessage({
                      id: "ChangePassword.form.confirmPassword.mismatch",
                      defaultMessage: "كلمة السر غير متطابقة",
                    }),
                })}
              />
              {errors.confirm_password && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.confirm_password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className={` ${
                  isRTL ? "left-3" : "right-3"
                } absolute top-3 md:top-4 text-gray-500 flex items-center justify-center text-center`}
              >
                {confirmPasswordVisible ? (
                  <Eye className="h-5 w-5 text-main" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
                )}
              </button>
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
                  id="ChangePassword.button.submit"
                  defaultMessage="تغيير كلمة السر"
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

export default ChangePassword;
