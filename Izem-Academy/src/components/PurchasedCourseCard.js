const PurchasedCourseCard = ({ title, circleColor, price, currency, subtitle }) => {
  return (
    <div className="relative pt-6 w-full max-w-sm mx-auto">
      <div
        className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition p-8 pt-16 flex flex-col items-center text-center bg-white`}
      >
        {/* 🔹 Circle Title */}
        <div
          className={`absolute -top-12 w-24 h-24 flex items-center justify-center rounded-full text-white font-semibold text-lg shadow-lg ${circleColor}`}
        >
          {title}
        </div>

        {/* 🔹 Price */}
        <p className="text-lg mt-12">
          <span className="font-bold text-3xl">{price}</span> {currency} / الشهر
        </p>

        {/* 🔹 Subtitle (Optional) */}
        {subtitle && (
          <p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-2 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PurchasedCourseCard;
