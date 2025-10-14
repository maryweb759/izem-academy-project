import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";
import { Eye, EyeOff, Phone, Lock, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";
import FormInput from "../components/FormInput";
import FormDropdown from "../components/FormDropdown";
import ErrorModal from "../components/modals/ErrorModal";
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
import { getAllCourses } from "../api/course"; // adjust path if needed
import useAuthStore from "../zustand/stores/authStore";
import RegisterPopup from "../components/modals/registerpopup"; // adjust the path


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
const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl" ? true : false;
    const [currentIndex, setCurrentIndex] = useState(0);
const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { isLoggedIn, role } = useAuthStore();  // ⬅️ pull role from store

useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getAllCourses();

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
 useEffect(() => {
  if (!isRegistering && isLoggedIn) {
    if (role === "student") {
      navigate("/student_dashboard");
    } else if (role === "admin") {
      navigate("/admin_dashboard");
    } else {
      navigate("/home");
    }
  }
}, [isLoggedIn, role, navigate, isRegistering]);

const onSubmit = async (data) => {
  setIsRegistering(true);
  setLoading(true);
  try {
    delete data.confirm_password;
    const response = await signUp(data);
    authenticate(response);
    setIsRegisterPopupOpen(true);

    setTimeout(() => {
      setIsRegistering(false);
      if (response.role === "student") {
        navigate("/student_dashboard");
      } else if (response.role === "admin") {
        navigate("/admin_dashboard");
      } else {
        navigate("/home");
      }
    }, 5500);
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data);
    setLocalErrorMessage(
      error.response?.data?.message || error.message || errorMessage
    );
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
        <FormInput
        id="fullName"
        label="الاسم واللقب"
        placeholder="Amine Boumedian"
        register={register}
        errors={errors}
        Icon={User}
        validationRules={{
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
      value: /^[\p{L} ]+$/u,
      message: "الاسم يجب أن يحتوي على حروف ومسافات فقط",
    },
  }}
      />

        {/* Phone Number Field */}
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

      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
       

        {/* Password Field */}
    <FormInput
  id="password"
  label="كلمة السر"
  placeholder="كلمة السر"
  register={register}
  errors={errors}
  Icon={Lock}
  showPasswordToggle={true}
  passwordVisible={passwordVisible}
  onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
  isRTL={isRTL}
  validationRules={{
    required: "هذا الحقل مطلوب",
    minLength: {
      value: 6,
      message: "كلمة السر يجب أن تحتوي على الأقل على 6 أحرف",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "يجب أن تحتوي كلمة السر على حرف كبير وصغير ورقم",
    },
  }}
/>
    {/* confrim password */}
      <FormInput
  id="confirm_password"
  label="تأكيد كلمة السر"
  placeholder="تأكيد كلمة السر"
  register={register}
  errors={errors}
  Icon={Lock}
  showPasswordToggle={true}
  passwordVisible={confirmPasswordVisible}
  onPasswordToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
  isRTL={isRTL}
  validationRules={{
    required: "هذا الحقل مطلوب",
    validate: (value) =>
      value === watch("password") || "كلمة السر غير متطابقة",
  }}
/>
{/* city dropdown */}
<FormDropdown
  id="city"
  label="الولاية"
  placeholder="اختر الولاية"
  register={register}
  errors={errors}
  options={cities.map((city) => ({
    id: city.id,
    value: city.name,      // This gets submitted (e.g., "Algiers")
    label: city.ar_name,   // This is displayed (e.g., "الجزائر")
  }))}
  validationRules={{
    required: intl.formatMessage({
      id: "Register.form.city.required",
      defaultMessage: "هذا الحقل مطلوب",
    }),
  }}
/>
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
      <RegisterPopup
  isOpen={isRegisterPopupOpen}
  closeModal={() => {
    setIsRegisterPopupOpen(false);
    // Optionally navigate after closing
    navigate("/student_dashboard");
  }}
/>

</div>
  );
};

export default Register;
