import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ 
  id, 
  label, 
  labelNote,  // ⬅️ NEW: For additional label text (e.g., password hint)
  register, 
  errors, 
  placeholder, 
  type = "text", 
  Icon, 
  validationRules,
  showPasswordToggle = false,
  passwordVisible,
  onPasswordToggle,
  isRTL = false
}) => (
  <div className="w-full">
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
      {label}
      {labelNote && (
        <span className="text-gray-400 font-normal text-xs"> {labelNote}</span>
      )}
    </label>
    <div className="relative">
      <input
        id={id}
        type={showPasswordToggle ? (passwordVisible ? "text" : "password") : type}
        placeholder={placeholder}
        className={`w-full ${showPasswordToggle ? 'pr-12' : 'pr-10'} pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main ${
          errors[id] ? "border-main" : "border-border"
        }`}
        {...register(id, validationRules)}
      />
      
      {/* Main Icon */}
      {Icon && <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />}
      
      {/* Password Toggle Button */}
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onPasswordToggle}
          className={`absolute top-1/2 -translate-y-1/2 ${
            isRTL ? "left-3" : "right-10"
          } text-gray-500 flex items-center justify-center`}
        >
          {passwordVisible ? (
            <Eye className="h-5 w-5 text-main" />
          ) : (
            <EyeOff className="h-5 w-5 text-[#9E9E9E]" />
          )}
        </button>
      )}
    </div>
    {errors[id] && (
      <p className="mt-1 text-sm text-main">{errors[id].message}</p>
    )}
  </div>
);

export default FormInput;