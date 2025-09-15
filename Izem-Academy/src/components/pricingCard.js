import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


const PricingCard = ({
  title,
  circleColor,
  bgColor,
  price,
  currency,
  subtitle,
  features,
  buttonText,
  buttonColor,
  redirectUrl,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-12 w-full max-w-sm mx-auto"> {/* ✅ Added width constraints */}
      <div
        className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition p-8 pt-16 flex flex-col items-center text-center ${bgColor}`}
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
        {subtitle && (
             <p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-2 leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:mr-0">
              {subtitle}</p>
        )}

        {/* 🔹 Features */}
        <ul className="mt-6 space-y-3 text-secondDarkColor text-base lg:text-lg font-medium leading-relaxed w-full text-right">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              {feature && feature.trim() !== "" ? (
                <>
                  <Check className="text-green-500 w-5 h-5 shrink-0 mt-1" />
                  <span className="flex-1 font-medium">{feature}</span>
                </>
              ) : (
                <span className="flex-1">&nbsp;</span>
              )}
            </li>
          ))}
        </ul>

        {/* 🔹 Button */}
        <button
          className={`mt-8 w-full py-3 text-white font-medium transition hover:opacity-90 rounded-[37px] ${circleColor}`}
          onClick={() => navigate(redirectUrl)}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
