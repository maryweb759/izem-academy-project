import React, { useState } from "react";
import Time from "../assets/Time.png";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { addWithDraw } from "../api/withdraw";
import SuccessModal from "../components/modals/SuccessModal";
import ErrorModal from "../components/modals/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function Withdraw() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = useAuthStore((state) => state.token);
  const { rtc_wallet } = useParams();
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
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 10 || currentHour >= 17) {
      setLocalErrorMessage(
        intl.formatMessage({
          id: "Withdraw.error.timeRestriction",
          defaultMessage:
            "السحب يكون من الساعة 10:00 صباحا حتى الساعة 17:00 مساء",
        })
      );
      openErrorModal();
      return;
    }
    setLoading(true);
    try {
      const result = await addWithDraw(data, token);
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

      <div className="flex justify-end mb-6 sm:mb-8">
        <button
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-600 text-sm"
          onClick={() => navigate("/withdraw_history")}
        >
          <span className=" font-roboto text-mainDarkColor text-sm font-normal">
            <FormattedMessage
              id="Withdraw.button.history"
              defaultMessage="عمليات السحب السابقة"
            />
          </span>
          <img
            src={Time}
            alt={intl.formatMessage({
              id: "Withdraw.image.time.alt",
              defaultMessage: "time",
            })}
            className="w-6 h-6"
          />
        </button>
      </div>

      <div className="bg-white rounded-md shadow-md p-6 sm:p-8 md:p-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
            <FormattedMessage id="Withdraw.title" defaultMessage="السحب" />
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              value={rtc_wallet}
              className="w-full px-4 py-2 h-[48px] md:h-[53px] border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-main  bg-gray-100 cursor-not-allowed opacity-80"
              disabled
            />

            <div className="mb-2">
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "Withdraw.form.amount.placeholder",
                  defaultMessage: "مبلغ السحب",
                })}
                className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
                  errors.withdraw_point ? "border-main" : "border-border"
                }`}
                {...register("withdraw_point", {
                  required: intl.formatMessage({
                    id: "Withdraw.form.amount.required",
                    defaultMessage: "هذا الحقل مطلوب",
                  }),
                  validate: (value) => {
                    const amount = parseFloat(value);
                    if (isNaN(amount))
                      return intl.formatMessage({
                        id: "Withdraw.form.amount.invalid",
                        defaultMessage: "يجب أن يكون المبلغ عددًا",
                      });
                    if (amount < 19)
                      return intl.formatMessage({
                        id: "Withdraw.form.amount.minimum",
                        defaultMessage: "يجب أن يكون المبلغ 19 أو أكثر",
                      });
                    return true;
                  },
                })}
              />
              {errors.withdraw_point && (
                <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                  {errors.withdraw_point.message}
                </p>
              )}

              <p className=" text-main text-sm mt-1">
                <FormattedMessage
                  id="Withdraw.form.withdrawTime"
                  defaultMessage="السحب يكون من الساعة 10:00 صباحا حتى الساعة 17:00 مساء"
                />
              </p>
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
                  id="Withdraw.button.submit"
                  defaultMessage="سحب"
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

export default Withdraw;
