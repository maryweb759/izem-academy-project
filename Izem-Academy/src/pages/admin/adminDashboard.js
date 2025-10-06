import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import { adminMenuItems } from "../../components/sidebar/menuItem";
import { Menu } from "lucide-react";

// Pages
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Users from "./Users";
import Enrollement from "./Enrollement";
import Profile from "./settings/Profile";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} menuItems={adminMenuItems} />

      {/* Main content */}
    {/* Main content - KEY CHANGES HERE */}
      <div
        className={`flex-1 p-6 transition-all duration-300 
          ${isOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        {/* Mobile menu button */}
        <button
          className="md:hidden mb-4 p-2 bg-white rounded-lg shadow"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
     
        <Routes>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="courses" element={<Courses />} />
  <Route path="users" element={<Users />} />
  <Route path="enrollement" element={<Enrollement />} />
  <Route path="profile" element={<Profile />} />
</Routes>

      </div>
    </div>
  );
}
