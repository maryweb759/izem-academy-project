import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa6';
import { testimonialData } from '../data/testimonial';

const TestimonialsSlider = () => {

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const breakpointsResponsive = {
        '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        '@0.75': {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        '@1.00': {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        '@1.50': {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    }

    const handleSwiperEvents = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    }

    return (
        <div className='w-full h-full space-y-5 relative lg:p-10 md:p-10 sm:p-10 px-6 py-10 flex items-center justify-center flex-col'>

            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl text-mainDarkColor font-semibold">
                    تعليقات طلابنا
                </h2>

                {/* Custom buttons */}
                <div className="flex items-center gap-6">
                    <button className={`custom-prev text-neutral-50 bg-primary hover:bg-hover p-2 rounded-full z-10 ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isBeginning}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button className={`custom-next text-neutral-50 bg-primary hover:bg-hover p-2 rounded-full z-10 ${isEnd ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isEnd}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

            </div>

            <div className="w-full py-2">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={5}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    breakpoints={breakpointsResponsive}
                    onSlideChange={(swiper) => handleSwiperEvents(swiper)}
                    onInit={(swiper) => handleSwiperEvents(swiper)}
                    modules={[Navigation]}
                    className="mySwiper p-1 ![&_.swiper-wrapper]:!ease-in-out ![&_.swiper-wrapper]:!duration-300"
                >
                    {testimonialData.map((item) => (
                        <SwiperSlide key={item.id}>

                            <div className="w-full h-auto p-6 space-y-10 group bg-customBlue rounded-xl border border-border">
                                <p className="text-mainDarkColor text-base font-normal">
                                    {item.desc}
                                </p>

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={item.img} alt={item.name} className="w-12 h-12 object-center object-cover rounded-full border" />

                                        <div className="space-y-1">
                                            <p className="text-mainDarkColor text-base font-semibold">
                                                {item.name}
                                            </p>
                                            <p className="text-secondDarkColor text-xs font-normal italic">
                                                {item.role}  {item.company}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 bg-yellow-500/5 rounded-full px-2 py-1">
                                        <Star className='text-brandYellow text-sm' />
                                        <p className="text-xs text-brandYellow">
                                            {item.rating}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    )
}

export default TestimonialsSlider