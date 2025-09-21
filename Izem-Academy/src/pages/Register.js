import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";
import { Eye, EyeOff, Phone, Lock, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import useErrorStore from "../zustand/stores/useErrorStore";
import { ClipLoader } from "react-spinners";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";
import heroimage2 from "../assets/heroimage2.png"
import TestimonialsSlider from '../components/TestimonialsSlider';
import titles from "../data/constants";
import { motion, AnimatePresence } from "framer-motion";
import { cities } from "../data/algerianCities"; 
import CoursesMultiSelect from "../components/coursesMultiselect";
import { getCourses } from "../api/course"; // adjust path if needed
import useAuthStore from "../zustand/stores/authStore";


const Register = () => {
  const { referral_code: urlReferralCode } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
     control,
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
    const authenticate = useAuthStore((state) => state.authenticate);

  const navigate = useNavigate();
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl" ? true : false;
    const [currentIndex, setCurrentIndex] = useState(0);
const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();

        if (data.status === "success" && Array.isArray(data.data)) {
          // normalize API response
          const normalizedCourses = data.data.map((c) => ({
            id: c._id, // use API _id as id
            title: c.title,
            price: c.price,
          }));
          setCourses(normalizedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === titles.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, [titles.length]);

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
  const selectedObjects = courses.filter((c) =>
    data.courses.includes(String(c.id))
  );
  console.log("ids:", data.courses, "objects:", selectedObjects);

  setLoading(true);

  try {
    // remove confirm_password before sending
    delete data.confirm_password;

    const response = await signUp(data);
     authenticate(response);
    // ✅ handle success
    // reset();

    // check role safely
    console.log("User role from API:", response.role);

    if (response.role === "student") {
      navigate("/student_dashboard");
    } else if (response.role === "ROLE_ADMIN") {
      navigate("/dashboard");
    } else {
      navigate("/home");
    }
  } catch (error) {
   console.error("Erreur de connexion :", error.response.data);
      if (error.response && error.response.data.message) {
      setLocalErrorMessage(error.response.data.message);
    } else {
      setLocalErrorMessage(error.message || errorMessage);
    }
    setErrorModalOpen(true);
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
           سجل عندنا تلقى أفضل الأساتذة في {" "}
                 <span className="inline-block text-primary">

             <AnimatePresence mode="wait">
          <motion.span
            key={titles[currentIndex]} // makes AnimatePresence detect change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            {titles[currentIndex]}
          </motion.span>
        </AnimatePresence>
        </span>
           
          </h1>
        </div>
      </div>
    </section>
    <div className="w-full bg-customBlue shadow-lg px-6 py-6">
  <div className="container mx-auto  text-center">
    {/* Title */}
<h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold font-inter text-mainDarkColor mb-4 leading-tight">
 إنشاء حساب    </h1>

    {/* Paragraph */}
<p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto">

    {/* <p className="text-base md:text-lg text-gray-700 max-w-2xl mb-6"> */}
ادخل بياناتك بشكل صحيح وسيتم التواصل معاك خلال ساعات لتفعيل الحساب !   
 </p>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Fields Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="w-full">
  <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
    الاسم واللقب
  </label>
  <div className="relative">
    <input
      type="text"
      placeholder=" Amine Boumedian"
      className={`w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main ${
        errors.username ? "border-main" : "border-border"
      }`}
      {...register("fullName", {
        required: "هذا الحقل مطلوب",
        minLength: {
          value: 4,
          message: "يجب أن يحتوي الاسم على 4 أحرف على الأقل",
        },
        maxLength: {
          value: 15,
          message: "يجب ألا يتجاوز الاسم 15 حرفًا",
        },
        pattern: {
          value: /^[\p{L} ]+$/u, // ✅ accepts only letters (any language) + spaces
          message: "الاسم يجب أن يحتوي على حروف ومسافات فقط",
        },
      })}
    />
    {/* Optional: you can change the icon to User instead of Phone */}
    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
  </div>

  {errors.username && (
    <p className="mt-1 text-sm text-main">{errors.username.message}</p>
  )}
</div>

        {/* Phone Number Field */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
            رقم الهاتف
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="53 30 37 69 05"
              className={`w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main ${
                errors.phone ? "border-main" : "border-border"
              }`}
              {...register("phone", {
                required: "هذا الحقل مطلوب",
                pattern: {
                  value: /^(05|06|07)\d{8}$/,
                  message:
                    "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام",
                },
              })}
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-main">{errors.phone.message}</p>
          )}
        </div>

      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
       

        {/* Password Field */}
        <div className="w-full">
         <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
  كلمة السر{" "}
  
</label>

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "Login.form.password.placeholder",
                defaultMessage: "كلمة السر",
              })}
              className={`w-full pr-12 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main rtl
                ${errors.password ? "border-main" : "border-border"}`}
              {...register("password", {
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
              })}
            />

            {/* Lock Icon */}
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "left-3" : "right-10"
              } text-gray-500 flex items-center justify-center`}
            >
              {passwordVisible ? (
                <Eye className="h-5 w-5 text-main" />
              ) : (
                <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-main">{errors.password.message}</p>
          )}
        </div>
    {/* confrim password */}
        <div className="w-full">
  <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
    تأكيد كلمة السر
  </label>

  <div className="relative">
    <input
      type={confirmPasswordVisible ? "text" : "password"}
      placeholder={intl.formatMessage({
        id: "Register.form.confirmPassword.placeholder",
        defaultMessage: "تأكيد كلمة السر",
      })}
      className={`w-full pr-12 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main rtl
        ${errors.confirm_password ? "border-main" : "border-border"}`}
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

    {/* Lock Icon */}
    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

    {/* Eye Toggle */}
    <button
      type="button"
      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
      className={`absolute top-1/2 -translate-y-1/2 ${
        isRTL ? "left-3" : "right-10"
      } text-gray-500 flex items-center justify-center`}
    >
      {confirmPasswordVisible ? (
        <Eye className="h-5 w-5 text-main" />
      ) : (
        <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
      )}
    </button>
  </div>

  {errors.confirm_password && (
    <p className="mt-1 text-sm text-main">{errors.confirm_password.message}</p>
  )}
</div>
{/* city dropdown */}
<div className="w-full">
      <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
        الولاية
      </label>

      <div className="relative">
        <select
          className={`w-full pr-12 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main rtl appearance-none bg-white
            ${errors.city ? "border-main" : "border-border"}`}
          {...register("city", {
            required: intl.formatMessage({
              id: "Register.form.city.required",
              defaultMessage: "هذا الحقل مطلوب",
            }),
          })}
          defaultValue=""
        >
          <option value="" disabled>
            اختر الولاية
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.ar_name}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none " />
      </div>

      {errors.city && (
        <p className="mt-1 text-sm text-main">{errors.city.message}</p>
      )}
    </div>
{/* courses dropdown */}
{loadingCourses ? (
        <p className="text-gray-500">جاري تحميل الدورات...</p>
      ) : (
        <CoursesMultiSelect
          control={control}
          name="courses"
          courses={courses}
          intl={intl}
          errors={errors}
        />
      )}
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
      id="Login.form.submit"
                defaultMessage="سجل الأن"
    />
  )}
</button>
<p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto text-center">
  هل فتحت حساب من قبل؟{" "}
  <Link
    to="/login"
    className="text-mainRed font-semibold hover:underline cursor-pointer"
  >
سجل الدخول من هنا!  </Link>
</p>

    </form>
    </div>
    </div>
<TestimonialsSlider/>
  <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={() => setErrorModalOpen(false)}
        message={localErrorMessage}
      />
</div>
  );
};

export default Register;
