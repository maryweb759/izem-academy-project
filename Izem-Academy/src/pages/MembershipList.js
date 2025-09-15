import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllFils } from "../api/users";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import useErrorStore from "../zustand/stores/useErrorStore";
import useAuthStore from "../zustand/stores/authStore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import CopyButton from "../components/copyComponent";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const MembershipList = () => {
  const { referral_code: urlReferralCode } = useParams();
  const { setValue } = useForm(); // Add this line
  const [referralCode, setReferralCode] = useState(""); // Create state for referral code
  // Set the referral_code field if it exists in the URL
  useEffect(() => {
    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
    }
  }, [urlReferralCode]);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [selected, setSelected] = useState("Level 1");
  // Set the referral_code field if it exists in the URL

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["membershiplist"],
    queryFn: () => getAllFils(token),
  });
  const intl = useIntl();
  const { dir } = useLanguageStore();
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

  // Filtrer les données en fonction du niveau sélectionné
  const filteredData = data.filter((item) => item.level === selected);

  // Fonction pour afficher le niveau en arabe
  const getLevelInArabic = (level) => {
    switch (level) {
      case "Level 1":
        return intl.formatMessage({
          id: "MembershipList.levels.translations.level1",
          defaultMessage: "المستوى الأول",
        });
      case "Level 2":
        return intl.formatMessage({
          id: "MembershipList.levels.translations.level2",
          defaultMessage: "المستوى الثاني",
        });
      case "Level 3":
        return intl.formatMessage({
          id: "MembershipList.levels.translations.level3",
          defaultMessage: "المستوى الثالث",
        });
      default:
        return level;
    }
  };

  const translateSubscriptions = (subscriptions) => {
    return subscriptions.map((sub) => getLevelInArabic(sub)).join(", ");
  };

  return (
    <div className="w-full min-h-screen bg-[#fbfafa] flex flex-col p-6 sm:p-10 md:p-20">
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

      <div className="w-full bg-white rounded-xl shadow-sm py-4 sm:py-8 px-4 mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className=" text-secondDarkColor font-roboto text-xl font-normal">
              <FormattedMessage
                id="MembershipList.referral.title"
                defaultMessage="رمز الاحالة"
              />
            </p>
            <p className="text-darkGrey  font-roboto text-sm font-normal">
              {referralCode}
            </p>
          </div>
          <CopyButton textToCopy={referralCode} />
        </div>
      </div>
      <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
        <FormattedMessage
          id="MembershipList.title"
          defaultMessage="قائمة العضوية"
        />
      </h2>

      {/* Tabs */}
      <div className="flex items-center justify-center w-full h-[53px] bg-white border border-gray-300 rounded-full mb-6 sm:mb-8">
        <button
          className={`${
            selected === "Level 1"
              ? "bg-custom-gradient from-red-500 to-orange-500 text-white"
              : "text-mainDarkColor"
          } w-full h-[53px] rounded-full text-[16px] leading-[22.4px] tracking-[0.2px] font-normal font-raleway`}
          onClick={() => setSelected("Level 1")}
        >
          <FormattedMessage
            id="MembershipList.tabs.level1"
            defaultMessage="أعضاء المستوى الأول"
          />
        </button>
        <button
          className={`${
            selected === "Level 2"
              ? "bg-custom-gradient from-red-500 to-orange-500 text-white"
              : "text-mainDarkColor"
          } w-full h-[53px] rounded-full text-[16px] leading-[22.4px] tracking-[0.2px] font-normal font-raleway`}
          onClick={() => setSelected("Level 2")}
        >
          <FormattedMessage
            id="MembershipList.tabs.level2"
            defaultMessage="أعضاء المستوى الثاني"
          />
        </button>
        <button
          className={`${
            selected === "Level 3"
              ? "bg-custom-gradient from-red-500 to-orange-500 text-white"
              : "text-mainDarkColor"
          } w-full h-[53px] rounded-full text-[16px] leading-[22.4px] tracking-[0.2px] font-normal font-raleway`}
          onClick={() => setSelected("Level 3")}
        >
          <FormattedMessage
            id="MembershipList.tabs.level3"
            defaultMessage="أعضاء المستوى الثالث"
          />
        </button>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full ">
          <thead className="bg-white">
            <tr>
              <th
                className={`${
                  isRTL ? "text-right" : "text-left"
                } py-3 px-4 text-mainDarkColor text-md font-semiBold font-roboto`}
              >
                <FormattedMessage
                  id="MembershipList.table.headers.level"
                  defaultMessage="المستوى"
                />
              </th>
              <th
                className={`${
                  isRTL ? "text-right" : "text-left"
                }  py-3 px-4  text-mainDarkColor text-md font-semiBold font-roboto`}
              >
                <FormattedMessage
                  id="MembershipList.table.headers.referralCode"
                  defaultMessage="رمز الإحالة"
                />
              </th>
            </tr>
          </thead>
          <tbody className="border-border border-t">
            {filteredData.map((levelData, index) =>
              levelData.fils.map((fil, filIndex) =>
                fil.subscritpion ? (
                  <tr
                    key={`${index}-${filIndex}`}
                    className="border-b border-border"
                  >
                    <td className="py-3 px-4   text-darkGrey text-md font-normal font-roboto leading-none">
                      {translateSubscriptions(fil.subscritpion)}
                    </td>
                    <td className="py-3 px-4   text-darkGrey text-md font-normal font-roboto leading-none">
                      {fil.referral_code}
                    </td>
                  </tr>
                ) : null
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembershipList;
