import React, { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";

export default function CoursesMultiSelect({
  control,
  name = "courses",
  courses = [],
  intl,
  errors = {},
  isRTL = true,
  validateExternally = false, // 👈 new
  customValidation = null, // 👈 new
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const renderButtonContent = (selectedIds = []) => {
    if (!selectedIds || selectedIds.length === 0) {
      return (
        <span className="text-gray-400 truncate">
          اختر الدورة
        </span>
      );
    }
    const titles = courses
      .filter((c) => selectedIds.includes(String(c.id)))
      .map((c) => c.title);

    if (titles.length <= 2) return <span className="truncate">{titles.join(", ")}</span>;

    // show first 2 + "وX أخرى"
    const others = titles.length - 2;
    return (
      <span className="truncate">
        {titles.slice(0, 2).join(", ")} و{others} أخرى
      </span>
    );
  };

  // If react-hook-form control provided, use Controller
  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        rules={
  validateExternally
    ? {}
    : {
        validate: (val) => {
          if (customValidation) return customValidation(val);
          return (
            (Array.isArray(val) && val.length > 0) ||
            (intl
              ? intl.formatMessage({
                  id: "Register.form.courses.required",
                  defaultMessage: "هذا الحقل مطلوب",
                })
              : "هذا الحقل مطلوب")
          );
        },
      }
}

        render={({ field: { value = [], onChange } }) => (
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
              الدورة
            </label>

            <div ref={wrapperRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen((s) => !s);
                  }
                }}
                className={`w-full pr-12 pl-4 h-[53px] border rounded-lg bg-white flex items-center justify-between gap-2 rtl
                  ${errors[name] ? "border-main" : "border-border"}`}
              >
                <div className="flex-1 text-right truncate">
                  {renderButtonContent(value)}
                </div>

                <ChevronDown
                  className={`absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 text-gray-400 pointer-events-none transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <ul
                  role="listbox"
                  aria-multiselectable
                  className="absolute z-50 mt-2 w-full bg-white border border-border rounded-lg shadow-lg max-h-56 overflow-auto p-2 rtl"
                >
                  {courses.map((course) => {
                    const selected = value.includes(String(course.id));
                    return (
                      <li
                        key={course.id}
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          const idStr = String(course.id);
                          let next;
                          if (selected) next = value.filter((x) => x !== idStr);
                          else next = [...value, idStr];
                          onChange(next);
                        }}
                        className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                              selected ? "bg-primary border-primary text-white" : "bg-white border-border"
                            }`}
                          >
                            {selected ? <Check className="w-3 h-3" /> : null}
                          </span>

                          <div className="text-right">
                            <div className="text-sm leading-tight">{course.title}</div>
                            {course.price !== undefined && (
                              <div className="text-xs text-gray-400">{course.price} دج</div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {errors[name] && (
              <p className="mt-1 text-sm text-main">{errors[name].message}</p>
            )}
          </div>
        )}
      />
    );
  }

  // Standalone (no react-hook-form) basic version:
  // state and onChange would be provided by parent via selected & onChange props (not implemented here)
  return (
    <div className="w-full">
         <label className="block mb-2 text-sm font-medium text-mainDarkColor text-right">
  الدورة{" "}
  <span className="text-gray-400 font-normal text-xs">
   (إختر دورة أو عدة دورات للإنضمام إليها)
  </span>
</label>
  
      <div className="relative">
        <div className={`w-full pr-12 pl-4 py-2 h-[53px] border rounded-lg bg-white ${"border-border"}`} />
      </div>
    </div>
  );
}
