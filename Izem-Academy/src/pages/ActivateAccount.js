import React from "react";
import success from "../assets/success.png";
import { activeAccount } from "../api/auth";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError } = useQuery({
    queryKey: ["activateAccount", token],
    queryFn: () => activeAccount(token),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF3D00" size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-principal p-6 sm:p-10 md:p-20">
        <div className="w-16 h-16 bg-[#EA5455] flex items-center justify-center rounded-full mb-6 sm:mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <p className="text-center text-mainDarkColor font-semibold font-roboto text-[18px] mb-6 sm:mb-8">
          <FormattedMessage
            id="ActivateAccount.error.message"
            defaultMessage="رمز غير صالح!! يرجى الاتصال بالمسؤول"
          />
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-10 sm:h-12 md:h-14 bg-main text-white rounded-lg text-sm font-inter font-medium leading-[16.94px] tracking-[0.4px]"
        >
          <FormattedMessage
            id="ActivateAccount.button.returnToLogin"
            defaultMessage="العودة إلى صفحة تسجيل الدخول"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-principal p-6 sm:p-10 md:p-20">
      <p className="text-center text-[#2DDF96] font-semibold font-roboto text-[18px] sm:text-[24px] mb-6 sm:mb-8">
        <FormattedMessage
          id="ActivateAccount.success.message"
          defaultMessage="!   تم تفعيل حسابك بنجاح"
        />
      </p>

      <img
        src={success}
        alt={
          <FormattedMessage
            id="ActivateAccount.image.alt"
            defaultMessage="success"
          />
        }
        className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto mb-6 sm:mb-8"
      />

      <button
        onClick={() => navigate("/")}
        className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-10 sm:h-12 md:h-14 bg-main text-white rounded-lg text-sm font-inter font-medium leading-[16.94px] tracking-[0.4px]"
      >
        <FormattedMessage
          id="ActivateAccount.button.start"
          defaultMessage="ابدأ الآن"
        />
      </button>
    </div>
  );
};

export default ActivateAccount;
