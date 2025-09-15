import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import { getMyplan } from "../api/users";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Pagination } from "swiper/modules";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

function Levels() {
  const navigate = useNavigate();
  const intl = useIntl();
  const token = useAuthStore((state) => state.token);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myPlan"],
    queryFn: () => getMyplan(token),
  });
  const { dir, language } = useLanguageStore();
  const isRTL = dir === "rtl";
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
  const { all_plans, my_plans } = data;

  const getLevelNom = (level, language) => {
    try {
      switch (language) {
        case "ar":
          return level.nom_ar;
        case "en":
          return level.nom_en;
        case "fr":
          return level.nom_fr;
        default:
          return level.nom_ar;
      }
    } catch (e) {
      return level.nom_ar;
    }
  };

  const getLevelColor = (levelId) => {
    switch (levelId) {
      case 1:
        return "#10B981";
      case 2:
        return "#3B82F6";
      case 3:
        return "#F59E0B";
      case 4:
        return "#F97316";
      case 5:
        return "#EF4444";
      case 6:
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="w-full bg-[#fbfafa] pb-6 sm:pb-10 md:pb-20">
      <div className="bg-custom-gradient px-6 sm:px-10 lg:px-20 pb-8 pt-4 text-white">
        <div className="py-2 flex  mb-8">
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
              <FormattedMessage
                id="Account.button.back"
                defaultMessage="عودة"
              />
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-20 -mt-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
            <FormattedMessage
              id="Levels.section.myLevels"
              defaultMessage="مستوياتي"
            />
          </h2>

          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {my_plans.map((level, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-[107px] h-[107px] rounded-full flex items-center justify-center mb-2 relative"
                    style={{
                      background: `conic-gradient(${getLevelColor(index)} ${
                        level.days_left
                      }%, #E5E7EB ${level.days_left}% 100%)`,
                    }}
                  >
                    <div className="w-[95px] h-[95px] bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="text-center text-black text-sm font-semibold font-roboto">
                        {getLevelNom(level, language)}
                      </span>
                      <span className="flex flex-col items-center justify-center">
                        <span className="text-darkGrey text-sm font-bold font-source ml-1">
                          {level.days_left}
                        </span>
                        <span className="text-darkGrey text-sm font-normal font-source">
                          <FormattedMessage
                            id="Levels.level.daysRemaining"
                            defaultMessage="يوم متبقي"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <h2 className=" text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mt-4 px-6 sm:px-10 lg:px-20 mb-6 sm:mb-8">
        <FormattedMessage
          id="Levels.section.buyLevel"
          defaultMessage="شراء مستوى"
        />
      </h2>

      <div className="px-6 sm:px-10 lg:px-20 mt-4">
        <div className="space-y-4">
          {all_plans.map((level) => {
            const isOwned = my_plans.some(
              (myLevel) => myLevel.nom_ar === level.nom_ar
            );
            return (
              <div
                key={level.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <span className="text-black font-semibold text-[14px] leading-[16.41px] font-roboto">
                    {getLevelNom(level, language)}
                  </span>
                  <p className="text-darkGrey text-base font-medium font-roboto leading-snug tracking-tight">
                    {level.prix}
                    <span className="text-darkGrey text-[11px] font-roboto font-normal leading-none tracking-tight">
                      <FormattedMessage
                        id="Levels.currency"
                        defaultMessage="USDT"
                      />
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isOwned ? (
                    <div className="w-[26px] h-[26px] bg-[#00653E] flex items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-label={intl.formatMessage({
                          id: "Levels.owned",
                          defaultMessage: "Owned Level",
                        })}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                      className="bg-main rounded-lg w-[109.41px] h-[34px] text-white text-xs font-medium font-tajawal leading-none tracking-tight hover:bg-opacity-90 transition-colors"
                      onClick={() =>
                        navigate(`/payment/${encodeURIComponent(level.nom_en)}`)
                      }
                      aria-label={level.nom_ar}
                    >
                      <FormattedMessage
                        id="Levels.button.buy"
                        defaultMessage="شراء"
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Levels;
