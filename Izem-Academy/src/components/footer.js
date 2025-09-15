// import { FaFacebook, FaInstagram, FaTelegram, FaTiktok, FaLinkedin } from "react-icons/fa";
import { Mail,Phone, Facebook, Instagram, Send, Music2, Linkedin, X } from "lucide-react";
import imageLogo from "../assets/logo-footer.png"
export default function Footer() {
  return (
    <footer className="bg-primary text-white py-10 px-2" >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
         {/* Column 1 - Logo & Slogan */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3" dir="ltr">
          <img src={imageLogo} alt="Izem Academy" className="w-26 h-auto" />
          <p className="text-sm">
            منصة تعليم رقمية تقدم دروس عبر الإنترنت لبناء جيل أكثر ذكاءً
          </p>
        </div>

         {/* Column 2 - Contact */}
        <div className="flex flex-col space-y-6" >
          <div className="flex items-center gap-2" >
            <Phone className="w-5 h-5" />
            <span dir="ltr">+213668578890</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <span>izemacademy01@gmail.com</span>
          </div>
      <div className="flex items-center gap-2">
              {[
          { Icon: Facebook, label: "Facebook" },
          { Icon: Instagram, label: "Instagram" },
          { Icon: Send, label: "Telegram" },
          { Icon: Music2, label: "TikTok" },
          { Icon: Linkedin, label: "LinkedIn" },
        ].map(({ Icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="bg-white rounded-full p-1.5 flex items-center justify-center hover:opacity-80"
          >
            <Icon className="w-4 h-4 text-primary" />
          </a>
        ))}
            
          </div>
        </div>
        {/* Column 3 - About */}
        <div className="flex flex-col space-y-4">
          <p className="leading-relaxed text-sm mb-6">
نعمل على رقمنة قطاع التعليم في الجزائر. نحلم أنه عن قريب كل أستاذ في دزاير يقدر يقدم دروس للمتعلمين بسهولة . وفي المقابل، كل طالب بضغطت زر، يجد أفضل الاساتذة ويدرس في الوقت المناسب له . كل شهر، مئات المتعلمين والمعلّمين يقتنعو برؤية المشروع وينضمو للمنصة. نوفر حتى الآن عشرات الدورات التعليمية و الحصص الدراسية الناجحة شهرياً.          </p>
          <button className="bg-white text-primary font-semibold px-5 py-2 rounded-md hover:bg-gray-100 transition ">
            ابدأ الدراسة الآن
          </button>
        </div>

       

       
      </div>
    </footer>
  );
}
