import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { DollarSign, Users, GraduationCap, BookOpen } from "lucide-react";

const iconMap = {
  "revenue-icon": <DollarSign size={28} />,
  "users-icon": <Users size={28} />,
  "enrollments-icon": <GraduationCap size={28} />,
  "courses-icon": <BookOpen size={28} />,
};

const DataCard = ({ name, amount, icon, color, progressValue }) => {
  const IconComponent = iconMap[icon] || null;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 w-full max-w-sm cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{name}</p>
          <p className="text-2xl font-bold">{amount}</p>
        </div>
        <div style={{ color }}>{IconComponent}</div>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>{progressValue}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${progressValue}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </motion.div>
  );
};

DataCard.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired, // hex from API
  progressValue: PropTypes.number.isRequired,
};

export default DataCard;
