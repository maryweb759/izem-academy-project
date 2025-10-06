import React from 'react';
import { ChevronDown } from 'lucide-react';

const FormDropdown = ({ 
  id, 
  label, 
  register, 
  errors, 
  options, 
  validationRules,
  placeholder = "اختر..."
}) => (
  <div className="w-full">
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        className={`w-full pr-12 pl-4 py-2 h-[53px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-main rtl appearance-none bg-white
          ${errors[id] ? "border-main" : "border-border"}`}
        {...register(id, validationRules)}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
    {errors[id] && (
      <p className="mt-1 text-sm text-main">{errors[id].message}</p>
    )}
  </div>
);

export default FormDropdown;