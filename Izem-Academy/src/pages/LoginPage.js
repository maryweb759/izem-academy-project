// import React, { useEffect, useState } from "react";
// import ToggleButton from "../components/ToggleButton";
// import { Eye, EyeOff } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// import useAuthStore from "../zustand/stores/authStore";
// import { signIn } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import ErrorModal from "../components/ErrorModal";
// import useErrorStore from "../zustand/stores/useErrorStore";
// import { ClipLoader } from "react-spinners";
// import { FormattedMessage, useIntl } from "react-intl";
// import useLanguageStore from "../zustand/stores/languageStore";
// import heroimage2 from "../assets/heroimage2.png"
// import { div } from "framer-motion/m";
// const LoginSceen = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [selectedValue, setSelectedValue] = useState("login");
//   const login = useAuthStore((state) => state.login);
//   const navigate = useNavigate();
//   const [isErrorModalOpen, setErrorModalOpen] = useState(false);
//   const [loginError, setLoginError] = useState("");
//   const openErrorModal = () => setErrorModalOpen(true);
//   const closeErrorModal = () => setErrorModalOpen(false);
//   const errorMessage = useErrorStore((state) => state.errorMessage);
//   const [loading, setLoading] = useState(false);
//   const intl = useIntl();
//   const { dir } = useLanguageStore();
//   const { isLoggedIn } = useAuthStore();

//   const isRTL = dir === "rtl";

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/home");
//     }
//   }, [isLoggedIn, navigate]);

//   const handleToggleChange = (value) => {
//     setSelectedValue(value);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const response = await signIn(data);
//       login(response);

//       // Vérifiez le rôle de l'utilisateur
//       if (response.roles.includes("ROLE_ADMIN")) {
//         navigate("/dashboard");
//       } else {
//         navigate("/home");
//       }
//     } catch (error) {
//       console.error("Erreur de connexion :", error);
//       if (error.response && error.response.data.message) {
//         setLoginError(error.response.data.message);
//       } else {
//         setLoginError(errorMessage);
//       }
//       openErrorModal();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-principal p-6 sm:p-10 md:p-20">
//       <div className="w-full max-w-2xl">
//         <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
//           <FormattedMessage
//             id="Login.title"
//             defaultMessage="سجل الدخول لحسابك"
//           />
//         </h2>

