import React, { useState } from "react";
import Time from "../assets/Time.png";
import { useForm } from "react-hook-form";
import copy from "../assets/copy.png";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SuccessModal from "../components/modals/SuccessModal";
import ErrorModal from "../components/modals/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import { paySubscription } from "../api/subscription";
import { ClipLoader } from "react-spinners";
import CopyButton from "../components/copyComponent";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function Payment() {
  const navigate = useNavigate();
  const { nom } = useParams();
  const token = useAuthStore((state) => state.token);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      data.plan_name = nom;
      const result = await paySubscription(data, token);
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
    <div className="w-full bg-[#fbfafa] p-6 sm:p-10 md:p-20">
      {/* Header */}
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

      {/* Previous Payments Button */}
      <div className="flex justify-end mb-6 sm:mb-8">
        <button
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-600 text-sm"
          onClick={() => navigate("/payment_history")}
        >
          <span className=" font-roboto text-mainDarkColor text-sm font-normal">
            <FormattedMessage
              id="Payment.button.history"
              defaultMessage="عمليات الدفع السابقة"
            />
          </span>
          <img
            src={Time}
            alt={intl.formatMessage({
              id: "Payment.image.time.alt",
              defaultMessage: "time",
            })}
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Payment Address wallet */}
      <div className="w-full py-4 sm:py-6 px-4 bg-white rounded-xl shadow-sm mb-3 sm:mb-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className=" text-secondDarkColor font-roboto text-lg sm:text-xl font-normal">
              <FormattedMessage
                id="Payment.address.title"
                defaultMessage="عنوان محفظة الدفع"
              />
            </p>
            <p className="text-darkGrey  font-roboto text-sm font-normal">
              <FormattedMessage
                id="Payment.address.wallet"
                defaultMessage="TXP5o4wGeuTE2MRYVV9aUQ4ZGPQocx7Xb9"
              />
            </p>
          </div>
          <CopyButton textToCopy={"TXP5o4wGeuTE2MRYVV9aUQ4ZGPQocx7Xb9"} />
        </div>
      </div>
      {/* Payment Address rip */}
      <div className="w-full py-4 sm:py-6 px-4 bg-white rounded-xl shadow-sm mb-3 sm:mb-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className=" text-secondDarkColor font-roboto text-lg sm:text-xl font-normal">
              <FormattedMessage
                id="Payment.addressRip.title"
                defaultMessage="الدفع بالدينار الجزائري"
              />
            </p>
            <p className="text-darkGrey  font-roboto text-sm font-normal">
              <FormattedMessage
                id="Payment.addressRip.wallet"
                defaultMessage="00799999001890534668"
              />
            </p>
          </div>
          <CopyButton textToCopy={"00799999001890534668"} />
        </div>
      </div>

      {/* Payment Form */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
            <FormattedMessage
              id="Payment.form.title"
              defaultMessage="ادخل معلومات الدفع"
            />
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Input */}
            <div>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "Payment.form.amount.placeholder",
                  defaultMessage: "المبلغ المدفوع",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.payed_amount ? "border-main" : "border-border"
                }`}
                {...register("payed_amount", {
                  required: intl.formatMessage({
                    id: "Payment.form.amount.required",
                    defaultMessage: "حقل المبلغ المدفوع مطلوب",
                  }),
                  validate: {
                    isNumber: (value) =>
                      !isNaN(value) ||
                      intl.formatMessage({
                        id: "Payment.form.amount.notNumber",
                        defaultMessage: "يجب أن يكون المبلغ المدفوع عددًا",
                      }),
                    isPositive: (value) =>
                      parseFloat(value) > 0 ||
                      intl.formatMessage({
                        id: "Payment.form.amount.positive",
                        defaultMessage: "المبلغ المدفوع يجب أن يكون أكبر من 0",
                      }),
                  },
                })}
              />
              {errors.payed_amount && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.payed_amount.message}
                </p>
              )}
            </div>

            {/* Receipt Upload */}
            <div className="relative">
              <input
                type="file"
                id="file-input"
                className="hidden"
                {...register("piece_jointe", {
                  required: intl.formatMessage({
                    id: "Payment.form.receipt.required",
                    defaultMessage: "حقل صورة وصل الدفع مطلوب",
                  }),
                  validate: {
                    isImage: (value) =>
                      (value &&
                        value[0] &&
                        value[0].type.startsWith("image/")) ||
                      intl.formatMessage({
                        id: "Payment.form.receipt.invalidType",
                        defaultMessage: "الملف يجب أن يكون صورة",
                      }),
                  },
                })}
              />
              <label
                htmlFor="file-input"
                className={`w-full px-4 py-2 text-[#9ca3af] h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl cursor-pointer flex items-center ${
                  errors.piece_jointe ? "border-main" : "border-border"
                }`}
              >
                <span className="flex-1 ">
                  {watch("piece_jointe") && watch("piece_jointe")[0]
                    ? watch("piece_jointe")[0].name
                    : intl.formatMessage({
                        id: "Payment.form.receipt.placeholder",
                        defaultMessage: "صورة وصل الدفع",
                      })}
                </span>
              </label>
              {errors.piece_jointe && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.piece_jointe.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] md:h-[53px] bg-main flex items-center justify-center rounded-[8px] text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-red-600 transition"
            >
              {loading ? (
                <ClipLoader color="white" size={16} />
              ) : (
                <FormattedMessage
                  id="Payment.button.submit"
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
}

export default Payment;
