import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/stores/authStore";

const MobileMenu = ({ navItems, isActive, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();

  if (!mobileOpen) return null; // don’t render if menu is closed

  return (
<div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col p-4 gap-4" >
      {/* Nav Items */}
      {navItems.slice().reverse().map((item) => (
  <button
    key={item.path}
    onClick={() => {
      navigate(item.path);
      setMobileOpen(false);
    }}
    className={`text-center w-full py-2 px-2 rounded-md ${
      isActive(item.path) ? "text-primary font-bold" : "text-gray-700"
    }`}
  >
    {item.label}
  </button>
))}

      <hr />

      {/* User Actions */}
      {!isLoggedIn ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              navigate("/login");
              setMobileOpen(false);
            }}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover"
          >
            دخول
          </button>
          <button
            onClick={() => {
              navigate("/register");
              setMobileOpen(false);
            }}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover"
          >
            سجل الآن
          </button>
        </div>
      ) : (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            navigate("/student_dashboard");
            setMobileOpen(false);
          }}
        >
          <User className="w-10 h-10 text-primary border border-primary rounded-full p-1" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {user?.name || "Utilisateur"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.role || "Etudiant"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
