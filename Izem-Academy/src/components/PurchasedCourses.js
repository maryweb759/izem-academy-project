import { useState } from "react";
import PurchasedCourseCard from "./PurchasedCourseCard";
import { Plus } from "lucide-react";

const PurchasedCourses = ({ courses }) => {
  const [showPopup, setShowPopup] = useState(false);

  // 🔹 Define your circle colors
  const circleColors = ["bg-brandYellow", "bg-mainRed", "bg-primary"];

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
          className="relative pt-12 w-full max-w-sm mx-auto cursor-pointer"
        >
          <div className="relative rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-500 transition p-8 pt-16 flex flex-col items-center justify-center text-center h-full">
            <Plus className="w-16 h-16 text-gray-400" />
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
            <p className="text-gray-600 mb-6">
              هنا يمكنك إضافة تفاصيل الدورة الجديدة الخاصة بك.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-2 bg-mainDarkColor text-white rounded-lg hover:opacity-90 transition"
            >
              تأكيد
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PurchasedCourses;