//         <ToggleButton
//           selected={selectedValue}
//           onToggleChange={handleToggleChange}
//         />

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <input
//               type="email"
//               placeholder={intl.formatMessage({
//                 id: "Login.form.email.placeholder",
//                 defaultMessage: "البريد الإلكتروني",
//               })}
//               className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
//                 errors.email ? "border-main" : "border-border"
//               }`}
//               {...register("email", {
//                 required: intl.formatMessage({
//                   id: "Login.form.email.required",
//                   defaultMessage: "هذا الحقل مطلوب",
//                 }),
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: intl.formatMessage({
//                     id: "Login.form.email.invalid",
//                     defaultMessage: "البريد الإلكتروني غير صحيح",
//                   }),
//                 },
//               })}
//             />
//             {errors.email && (
//               <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div className="relative">
//             <input
//               type={passwordVisible ? "text" : "password"}
//               placeholder={intl.formatMessage({
//                 id: "Login.form.password.placeholder",
//                 defaultMessage: "كلمة السر",
//               })}
//               className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  rtl ${
//                 errors.password ? "border-main" : "border-border"
//               }`}
//               {...register("password", {
//                 required: intl.formatMessage({
//                   id: "Login.form.password.required",
//                   defaultMessage: "هذا الحقل مطلوب",
//                 }),
//                 minLength: {
//                   value: 6,
//                   message: intl.formatMessage({
//                     id: "Login.form.password.minLength",
//                     defaultMessage:
//                       "كلمة السر يجب أن تحتوي على الأقل على 6 أحرف",
//                   }),
//                 },
//               })}
//             />
//             {errors.password && (
//               <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
//                 {errors.password.message}
//               </p>
//             )}

//             <button
//               type="button"
//               onClick={() => setPasswordVisible(!passwordVisible)}
//               className={`absolute top-3 md:top-4 ${
//                 isRTL ? "left-3" : "right-3"
//               } text-gray-500 flex items-center justify-center text-center`}
//             >
//               {passwordVisible ? (
//                 <Eye className="h-5 w-5 text-main" />
//               ) : (
//                 <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
//               )}
//             </button>
//           </div>

//           <div className=" mb-6">
//             <Link
//               to="/forget-password"
//               className="text-sm md:text-[14px] font-normal font-Open leading-[22.4px] text-mainDarkColor underline hover:no-underline hover:text-main"
//             >
//               <FormattedMessage
//                 id="Login.form.forgotPassword"
//                 defaultMessage="هل نسيت كلمة السر؟"
//               />
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full h-[48px] md:h-[53px] flex items-center justify-center bg-main rounded-[8px] text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-red-600 transition"
//           >
//             {loading ? (
//               <ClipLoader color="white" size={16} />
//             ) : (
//               <FormattedMessage
//                 id="Login.form.submit"
//                 defaultMessage="تسجيل الدخول"
//               />
//             )}
//           </button>
//         </form>
//       </div>
//       <ErrorModal
//         isOpen={isErrorModalOpen}
//         closeModal={closeErrorModal}
//         message={loginError}
//       />
//     </div>
//   );
// };

// export default LoginSceen;

////////////////////////////////  ///////////////////////////

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const LoginSceen = () => {
  const { referral_code: urlReferralCode } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("register");
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl" ? true : false;

  // Set the referral_code field if it exists in the URL
  useEffect(() => {
    if (urlReferralCode) {
      setValue("referral_code", urlReferralCode);
    }
  }, [urlReferralCode, setValue]);

  const handleToggleChange = (value) => {
    setSelectedValue(value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      delete data.confirm_password;
      // If referral_code is not defined or empty, set it to null
      data.referral_code = data.referral_code?.trim()
        ? data.referral_code
        : null;
      const response = await signUp(data);
      reset();
      setSuccessMessage(response.message);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      if (error.response && error.response.data.message) {
        setLocalErrorMessage(error.response.data.message);
      } else {
        setLocalErrorMessage(errorMessage);
      }
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-principal p-6 sm:p-10 md:p-20">
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-center text-2xl md:text-[32px] leading-8 md:leading-[38.4px] font-normal font-fugaz text-mainDarkColor mb-6 sm:mb-8">
          <FormattedMessage
            id="Register.title"
            defaultMessage="أنشىء حسابك المجاني"
          />
        </h2>

        <ToggleButton
          selected={selectedValue}
          onToggleChange={handleToggleChange}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "Register.form.username.placeholder",
                defaultMessage: "اسم المستخدم",
              })}
              {...register("username", {
                required: intl.formatMessage({
                  id: "Register.form.username.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                pattern: {
                  value: /^[A-Za-z\u0600-\u06FF]+$/,
                  message: intl.formatMessage({
                    id: "Register.form.username.pattern",
                    defaultMessage:
                      "يجب أن يحتوي اسم المستخدم على أحرف فقط (بدون أرقام أو مسافات أو رموز خاصة)",
                  }),
                },
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main  ${
                errors.username ? "border-main" : "border-border"
              }`}
            />
            {errors.username && (
              <p className=" text-main font-norma font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder={intl.formatMessage({
                id: "Register.form.email.placeholder",
                defaultMessage: "البريد الإلكتروني",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main   ${
                errors.email ? "border-main" : "border-border"
              }`}
              {...register("email", {
                required: intl.formatMessage({
                  id: "Register.form.email.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: intl.formatMessage({
                    id: "Register.form.email.invalid",
                    defaultMessage: "البريد الإلكتروني غير صحيح",
                  }),
                },
              })}
            />
            {errors.email && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "Register.form.password.placeholder",
                defaultMessage: "كلمة السر",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main   ${
                errors.password ? "border-main" : "border-border"
              }`}
              {...register("password", {
                required: intl.formatMessage({
                  id: "Register.form.password.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                minLength: {
                  value: 6,
                  message: intl.formatMessage({
                    id: "Register.form.password.minLength",
                    defaultMessage:
                      "كلمة السر يجب أن تحتوي على الأقل على 6 أحرف",
                  }),
                },
              })}
            />
            {errors.password && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.password.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className={`absolute top-3 md:top-4 ${
                isRTL ? "left-3" : "right-3"
              } text-gray-500 flex items-center justify-center text-center`}
            >
              {passwordVisible ? (
                <Eye className="h-5 w-5 text-main" />
              ) : (
                <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "Register.form.confirmPassword.placeholder",
                defaultMessage: "تأكيد كلمة السر",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main   ${
                errors.confirm_password ? "border-main" : "border-border"
              }`}
              {...register("confirm_password", {
                required: intl.formatMessage({
                  id: "Register.form.confirmPassword.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
                validate: (value) =>
                  value === watch("password") ||
                  intl.formatMessage({
                    id: "Register.form.confirmPassword.mismatch",
                    defaultMessage: "كلمة السر غير متطابقة",
                  }),
              })}
            />
            {errors.confirm_password && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.confirm_password.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className={`absolute top-3 md:top-4 ${
                isRTL ? "left-3" : "right-3"
              } text-gray-500 flex items-center justify-center text-center`}
            >
              {confirmPasswordVisible ? (
                <Eye className="h-5 w-5 text-main" />
              ) : (
                <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
              )}
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "Register.form.wallet.placeholder",
                defaultMessage: "محفظة السحب TRC 20",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main   ${
                errors.rtc_wallet ? "border-main" : "border-border"
              }`}
              {...register("rtc_wallet", {
                required: intl.formatMessage({
                  id: "Register.form.wallet.required",
                  defaultMessage: "هذا الحقل مطلوب",
                }),
              })}
            />
            {errors.rtc_wallet && (
              <p className=" text-main font-normal font-raleway text-sm md:text-[14px] leading-[19.6px] tracking-[0.2px] py-1">
                {errors.rtc_wallet.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "Register.form.referralCode.placeholder",
                defaultMessage: "رمز الإحالة",
              })}
              className={`w-full px-4 py-2 h-[48px] md:h-[53px] border rounded-full focus:outline-none focus:ring-1 focus:ring-main   ${
                errors.referral_code ? "border-main" : "border-border"
              }`}
              {...register("referral_code")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] md:h-[53px] flex items-center justify-center bg-main rounded-[8px] text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-red-600 transition"
          >
            {loading ? (
              <ClipLoader color="white" size={16} />
            ) : (
              <FormattedMessage
                id="Register.form.submit"
                defaultMessage="سجل الأن"
              />
            )}
          </button>
        </form>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={() => {
          setSuccessModalOpen(false);
          navigate("/");
        }}
        message={successMessage}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={() => setErrorModalOpen(false)}
        message={localErrorMessage}
      />
    </div>
  );
};

export default LoginSceen;
