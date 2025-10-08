import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import image from "../assets/student-admin.png";
import PurchasedCourses from "../components/PurchasedCourses";
import useAuthStore from "../zustand/stores/authStore";
import { Menu, X, Home, User, StickyNote, LogOut } from "lucide-react";
import { getAllCourses } from "../api/course";
import { getApprovedCoursesWithPendingStatus } from "../api/enrollement";
import Profile from "../pages/student/profile";
import SuccessModal from "../components/modals/SuccessModal";

const menuItems = [
  { to: "dashboard", label: "لوحة التحكم", icon: <Home size={18} /> },
  { to: "profile", label: "حسابي", icon: <User size={18} /> },
  { to: "notes", label: "ملاحظاتي", icon: <StickyNote size={18} /> },
];

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { logout: logoutFromStore } = useAuthStore();

  const handleLogout = () => {
    logoutFromStore();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-primary text-white flex flex-col justify-between p-6 rounded-r-xl shadow-md transform transition-transform duration-300 z-30 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <nav className="flex flex-col gap-6">
            {menuItems.map(({ to, label, icon }) => (
              <Link key={to} to={to} className="flex items-center gap-2 hover:text-gray-200">
                {icon} {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <button
            className="w-full bg-white text-mainRed rounded-lg py-2 hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>

        <button
          aria-label="Close sidebar"
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
        <button
          className="bg-white text-primary p-2 rounded-lg shadow-md"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="text-sm">{today}</p>
          <h1 className="text-xl font-semibold">
            مرحباً بك مرة أخرى، {user || "مستخدم"}!
          </h1>
        </div>
      </div>
      <img src={image} alt="Student" className="hidden md:block w-36 h-auto object-contain" />
    </div>
  );
}

export default function StudentDashboard() {
  const { user, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // 🟢 Fetch all available courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoadingCourses(true);
        const data = await getAllCourses();
        if (data.status === "success" && Array.isArray(data.data)) {
          const normalizedCourses = data.data.map((c) => ({
            id: c._id,
            title: c.title,
            price: c.price,
          }));
          setAllCourses(normalizedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  // 🟢 Fetch approved courses with pending status
  useEffect(() => {
    async function fetchApprovedCourses() {
      try {
        const data = await getApprovedCoursesWithPendingStatus(token, user._id);
        if (data.status === "success") {
          const approved = data.data.approvedCourses || [];
          setApprovedCourses(approved);

          if (data.data.hasPendingCourses) {
            setIsPendingModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error fetching approved courses:", err);
      }
    }

    if (token) {
      fetchApprovedCourses();
    }
  }, [token]);

  const coursesElement = (
    <PurchasedCourses
      courses={approvedCourses}
      allCourses={allCourses}
      loadingCourses={loadingCourses}
      userID={user?._id}
    />
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <Header user={user?.fullName} toggleSidebar={() => setIsOpen(!isOpen)} />

        <Routes>
          <Route index element={coursesElement} />
          <Route path="dashboard" element={coursesElement} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="notes"
            element={
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <span className="text-5xl mb-4">📝</span>
                <p className="text-lg font-medium">لا توجد ملاحظات متاحة حاليا</p>
              </div>
            }
          />
        </Routes>
      </div>

      {/* 🔔 Pending courses popup */}
      <SuccessModal
        isOpen={isPendingModalOpen}
        closeModal={() => setIsPendingModalOpen(false)}
        message="هناك بعض الدورات قيد المراجعة، يرجى الانتظار حتى تتم الموافقة عليها وستُضاف تلقائياً إلى قائمتك."
      />
    </div>
  );
}
