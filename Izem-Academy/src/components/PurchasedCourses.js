import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PurchasedCourseCard from "./PurchasedCourseCard";
import { savePurchasedCourses } from "../api/users"; // 🔹 API wrapper
import CoursesMultiSelect from "./coursesMultiselect";
import ResponsePopup from "../utils/ResponsePopup";

import { useIntl } from "react-intl";
import { Plus } from "lucide-react";

const PurchasedCourses = ({ courses, allCourses, loadingCourses, userID }) => {
  const [showPopup, setShowPopup] = useState(false);
    const [responsePopup, setResponsePopup] = useState(null); // store API response
  const { control, handleSubmit, reset,  formState: { errors }, } = useForm();
  const intl = useIntl();

  // 🔹 Define your circle colors
  const circleColors = ["bg-brandYellow", "bg-mainRed", "bg-primary"];
  const onSubmit = async (data) => {
    try {
      console.log('ids...........', data.courses);
      const payload = {
        userId: userID,
        courseIds: data.courses, // extract IDs only
      };

      const res = await savePurchasedCourses(payload);

      // save response for popup display
      setResponsePopup(res);
      setShowPopup(false); // close add-course modal
      reset();
    } catch (err) {
      console.error("Failed to save courses", err);
      setResponsePopup({
        status: "error",
        message: err?.response?.data?.message || "Unexpected error occurred",
      });
    }
  };
  return (
   <section className="py-6 px-4">
      {/* 🔹 Section Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-right">
        الدورات المشتراة
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center">
        
        {/* Loop Courses */}
        {courses.map((course, index) => (
          <PurchasedCourseCard
            key={index}
            {...course}
            circleColor={circleColors[index % circleColors.length]} // 🔹 auto-rotate colors
          />
        ))}

        {/* ➕ Add New Course Card */}
        <div
          onClick={() => setShowPopup(true)}
          className="relative pt-8 w-full max-w-sm mx-auto cursor-pointer"
        >
          <div className="relative rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-500 transition p-8 flex flex-col items-center justify-center text-center h-full">
            <Plus className="w-14 h-14 text-gray-400" />
            <p className="mt-4 text-gray-500 font-medium">إضافة دورة جديدة</p>
          </div>
        </div>
      </div>

      {/* 🔹 Pop-up Modal */}
       {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">إضافة دورة جديدة</h2>

            {loadingCourses ? (
              <p className="text-gray-500">جاري تحميل الدورات...</p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <CoursesMultiSelect
                          control={control}
                          name="courses"
                          courses={allCourses}
                          intl={intl}
                          errors={errors}
                        />
                
               
               

                <button
                  type="submit"
                  className="mt-6 w-full py-2 bg-primary rounded-full text-white  hover:opacity-90 transition"
                >
                  تأكيد
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {responsePopup && (
  <ResponsePopup
    response={responsePopup}
    onClose={() => setResponsePopup(null)}
  />
)}
    </section>
    
  );
};

export default PurchasedCourses;
