import { useState, useEffect  } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import image from "../assets/student-admin.png";
import PurchasedCourses from "../components/PurchasedCourses";
import useAuthStore from "../zustand/stores/authStore";
import { Menu, X, Home, User, BookOpen, StickyNote, LogOut } from "lucide-react";
import { getCourses } from "../api/course"; // adjust path if needed
import Profile from "../pages/student/profile"; // adjust path if needed


const menuItems = [
  { to: "dashboard", label: "لوحة التحكم", icon: <Home size={18} /> },
  { to: "profile", label: "حسابي", icon: <User size={18} /> },
  // { to: "courses", label: "دوراتي", icon: <BookOpen size={18} /> },
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
      {/* Overlay (for mobile only) */}
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
            className="w-full bg-white text-primary rounded-lg py-2 hover:bg-gray-100 flex items-center justify-center gap-2"
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

const Placeholder = ({ children }) => <div className="p-6">{children}</div>;

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);
const [allCourses, setAllCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
useEffect(() => {
    async function fetchCourses() {
      try {
        setLoadingCourses(true);
        const data = await getCourses();

        if (data.status === "success" && Array.isArray(data.data)) {
          // normalize API response
          const normalizedCourses = data.data.map((c) => ({
            id: c._id, // use API _id as id
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
  const coursesElement = (
    <PurchasedCourses
      courses={user?.courses || []}
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
            <Route path="profile" element={<Profile />} />   {/* ✅ new profile screen */}
          {/* <Route path="courses" element={<Placeholder>📚 دوراتي</Placeholder>} /> */}
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
    </div>
  );
}
