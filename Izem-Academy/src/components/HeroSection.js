import { useState, useEffect } from "react";
import heroimage from "../assets/heroimage.png";
import heroimage2 from "../assets/heroimage2.png";
import FeaturesCarousel from "./FeauturesCarasoul"; // adjust path if needed
import { motion, AnimatePresence } from "framer-motion";
import titles from "../data/constants"

const HeroSection = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === titles.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, [titles.length]);

  return ( 
  <>
  <div className="min-h-screen flex items-center">
  <div className="  w-full   px-4">
   
        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center h-full">
          {/* Left Side - Your Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={heroimage}
              alt="Student with statistics"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
            />
          </div>

          {/* Right Side - Content with Background Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative min-h-96 lg:min-h-[500px] rounded-3xl overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={heroimage2}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center lg:text-right p-8 lg:p-12 h-full flex flex-col justify-center">
                {/* Main Title */}
               <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold font-inter text-mainDarkColor mb-6 leading-tight">
      نقدم دروس الدعم و دورات تعليمية في{" "}
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

                {/* Description */}
                <p className="font-inter text-secondDarkColor text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:mr-0">
                  دروس الدعم و الدورات التعليمية عندنا تخليك تعيش تجربة تعلم رائعة
                  عبر الإنترنت، دون أي مشكلات، ومن دارك. ستتعلم بشكل أفضل وأسرع
                  من الطرق التقليدية.
                </p>

                {/* CTA Button */}
                <button className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  ابدأ التعلم الآن
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Add Features Carousel under Hero */}
         <div className="mt-12">
          <FeaturesCarousel />
        </div>
      </div>
     
    </div>
    
       </>
  );
};

export default HeroSection;
