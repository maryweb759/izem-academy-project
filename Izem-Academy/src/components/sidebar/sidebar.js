import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import useAuthStore from "../../zustand/stores/authStore";

export default function Sidebar({ isOpen, setIsOpen, menuItems }) {
  const navigate = useNavigate();
  const { logout: logoutFromStore } = useAuthStore();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleLogout = () => {
    logoutFromStore();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-primary text-white 
          flex flex-col justify-between p-4 shadow-md transition-all duration-300 z-50
          ${isOpen ? "w-64" : "w-20 -translate-x-full md:translate-x-0"}`}
      >
        {/* Toggle Sidebar */}
        <div>
          <button
            className="mb-8 flex items-center justify-center w-full bg-white text-primary rounded-lg py-2 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={20} />
          </button>

          {/* Menu Items */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex items-center justify-between w-full px-2 py-2 hover:text-gray-200 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {openSubmenu === item.label && isOpen && (
                    <div className="ml-6 flex flex-col gap-2 mt-2">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2 text-sm py-1 rounded px-2 transition-colors ${
                              isActive
                                ? "bg-white text-primary font-semibold"
                                : "hover:text-gray-200"
                            }`
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2 rounded transition-colors ${
                      isActive
                        ? "bg-white text-primary font-semibold"
                        : "hover:text-gray-200"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              )
            )}
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button
            className="w-full bg-white text-mainRed rounded-lg py-2 hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {isOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </div>
    </>
  );
}
