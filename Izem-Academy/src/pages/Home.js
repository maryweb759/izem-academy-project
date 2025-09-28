import React, { useState, useEffect } from "react";
import user from "../assets/user.png";
import wallet from "../assets/wallet.png";
import price from "../assets/price.png";
import account_balance_wallet from "../assets/account_balance_wallet.png";
import Insert_card from "../assets/Insert_card.png";
import Stairs_Up from "../assets/Stairs_Up.png";
import Management from "../assets/Management.png";
import Ringer_volume from "../assets/Ringer_volume.png";
import settings from "../assets/settings.png";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/users";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { dailySubscription } from "../api/subscription";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import IntroVideo from "../components/introVideo";
import { FormattedMessage } from "react-intl";
import LotteryButton from "../components/LotteryButton";
import LotteryModal from "../components/LotteryModal";
import HeroSection from '../components/HeroSection';


function Home() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [lotteryPoints, setLotteryPoints] = useState(0);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [isLotteryModalOpen, setLotteryModalOpen] = useState(false);
  const openLotteryModal = () => setLotteryModalOpen(true);
  const closeLotteryModal = () => setLotteryModalOpen(false);

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const difference = midnight - now;

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(token),
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
    return <div className="text-center py-8 text-red-500"> {message}</div>;
  }

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      const result = await dailySubscription(token);
      setSuccessMessage(result.message);
      openSuccessModal();
      await refetch();
    } catch (error) {
      if (error?.response && error?.response?.data?.message) {
        setLocalErrorMessage(error?.response?.data?.message);
      } else {
        setLocalErrorMessage(errorMessage);
      }
      openErrorModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bgColor flex flex-col items-center justify-center  p-6 sm:p-10 md:p-20">
    
      {/* Stats Grid */}
      <div className="w-full grid grid-cols-3 gap-4 py-4 sm:py-8 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-3 text-center">
          <div className="flex justify-center mb-2">
            <img src={user} alt="user" className="w-[25px] h-[25px]" />
          </div>
          <h2 className="text-base font-medium font-roboto text-mainDarkColor leading-tight tracking-tight mb-1">
            <FormattedMessage
              id="Home.loading.memberCount"
              defaultMessage="عدد الاعضاء"
            />
          </h2>
          <p className="text-darkGrey text-base font-medium font-roboto leading-snug tracking-tight">
            {userData?.total_members}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 text-center">
          <div className="flex justify-center mb-2">
            <img src={wallet} alt="wallet" className="w-[25px] h-[25px]" />
          </div>
          <p className="text-base font-medium font-roboto text-mainDarkColor leading-snug tracking-tight mb-1">
            <FormattedMessage
              id="Home.loading.withdrawnBalance"
              defaultMessage="الرصيد المسحوب"
            />
          </p>
          <p className="text-darkGrey text-base font-medium font-roboto leading-snug tracking-tight">
            {userData?.withdrawn_balance.toFixed(2)}{" "}
            <span className="text-darkGrey text-[11px] font-roboto font-normal leading-none tracking-tigh">
              <FormattedMessage id="Home.currency" defaultMessage="USDT" />
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 text-center">
          <div className="flex justify-center mb-2">
            <img src={price} alt="price" className="w-[25px] h-[25px]" />
          </div>
          <p className="text-base font-medium font-roboto text-mainDarkColor leading-snug tracking-tight mb-1">
            <FormattedMessage
              id="Home.loading.currentBalance"
              defaultMessage="الرصيد الحالي"
            />
          </p>
          <p className="text-darkGrey text-base font-medium font-roboto leading-snug tracking-tight">
            {userData?.current_balance
              ? userData.current_balance.toFixed(2)
              : "0.00"}{" "}
            <span className="text-darkGrey text-[11px] font-roboto font-normal leading-none tracking-tigh">
              <FormattedMessage id="Home.currency" defaultMessage="USDT" />
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center my-8">
        {!userData?.last_click ||
        new Date(userData?.last_click).toDateString() !==
          new Date().toDateString() ||
        userData?.acc_active ? (
          <div
            className="flex items-center cursor-pointer justify-center w-[180px] h-[180px] rounded-full shadow-md"
            style={{
              background: "conic-gradient(#FF9215,#FF3D00,#00CCE2,#FFFFFF)",
            }}
          >
            <button
              className="flex items-center justify-center cursor-pointer w-[170px] h-[170px] bg-custom-gradient rounded-full shadow-inner"
              disabled={!userData?.acc_active || loading}
              onClick={handleButtonClick}
            >
              <span className="text-[32px] font-semibold font-roboto text-center text-white">
                <FormattedMessage
                  id="Home.button.collectPoints"
                  defaultMessage="جمع النقاط"
                />
              </span>
            </button>
          </div>
        ) : (
          <div
            className="flex items-center cursor-pointer justify-center w-[180px] h-[180px] rounded-full shadow-md"
            style={{
              background: "conic-gradient(#FF9215,#FF3D00,#00CCE2,#FFFFFF)",
            }}
          >
            <button
              className="flex items-center justify-center cursor-pointer w-[170px] h-[170px] bg-white rounded-full shadow-inner"
              disabled={
                loading ||
                (!userData?.acc_active &&
                  new Date(userData?.last_click).toDateString() ===
                    new Date().toDateString())
              }
              onClick={handleButtonClick}
            >
              <span className="text-[32px] font-semibold font-roboto text-center text-secondDarkColor">
                {timeRemaining}
              </span>
            </button>
          </div>
        )}
      </div>
      {/* lottery button */}
      {userData?.display_lottery && (
        <div>
          <LotteryButton
            userData={userData}
            refetch={refetch}
            openLotteryModal={openLotteryModal}
            setLotteryPoints={setLotteryPoints}
          />
        </div>
      )}
      <div className="w-full">
        <div className="grid grid-cols-3 gap-6 py-4">
          <div
            className="text-center cursor-pointer"
            onClick={() => navigate("/payment_history")}
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={account_balance_wallet}
                className="w-10 h-10 text-white mx-auto"
                alt="payments"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage
                id="Home.nav.payments"
                defaultMessage="المدفوعات"
              />
            </p>
          </div>

          <div
            className="text-center cursor-pointer"
            onClick={() => navigate(`/withdraw/${userData?.rtc_wallet}`)}
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={Insert_card}
                className="w-10 h-10 text-white mx-auto"
                alt="withdraw"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage id="Home.nav.withdraw" defaultMessage="سحب" />
            </p>
          </div>

          <div
            className="text-center cursor-pointer"
            onClick={() => navigate("/levels")}
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={Stairs_Up}
                className="w-10 h-10 text-white mx-auto"
                alt="my levels"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage
                id="Home.nav.myLevels"
                defaultMessage="مستوياتي"
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 py-4 pt-0">
          <div
            className="text-center cursor-pointer"
            onClick={() => navigate(`/account/${userData?.referral_code}`)}
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={settings}
                className="w-10 h-10 text-white mx-auto"
                alt="my account"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage
                id="Home.nav.myAccount"
                defaultMessage="حسابي"
              />
            </p>
          </div>

          <div
            className="text-center cursor-pointer"
            onClick={() => navigate("/contact")}
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={Ringer_volume}
                className="w-10 h-10 text-white mx-auto"
                alt="contact us"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage
                id="Home.nav.contactUs"
                defaultMessage="اتصل بنا"
              />
            </p>
          </div>

          <div
            className="text-center cursor-pointer"
            onClick={() =>
              navigate(`/membership_list/${userData?.referral_code}`)
            }
          >
            <div className="bg-custom-gradient rounded-md shadow-[0px_4px_4px_0px_rgba(213,64,17,0.08)] py-8 px-4 mb-1">
              <img
                src={Management}
                className="w-10 h-10 text-white mx-auto"
                alt="membership list"
              />
            </div>
            <p className="text-sm font-normal font-roboto mainDarkColor">
              <FormattedMessage
                id="Home.nav.membershipList"
                defaultMessage="قائمة العضوية"
              />
            </p>
          </div>
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
      <LotteryModal
        setModalClose={closeLotteryModal}
        modalOpen={isLotteryModalOpen}
        lotteryPoints={lotteryPoints}
      />
    </div>
  );
}

export default Home;
