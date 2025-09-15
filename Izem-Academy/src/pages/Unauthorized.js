import React from "react";
import { useNavigate } from "react-router-dom";
import unauthorizedImg from "../assets/unauthorized.png";
import { FormattedMessage } from "react-intl";

function Unauthorized() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fbfafa] flex flex-col items-center justify-center p-6 sm:p-10 md:p-20">
      {/* Titre */}
      <img
        src={unauthorizedImg}
        alt="unauthorized"
        className="w-[300px] h-[300px] mb-8 sm:mb-10"
      />
      <p className="text-mainDarkColor text-[20px]  font-bold font-poppins leading-[30px] mb-2">
        <FormattedMessage
          id="Unauthorized.error.title"
          defaultMessage="Opps!"
        />
      </p>
      {/* Message en arabe */}
      <p className="font-roboto text-mainDarkColor text-[16px] font-semibold leading-[30px] text-center mb-2">
        <FormattedMessage
          id="Unauthorized.error.message"
          defaultMessage="لا يسمح لك بالدخول إلى هذه الصفحة، الرجاء تسجيل الدخول أولاً"
        />
      </p>

      {/* Bouton pour retourner à la page de connexion */}
      <button
        onClick={handleGoToLogin}
        className="bg-main text-white font-roboto text-[15px] font-medium leading-[30px]  px-6 py-2 rounded-md transition duration-300"
      >
        <FormattedMessage
          id="Unauthorized.button.returnToLogin"
          defaultMessage="العودة إلى صفحة تسجيل الدخول"
        />
      </button>
    </div>
  );
}

export default Unauthorized;
