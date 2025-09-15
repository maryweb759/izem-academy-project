import { useEffect, useState } from "react";
import ImgEnabled from "../assets/lotteryIconAssets/enabled.png";
import ImgDisabled from "../assets/lotteryIconAssets/disabled.png";
import { lotterySubscription } from "../api/subscription";
import useAuthStore from "../zustand/stores/authStore";

const LotteryButton = ({
  userData,
  refetch,
  openLotteryModal,
  setLotteryPoints,
}) => {
  const token = useAuthStore((state) => state.token);
  const [loadingLottery, setLoadingLottery] = useState(false);
  const [image, setImage] = useState(ImgDisabled);
  const [isLotteryEnabled, setIsLotteryEnabled] = useState(false);

  useEffect(() => {
    const checkLottery = () => {
      if (!userData) return;

      if (userData?.active_lottery) {
        setImage(ImgEnabled);
        setIsLotteryEnabled(true);
      }
      if (
        new Date(userData?.last_click_lottery).toDateString() ===
        new Date().toDateString()
      ) {
        setImage(ImgDisabled);
        setIsLotteryEnabled(false);
      }
    };

    checkLottery();
  }, [userData]);

  const handleClick = async () => {
    try {
      setLoadingLottery(true);
      const data = await lotterySubscription(token);
      if (data?.lottery_points) {
        setImage(ImgDisabled);
        setIsLotteryEnabled(false);
        setLotteryPoints(data.lottery_points);
        openLotteryModal();
        await refetch();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingLottery(false);
    }
  };
  return (
    <button
      className="space-y-4 ratio-square w-16 relative"
      onClick={handleClick}
      disabled={!isLotteryEnabled || loadingLottery}
    >
      <img
        className="ratio-square object-fill w-full"
        src={image}
        alt="lottery"
      />
    </button>
  );
};

export default LotteryButton;
