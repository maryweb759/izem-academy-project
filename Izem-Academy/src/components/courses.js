import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coursesimage from "../assets/courses.png";
import bacimage from "../assets/bac.png";
import PricingSection from './pricingSection'
import BEMSection from './BEMSection';
import BACSection from './BACSection';

import { pricingCardsENG, pricingCardsFR, pricingCardsES } from "../data/pricingCardsData";

const tabs = [
      {
    id: "baccalaureate",
    label: "شهادة البكالوريا",
    content: (
    <BACSection coursesimage={bacimage} />

    ),
  },
  {
    id: "certificate",
    label: "شهادة التعليم المتوسط",
    content: (
<BEMSection coursesimage={coursesimage} />







    ),
  },
  {
    id: "french",
    label: "اللغة الفرنسية",
    content: (
            <PricingSection cards={pricingCardsFR} />

    ),
  },
  {
    id: "english",
    label: "اللغة الإنجليزية",
    content: (
      <PricingSection cards={pricingCardsENG} />
    ),
  },
  {
    id: "spanish",
    label: "اللغة الإسبانية",
    content: (
                 <PricingSection cards={pricingCardsES} />

    ),
  },

];

const CoursesSection = () => {
  const [activeTab, setActiveTab] = useState("baccalaureate");

  return (
    <div className="w-full  bg-customBlue shadow-lg px-6 pt-6">
         <div className="container">

      <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold font-inter text-mainDarkColor mb-6 px-4 leading-tight">
        جميع الدورات
      </h1>

      {/* ✅ Full width main container */}
      <div className="container px-3 py-10">
        <div className="relative min-h-96 lg:min-h-[500px] rounded-3xl ">
          {/* ✅ Tab Buttons */}
<div className="flex gap-4 mb-6 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-5 py-2 rounded-md font-medium transition-all duration-300
        ${
          activeTab === tab.id
            ? "bg-primary text-white shadow-md"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
    >
      {tab.label}
    </button>
  ))}
</div>


          {/* ✅ Tab Content with Animation */}
          <div className="relative min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {tabs.find((tab) => tab.id === activeTab)?.content}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
