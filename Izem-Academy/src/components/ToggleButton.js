import React from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

const ToggleButton = ({ selected, onToggleChange }) => {
  const navigate = useNavigate();

  const handleNavigation = (value) => {
    onToggleChange(value);
    if (value === "register") {
      navigate("/register");
    } else {
      navigate("/");
    }
  };
  return (
    <div className="flex items-center justify-center  w-full  h-[48px] md:h-[53px]   bg-white border border-gray-300 rounded-full mb-8 ">
      {/* Bouton 1 : "أنشئ حسابك" */}
      <button
        onClick={() => handleNavigation("register")}
        className={`${
          selected === "register"
            ? "bg-custom-gradient  from-red-500 to-orange-500 text-white"
            : "text-mainDarkColor"
        }  w-full  h-[53px]  rounded-full text-[16px] leading-[22.4px] tracking-[0.2px]  font-normal font-raleway`}
      >
        <FormattedMessage
          id="Register.form.toggle"
          defaultMessage="أنشئ حسابك"
        />
      </button>

      {/* Bouton 2 : "تسجيل الدخول" */}
      <button
        onClick={() => handleNavigation("login")}
        className={`${
          selected === "login"
            ? "bg-custom-gradient  from-red-500 to-orange-500 text-white"
            : "text-mainDarkColor"
        }  w-full  h-[53px]  rounded-full text-[16px] leading-[22.4px] tracking-[0.2px]  font-normal font-raleway`}
      >
        <FormattedMessage
          id="Login.form.toggle"
          defaultMessage="تسجيل الدخول"
        />
      </button>
    </div>
  );
};

export default ToggleButton;
