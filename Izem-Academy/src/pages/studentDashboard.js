import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import image from "../assets/student-admin.png";
import {purchasedCoursesData} from "../data/courses";
import PurchasedCourses from '../components/PurchasedCourses';
import useAuthStore from "../zustand/stores/authStore";

// ✅ Import lucide-react icons
import { Menu, X, Home, User, BookOpen, StickyNote, LogOut } from "lucide-react";

function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();

    const { user, logout: logoutFromStore } = useAuthStore();
 const handleLogout = async () => {
    try {
      logoutFromStore();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };
  return (
    <>
      {/* Overlay (for mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-primary text-white flex flex-col justify-between p-6 rounded-r-xl shadow-md transform transition-transform duration-300 z-30 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div>
          <div className="text-2xl font-bold mb-8"></div>
          {/* Menu */}
          <nav className="flex flex-col gap-6">
            <Link to="dashboard" className="flex items-center gap-2 hover:text-gray-200">
              <Home size={18} /> لوحة التحكم
            </Link>
            <Link to="profile" className="flex items-center gap-2 hover:text-gray-200">
              <User size={18} /> حسابي
            </Link>
            <Link to="courses" className="flex items-center gap-2 hover:text-gray-200">
              <BookOpen size={18} /> دوراتي
            </Link>
            <Link to="notes" className="flex items-center gap-2 hover:text-gray-200">
              <StickyNote size={18} /> ملاحظات
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div>
          <button 
          className="w-full bg-white text-primary rounded-lg py-2 hover:bg-gray-100 flex items-center justify-center gap-2"
           onClick={handleLogout}
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>

        {/* Close Button (mobile only) */}
        <button
          className="absolute top-4 right-4 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
    </>
  );
}


function Header({ user, toggleSidebar }) {
  const today = new Date().toLocaleDateString("ar-EG-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex justify-between items-center bg-primary text-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button (works on all screens) */}
        <button
          className="bg-white text-primary p-2 rounded-lg shadow-md"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="text-sm">{today}</p>
          <h1 className="text-xl font-semibold">مرحباً بك مرة أخرى، {user}!</h1>
        </div>
      </div>

      {/* Hide image on small screens */}
      <img
        src={image}
        alt="Student"
        className="hidden md:block w-36 h-auto object-contain"
      />
    </div>
  );
}

/* Content Pages */
function Dashboard() {
  return <div className="p-6">📊 لوحة التحكم</div>;
}
function Profile() {
  return <div className="p-6">👤 حسابي</div>;
}
function Courses() {
  return <div className="p-6">📚 دوراتي</div>;
}
function Notes() {
  return <div className="p-6">📝 ملاحظاتي</div>;
}

/* Main Component */
export default function StudentDashboard() {
    const { user } = useAuthStore();

  // const [user] = useState("جون");
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* Header */}
        <Header user={user?.fullName} toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* Nested Routes */}
        <Routes>
  <Route index element={<div className="p-6">
     
          <PurchasedCourses courses={purchasedCoursesData} />

  </div>} />
    <Route path="dashboard" element={ <PurchasedCourses courses={purchasedCoursesData} />} /> {/* added */}

          <Route path="profile" element={<div className="p-6">👤 حسابي</div>} />
          <Route path="courses" element={<div className="p-6">📚 دوراتي</div>} />
          <Route path="notes" element={<div className="p-6">📝 ملاحظاتي</div>} />
        </Routes>
      </div>
    </div>
  );
}
