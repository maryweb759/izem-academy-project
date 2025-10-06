import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { User, Menu, X } from "lucide-react";
import MobileMenu from "./mobileMenu"; // adjust path if needed

import ContactBar from "../ContactBar";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../zustand/stores/authStore";
import { logout } from "../../api/auth";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  // { label: "شهادة التعليم المتوسط", path: "/certificates" },
  // { label: "الدورات", path: "/courses" },
  { label: "الرئيسية", path: "/" },
];
const sectionItems = [
    { label: "أراء طلابنا", sectionId: "testimonial" },

{ label: "الدورات", sectionId: "courses" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const { isLoggedIn, token,role, logout: logoutFromStore, user } = useAuthStore();
  // useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: () => getAllNotif(token),
  //   enabled: isLoggedIn,
  // });
const handleNavigation = () => {
  const routes = {
    student: "/student_dashboard",
    admin: "/admin_dashboard",
  };
  
  navigate(routes[role] || "/home");
};
  const handleLogout = async () => {
    try {
      await logout(token);
      logoutFromStore();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <>
      <ContactBar />
      <nav
        dir="ltr"
        className="flex items-center justify-between bg-white shadow-sm py-3 px-6 relative"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-extrabold text-gray-800">
            izem <span className="text-primary">academy</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
           {/* Section scroll links */}
      {sectionItems.map((item) => (
    <li
      key={item.sectionId}
      className="cursor-pointer hover:text-primary"
    >
      <a href={`#${item.sectionId}`} className="block">
        {item.label}
      </a>
    </li>
      ))}
      {/* Route links */}
      {navItems.map((item) => (
        <li
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`cursor-pointer hover:text-primary ${
            isActive(item.path) ? "text-primary font-bold" : ""
          }`}
        >
          {item.label}
        </li>
      ))}

     
    </ul>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`cursor-pointer hover:text-primary ${
                  isActive("/login") ? "text-primary font-bold" : "text-gray-700"
                }`}
              >
                دخول
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-hover"
              >
                سجل الآن
              </button>
            </>
          ) : (
            <div
  className="flex items-center gap-3 cursor-pointer"
  onClick={handleNavigation}
>
              <User className="w-10 h-10 text-primary border border-primary rounded-full p-1" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.fullName || "Utilisateur"}
                </span>
                <span className="text-xs text-gray-500">
                  {role  || "Etudiant"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
      <button
  className="md:hidden text-gray-700"
  onClick={() => setMobileOpen(!mobileOpen)}
>
  {mobileOpen ? <X size={28} /> : <Menu size={28} />}
</button>

{/* Mobile Menu */}
<MobileMenu
  navItems={navItems}
  isActive={isActive}
  mobileOpen={mobileOpen}
  setMobileOpen={setMobileOpen}
/>
      </nav>
    </>
  );
};

export default Navbar;
