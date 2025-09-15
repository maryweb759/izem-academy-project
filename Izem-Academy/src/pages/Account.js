import React from "react";
import { ArrowRight, User, Lock, Wallet, ArrowLeft } from "lucide-react";
import useAuthStore from "../zustand/stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
import ShareLinkButton from "../components/sharedLink";
import { FormattedMessage } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function Account() {
  const { user } = useAuthStore();
  const { referral_code } = useParams();
  const navigate = useNavigate();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  return (
    <div className="w-full min-h-screen bg-[#fbfafa] flex flex-col p-6 sm:p-10 md:p-20">
      {/* Header */}
      <div className="flex mb-6 sm:mb-8">
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

      <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
        <FormattedMessage id="Account.title" defaultMessage="حسابي" />
      </h2>

      {/* User Profile Card */}
      <div className="bg-main rounded-[20px] p-4 flex items-center text-white mb-6 sm:mb-8">
        <div className="flex items-center ml-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center">
            <User className="w-11 h-11" />
          </div>
        </div>
        <div className=" gap-4">
          <div className="text-white text-lg font-medium font-montserrat leading-6">
            {user?.username}
          </div>
          <div className="text-white text-lg font-normal font-roboto leading-5">
            {user?.email}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Password Section */}
        <div
          className="p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => navigate("/change_password")}
        >
          <Lock className="w-6 h-6 text-border" />
          <div className="">
            <span className="text-[#404040] text-lg sm:text-[20px] font-semiBold font-roboto leading-none">
              <FormattedMessage
                id="Account.menu.password"
                defaultMessage="كلمة السر"
              />
            </span>
          </div>
        </div>

        {/* Wallet Section */}
        <div
          className="p-4 flex items-center gap-2 border-t border-border cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => navigate("/change_wallet")}
        >
          <Wallet className="w-6 h-6 text-border" />
          <div className="">
            <span className="text-[#404040] text-lg sm:text-[20px] font-semiBold font-roboto leading-none">
              <FormattedMessage
                id="Account.menu.wallet"
                defaultMessage="محفظة السحب TRC 20"
              />
            </span>
          </div>
        </div>

        <ShareLinkButton referral_code={referral_code} />
      </div>
    </div>
  );
}

export default Account;
