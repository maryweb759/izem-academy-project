import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPAiementByUser } from "../api/subscription";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import useErrorStore from "../zustand/stores/useErrorStore";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function PaymentHistory() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const intl = useIntl();

  const {
    data: payments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      intl.formatMessage({
        id: "PaymentHistory.queryKey",
        defaultMessage: "payments",
      }),
    ],
    queryFn: () => getAllPAiementByUser(token),
  });
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  // Loading display
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF3D00" size={50} />
      </div>
    );
  }

  // Error display
  if (isError) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : errorMessage;
    return <div className="text-center py-8 text-red-500">{message}</div>;
  }

  // Function to map payment status to icon and text
  const getStatusDetails = (etat) => {
    switch (etat) {
      case "approved":
        return {
          status: intl.formatMessage({
            id: "PaymentHistory.status.completed",
            defaultMessage: "مكتمل",
          }),
          icon: <CheckCircle className="text-[#00653E] w-[26px] h-[26px]" />,
        };
      case "rejected":
        return {
          status: intl.formatMessage({
            id: "PaymentHistory.status.incomplete",
            defaultMessage: "غير مكتمل",
          }),
          icon: <XCircle className="text-[#FF3D00] w-[26px] h-[26px]" />,
        };
      case "pending":
        return {
          status: intl.formatMessage({
            id: "PaymentHistory.status.pending",
            defaultMessage: "قيد المراجعة",
          }),
          icon: <Clock className="text-[#FFD015] w-[26px] h-[26px]" />,
        };
      default:
        return {
          status: intl.formatMessage({
            id: "PaymentHistory.status.unknown",
            defaultMessage: "غير معروف",
          }),
          icon: <Clock className="text-gray-500 w-[26px] h-[26px]" />,
        };
    }
  };

  return (
    <div className="w-full bg-[#fbfafa] min-h-screen p-6 sm:p-10 md:p-20">
      {/* Header */}
      <div className="flex  mb-6 sm:mb-8">
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

      {/* Title */}
      <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
        <FormattedMessage
          id="PaymentHistory.title"
          defaultMessage="عمليات الدفع السابقة"
        />
      </h2>

      {!payments || payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Search className="w-16 h-16 text-[#E3E3E3] mb-4" />
          <p className="text-darlGrey font-roboto text-[18px] lineHeight[22px] font-normal">
            <FormattedMessage
              id="PaymentHistory.empty.message"
              defaultMessage="لم يتم العثور على أي بيانات"
            />
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Payment List */}
            <div className="space-y-4">
              {payments.map((payment) => {
                const { status, icon } = getStatusDetails(payment.etat);
                return (
                  <div
                    key={payment.paiement_id}
                    className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl transition-transform hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className=" text-black text-sm font-semibold font-roboto Lineheight-[16.41px]">
                          {payment.amount}{" "}
                          <FormattedMessage
                            id="PaymentHistory.currency"
                            defaultMessage="USDT"
                          />
                        </p>
                        <p className=" text-darkGrey text-sm font-normal font-['Source Sans Pro']">
                          {new Date(payment.payed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8">
                        {icon}
                      </div>
                    </div>
                    <p className="text-darkGrey text-sm font-normal font-['Source Sans Pro']">
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
