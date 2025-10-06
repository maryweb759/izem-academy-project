import { Home, User, BookOpen, StickyNote, Settings } from "lucide-react";

export const adminMenuItems = [
  { to: "dashboard", label: "لوحة التحكم", icon: <Home size={18} /> },
  { to: "courses", label: "الدورات", icon: <BookOpen size={18} /> },
  { to: "users", label: "المستخدمين", icon: <User size={18} /> },
  { to: "enrollement", label: "التسجيلات", icon: <StickyNote size={18} /> }, // ✅ fixed
  {
    label: "الإعدادات",
    icon: <Settings size={18} />,
    children: [
      { to: "profile", label: "حسابي", icon: <User size={16} /> },
    ],
  },
];

