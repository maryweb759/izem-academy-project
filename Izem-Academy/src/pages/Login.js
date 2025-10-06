import React, { useEffect, useState } from "react";
import ToggleButton from "../components/ToggleButton";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import useAuthStore from "../zustand/stores/authStore";
import { signIn } from "../api/auth";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/modals/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";
import heroimage2 from "../assets/heroimage2.png"
import TestimonialsSlider from '../components/TestimonialsSlider';
import FormInput from "../components/FormInput";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("login");
  const login = useAuthStore((state) => state.authenticate);
  const navigate = useNavigate();
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const { dir } = useLanguageStore();
const { isLoggedIn, role } = useAuthStore();  // ⬅️ pull role from store

  const isRTL = dir === "rtl";

  useEffect(() => {
  if (isLoggedIn) {
    if (role === "student") {
      navigate("/student_dashboard");
    } else if (role === "admin") {
      navigate("/admin_dashboard");
    } else {
      navigate("/home");
    }
  }
}, [isLoggedIn, role, navigate]);

  const handleToggleChange = (value) => {
    setSelectedValue(value);
  };

 const onSubmit = async (data) => {
  setLoading(true);
  try {
    const response = await signIn(data);
    login(response);

    console.log("User role from API:", response.role);

    if (response.role === "student") {
      navigate("/student_dashboard");
    } else if (response.role === "admin") {
      navigate("/admin_dashboard");
    } else {
      navigate("/home");
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
    if (error.response?.data?.message) {
      setLoginError(error.response.data.message);
    } else {
      setLoginError(error.message || errorMessage);
    }
    openErrorModal();
  } finally {
    setLoading(false);
  }
};




  return (
    <div> 
<section className="relative w-full h-[30vh]">
      {/* Background Image */}
      <img
        src={heroimage2}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay (optional dark layer) */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4">
                         <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold font-inter text-mainDarkColor mb-6 leading-tight">

          {/* <h1 className="text-2xl md:text-4xl font-bold text-mainDarkColor leading-relaxed"> */}
            إبدا رحلتك{" "}
            <span className="text-primary">التعليمية</span> بخبرة وجودة
            وسعر مناسب نحو{" "}
            <span className="text-primary">نجاح</span> ثابت.
          </h1>
        </div>
      </div>
    </section>
    <div className="w-full bg-customBlue shadow-lg px-6 py-6">
  <div className="container mx-auto  text-center">
    {/* Title */}
<h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold font-inter text-mainDarkColor mb-4 leading-tight">
تسجيل الدخول    </h1>

    {/* Paragraph */}
<p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto">

    {/* <p className="text-base md:text-lg text-gray-700 max-w-2xl mb-6"> */}
ادخل علي حسابك بإدخال رقم الهاتف و كلمة المرور المسجل بهم من قبل.
    </p>

    {/* Container (example button or box) */}

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Fields Wrapper */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Phone Number */}
  <FormInput
    id="phone"
    label="رقم الهاتف"
    placeholder="53 30 37 69 05"
    register={register}
    errors={errors}
    Icon={Phone}
    validationRules={{
      required: "هذا الحقل مطلوب",
      pattern: {
        value: /^(05|06|07)\d{8}$/,
        message: "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام",
      },
    }}
  />

  {/* Password */}
  <FormInput
    id="password"
    label="كلمة السر"
    labelNote="(إذا نسيت كلمة السر تواصل معنا)"
    placeholder={intl.formatMessage({
      id: "Login.form.password.placeholder",
      defaultMessage: "كلمة السر",
    })}
    register={register}
    errors={errors}
    Icon={Lock}
    showPasswordToggle={true}
    passwordVisible={passwordVisible}
    onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
    isRTL={isRTL}
    validationRules={{
      required: intl.formatMessage({
        id: "Login.form.password.required",
        defaultMessage: "هذا الحقل مطلوب",
      }),
      minLength: {
        value: 6,
        message: intl.formatMessage({
          id: "Login.form.password.minLength",
          defaultMessage: "كلمة السر يجب أن تحتوي على الأقل على 6 أحرف",
        }),
      },
    }}
  />
</div>
       <button
  type="submit"
  disabled={loading}
  className="w-full h-[48px] md:h-[53px] flex items-center justify-center bg-primary rounded-full text-white font-normal font-Open text-sm md:text-[14px] leading-[22.4px] hover:bg-primary-hover transition mt-4"
>
  {loading ? (
    <ClipLoader color="white" size={16} />
  ) : (
    <FormattedMessage
      id="Login.form.login"
      defaultMessage="تسجيل الدخول"
    />
  )}
</button>
<p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto text-center">
  لا يوجد لديك حساب؟{" "}
  <Link
    to="/register"
    className="text-mainRed font-semibold hover:underline cursor-pointer"
  >
    انشئ حسابك الآن !
  </Link>
</p>

    </form>

  </div>
    <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={loginError}
      />
</div>
<TestimonialsSlider/>
</div>
  );
};

export default Login;
