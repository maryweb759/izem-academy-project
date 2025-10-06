import { Phone, User, MapPin, Shield } from "lucide-react";
import useAuthStore from "../../../zustand/stores/authStore";

export default function Profile() {
  const { user, role } = useAuthStore(); // 👈 we get user data from your auth store

  return (
    <div className="w-full bg-customBlue shadow-lg px-6 py-6 rounded-lg">
      <div className="container mx-auto text-center">
        {/* Title */}
        <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold font-inter text-mainDarkColor mb-4 leading-tight">
          حسابي
        </h1>

        {/* Paragraph */}
        <p className="font-inter text-secondDarkColor text-sm lg:text-base font-normal mb-8 leading-relaxed max-w-2xl mx-auto">
          هنا يمكنك مشاهدة معلوماتك الشخصية
        </p>

        {/* Fields Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
          {/* Full Name */}
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-mainDarkColor">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.fullName || ""}
                disabled
                className="w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-mainDarkColor">
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.phone || ""}
                disabled
                className="w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* City */}
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-mainDarkColor">
              المدينة
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.city || ""}
                disabled
                className="w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Role */}
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-mainDarkColor">
              الدور
            </label>
            <div className="relative">
              <input
                type="text"
                value={role || "Etudiant"}
                disabled
                className="w-full pr-10 pl-4 py-2 h-[53px] border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <Shield className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
