import { ChevronLeft, ChevronRight } from "lucide-react";
import useLanguageStore from "../zustand/stores/languageStore";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";
  return (
    <div className="flex items-center space-x-2 justify-center mt-4">
      {/* Bouton précédent */}
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 0}
        className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 ${
          currentPage === 0
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-200"
        }`}
      >
        {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Pages */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium ${
            currentPage === i
              ? "border-primary text-primary font-bold bg-gray-100"
              : "border-gray-300 text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* Bouton suivant */}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 ${
          currentPage === totalPages - 1
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-200"
        }`}
      >
        {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default Pagination;
