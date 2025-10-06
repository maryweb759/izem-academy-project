import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import SuccessModal from "../components/modals/SuccessModal";
import { renitialiserPassword, confrmRenitPassword } from "../api/auth";
import ErrorModal from "../components/modals/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { tokenRestPassword } = useParams();
  const navigate = useNavigate();
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    navigate("/");
  };
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["checkToken", tokenRestPassword],
    queryFn: () => confrmRenitPassword(tokenRestPassword),
    enabled: !!tokenRestPassword,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF3D00" size={50} />
      </div>
    );
  }

  if (isError) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : errorMessage;
    return <div className="text-center py-8 text-red-500">{message}</div>;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      delete data.confirm_password;
      data.token = tokenRestPassword;
      const result = await renitialiserPassword(data);
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
    <div className="flex items-center justify-center min-h-screen bg-principal p-6 sm:p-10 md:p-20">
      <div className="w-full max-w-md md:max-w-lg">
        <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
          <FormattedMessage
            id="ResetPassword.title"
            defaultMessage="تغيير كلمة السر"
          />
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "ResetPassword.form.password.placeholder",
                defaultMessage: "كلمة السر",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                errors.password ? "border-main" : "border-border"
              }`}
              {...register("password", {
                required: intl.formatMessage({
                  id: "ResetPassword.form.password.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                minLength: {
                  value: 8,
                  message: intl.formatMessage({
                    id: "ResetPassword.form.password.minLength",
                    defaultMessage:
                      "كلمة السر يجب أن تحتوي على الأقل على 8 أحرف",
                  }),
                },
              })}
            />
            {errors.password && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.password.message}
              </p>
            )}

            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className={`${
                isRTL ? "left-3" : "right-3"
              } absolute top-3 md:top-4 text-gray-500 flex items-center justify-center text-center`}
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
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "ResetPassword.form.confirmPassword.placeholder",
                defaultMessage: "تأكيد كلمة السر",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                errors.confirm_password ? "border-main" : "border-border"
              }`}
              {...register("confirm_password", {
                required: intl.formatMessage({
                  id: "ResetPassword.form.confirmPassword.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                validate: (value) =>
                  value === watch("password") ||
                  intl.formatMessage({
                    id: "ResetPassword.form.confirmPassword.mismatch",
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
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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
            className="w-full h-[48px] md:h-[53px] bg-main flex items-center justify-center rounded-[8px] text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-red-600 transition"
          >
            {loading ? (
              <ClipLoader color="white" size={16} />
            ) : (
              <FormattedMessage
                id="ResetPassword.button.submit"
                defaultMessage="تغيير كلمة السر"
              />
            )}
          </button>
        </form>
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

export default ResetPassword;
