import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllNotif } from "../api/users";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import useErrorStore from "../zustand/stores/useErrorStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { FormattedMessage } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function Notification() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const errorMessage = useErrorStore((state) => state.errorMessage);

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotif(token),
  });
  const { dir, language } = useLanguageStore();
  const isRTL = dir === "rtl";

  const getNotificationMessage = (Notification, Lang) => {
    switch (Lang) {
      case "ar":
        return Notification.message_ar;
      case "en":
        return Notification.message_en;
      case "fr":
        return Notification.message_fr;
      default:
        return Notification.message_ar;
    }
  };

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF3D00" size={50} />
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (isError) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : errorMessage;
    return <div className="text-center py-8 text-red-500"> {message}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-bgColor p-10 md:p-20">
      <div
        className="flex  mb-6 sm:mb-8"
        onClick={() => {
          navigate(-1);
        }}
      >
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

      <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-16">
        <FormattedMessage id="Notification.title" defaultMessage="الاشعارات" />
      </h2>

      {!notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Search className="w-16 h-16 text-[#E3E3E3] mb-4" />
          <p className="text-darlGrey font-roboto text-[18px] lineHeight[22px] font-normal">
            <FormattedMessage
              id="Notification.empty.message"
              defaultMessage="لم يتم العثور على أي بيانات"
            />
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`${
                notification.read ? "bg-white" : "bg-[#F5ECE9]"
              } px-4 py-3 transition-colors`}
            >
              <p className=" text-md text-[#404040] font-normal font-roboto leading-none">
                {getNotificationMessage(notification, language)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
