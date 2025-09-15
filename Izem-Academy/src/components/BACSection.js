import React from 'react';
import {  Star } from "lucide-react";

const BACSection = ({ coursesimage }) => {
  return (
    <section className="py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-x-16">
        {/* ✅ Right Side - Content */}
        <div className="w-full md:w-1/2 text-right flex flex-col justify-between h-full">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-relaxed">
              <span className="text-black">"دراسة </span>
              <span className="text-mainRed">مادتين </span>
              <span className="text-black">بسعر </span>
              <span className="text-mainRed">مادة واحدة"</span>
            </h2>
            <p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:mr-0">
              تحتوي منصة إيزم أكاديمي على صفحة خاصة  بطلبة االبكالوريا والتي فيها كل مايحتاجه الطالب
            </p>

            <ul className="space-y-3 text-secondDarkColor text-base lg:text-lg font-medium leading-relaxed mb-4">
              <li>🎥 دروس مباشرة مع الأساتذة على منصة Zoom.</li>
              <li>🎬 دروس مسجلة متاحة.</li>
              <li>📚 مجموعة كبيرة من الملخصات.</li>
              <li>📝 تمارين ومواضيع متنوعة قابلة للتحميل والطباعة.</li>
            </ul>
          </div>

          <button className="bg-primary text-white my-4 px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            سجل في الدورة الآن →
          </button>
        </div>

        {/* ✅ Left Side - Image */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="relative w-4/5 lg:w-3/4 min-h-80 lg:min-h-[400px] rounded-3xl overflow-hidden">
            <img
              src={coursesimage}
              alt="Course"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* ✅ Bottom Scrollable Info Bar */}
      <div className="mt-10 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 justify-between min-w-max lg:min-w-0">
          {/* Item 3 */}
          <div className="flex justify-center items-center flex-shrink-0">    
            <span className="text-2xl">🎓</span>
            <p className="text-base font-medium text-secondDarkColor text-right">
              عدد الطلاب المسجلين: <span className="font-bold">+1200</span>
            </p>
          </div>
          {/* Item 2 */}
         <div className="flex justify-center items-center flex-shrink-0">    
             <Star className='text-brandYellow text-2xl' />
              <p className="text-base font-medium text-secondDarkColor text-right">
    تقييم الدورة
  </p>
           <div className="flex justify-center items-center flex-shrink-0 gap-1">
  {/* Render 5 stars */}
  {Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} className="text-brandYellow w-5 h-5 fill-current" />
  ))}

 
</div>
          </div>
          {/* Item 1 */}
          <div className="flex justify-center items-center flex-shrink-0">    
            <span className="text-2xl">👩‍💻</span>
            <p className="text-base font-medium text-secondDarkColor text-right">
              إمكانية طرح أسئلتك في أي وقت
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BACSection;