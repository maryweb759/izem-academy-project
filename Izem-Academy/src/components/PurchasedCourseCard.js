const PurchasedCourseCard = ({ title, circleColor, price, subtitle }) => {
  return (
    <div className="relative pt-6 w-full max-w-sm mx-auto">
      <div
        className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition flex flex-col items-center text-center bg-white`}
      >
        {/* 🔹 Title as colored container */}
        <div
          className={`w-full py-4 rounded-t-2xl text-white font-bold text-lg shadow-md ${circleColor}`}
        >
          {title}
        </div>

        {/* 🔹 Price */}
        <p className="text-lg mt-6">
          <span className="font-bold text-3xl">{price}</span> دج / الشهر
        </p>

        {/* 🔹 Subtitle (Optional) */}
        {subtitle && (
          <p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mt-4 mb-2 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PurchasedCourseCard;
