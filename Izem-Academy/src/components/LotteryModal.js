import React from "react";
import coin from "../assets/loterryMessageAssets/coin.svg";
import coinBg from "../assets/loterryMessageAssets/coinbg.svg";
import Bubbles from "../assets/loterryMessageAssets/Red_bubbles.svg";
import { X } from "lucide-react";
import useLanguageStore from "../zustand/stores/languageStore";
import { FormattedMessage } from "react-intl";

const LotteryModal = ({ setModalClose, modalOpen,lotteryPoints }) => {
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";
  return (
    <div
      className={`size-full bg-gray-400 bg-opacity-70 fixed top-0 left-0 z-50 flex items-center justify-center ${
        modalOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative">
        <div
          className={`-top-16 ${
            isRTL ? "left-0" : "right-0"
          } absolute items-center flex flex-col justify-center size-32`}
        >
          <img
            className="absolute z-10 object-fill"
            src={coinBg}
            alt="coin background"
            style={!isRTL ? { transform: "scaleX(-1)" } : {}}
          />
          <img
            className="z-20 aspect-square object-fill w-12 mb-2"
            src={coin}
            alt="coin"
            style={!isRTL ? { transform: "scaleX(-1)" } : {}}
          />
        </div>
        <img
          className={`bottom-0 ${
            isRTL ? "left-0" : "right-0"
          } absolute rounded-b-3xl`}
          src={Bubbles}
          alt="lottery message"
          style={!isRTL ? { transform: "scaleX(-1)" } : {}}
        />
        <button
          className={`absolute top-0 ${
            isRTL ? "right-0" : "left-0"
          } m-4 text-white`}
          onClick={() => setModalClose()}
        >
          <X size={24} />
        </button>
        <div className="bg-red-500 w-[90vw] sm:w-[30vw] h-[20vh] rounded-3xl flex items-center px-14">
          <div className="z-30 flex flex-col size-fit justify-center h-full">
            <h1 className="text-white text-2xl pb-4 font-semibold">
              <FormattedMessage id="Lottery.title" defaultMessage="مبروك!" />
            </h1>
            <p className="text-white text-sm">
              <FormattedMessage
                id="Lottery.messagepart1"
                defaultMessage="لقد فزت ب"
              />
              <span className="font-extrabold text-3xl text-yellow-200 px-1">
                {lotteryPoints}
              </span>
              <FormattedMessage
                id="Lottery.messagepart2"
                defaultMessage="نقاط"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryModal;
