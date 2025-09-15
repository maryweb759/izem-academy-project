import pocketWatch from "../assets/pocketwatch.png";
import bestTeacher from "../assets/best-teacher.png";
import homeStudy from "../assets/home-study.png";
import liveSessions from "../assets/live-sessions.png";
const features = [
  {
    text: "دروس مباشرة",
    image: liveSessions, // replace with your actual image path
    border: "rgba(32, 143, 180, 0.26)",
  },
  {
    text: "تدرس من منزلك",
    image: homeStudy,
    border: "rgba(253, 108, 117, 0.2)",
  },
  {
    text: "أفضل المعلمين",
    image: bestTeacher,
    border: "rgba(180, 112, 141, 0.34)",
  },
  {
    text: "مرافقة الطلاب 24/24",
    image: pocketWatch,
    border: "rgba(241, 191, 90, 0.46)",
  },
];

const FeaturesCarousel = () => {
  return (
    <div className="px-4">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
         <div
  key={i}
  className="flex flex-row-reverse items-center justify-between gap-4 px-6 py-6 rounded-2xl shadow-md bg-white"
  style={{ border: `2px solid ${feature.border}` }}
>
  <span className="font-inter font-bold text-mainDarkColor text-lg">
    {feature.text}
  </span>
  <img src={feature.image} alt={feature.text} className="w-10 h-10 object-contain" />
</div>

        ))}
      </div>
    </div>
  );
};




export default FeaturesCarousel;
