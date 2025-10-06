// src/components/Courses.js

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, X, BookText, Tag, DollarSign, Barcode } from 'lucide-react';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../api/course";
import useAuthStore from "../../zustand/stores/authStore"; // Assuming you use Zustand for auth
import LoadingSpinner from "../../components/LoadingSpinner"; // Assuming you have this component
import ErrorModal from "../../components/modals/ErrorModal";
import ConfirmationModal from "../../components/modals/confirmationModal";
import ButtonLoader from "../../components/buttonLoader"; // adjust path as needed
import FormInput from "../../components/FormInput";



// Course Form and Modal Component
const CourseModal = ({ isOpen, onClose, course, onSave, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const isEditMode = !!course;

  useEffect(() => {
    if (isEditMode) {
      reset(course);
    } else {
      reset({ title: "", subtitle: "", code: "", price: "" });
    }
  }, [course, reset, isEditMode]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {isEditMode ? "تعديل الدورة" : "إضافة دورة جديدة"}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <FormInput
            id="title"
            label="عنوان الدورة"
            register={register}
            errors={errors}
            placeholder="e.g., اللغة الإنجليزية (دورة جماعية)"
            Icon={BookText}
            validationRules={{ required: "عنوان الدورة مطلوب" }}
          />
          <FormInput
            id="subtitle"
            label="العنوان الفرعي"
            register={register}
            errors={errors}
            placeholder="e.g., دورة اللغة الإنجليزية من الصفر للاحتراف"
            Icon={Tag}
            validationRules={{ required: "العنوان الفرعي مطلوب" }}
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <FormInput
              id="code"
              label="كود الدورة"
              register={register}
              errors={errors}
              placeholder="e.g., ENG-GROUP"
              Icon={Barcode}
              validationRules={{ required: "كود الدورة مطلوب" }}
            />
            <FormInput
              id="price"
              label="السعر"
              type="number"
              register={register}
              errors={errors}
              placeholder="e.g., 3500"
              Icon={DollarSign}
              validationRules={{ 
                required: "السعر مطلوب",
                valueAsNumber: true,
                min: { value: 0, message: "السعر يجب أن يكون إيجابياً" }
              }}
            />
          </div>
          <div className="flex justify-end pt-4">
      <button
  type="submit"
  disabled={isLoading}
  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center disabled:bg-primary disabled:opacity-70"
>
  {isLoading ? <ButtonLoader /> : (isEditMode ? "حفظ التغييرات" : "إضافة الدورة")}
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Courses Component
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
    const [loginError, setCourseError] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState(null);
  const [isErrorModalOpens, setIsErrorModalOpen] = useState(false);
  const token = useAuthStore((s) => s.token);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCourses(token);
      setCourses(res.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = async (data) => {
    setActionLoading(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, data, token);
      } else {
        await createCourse(data, token);
      }
      await fetchCourses(); // Refresh data
      handleCloseModal();
    } catch (error) {
       console.error("Erreur de connexion :", error);
    if (error.response?.data?.message) {
      setCourseError(error.response.data.message);
    } else {
      setCourseError(error.message );
    }
    openErrorModal();
      
    } finally {
      setActionLoading(false);
    }
  };

 // ✅ Step 1: Trigger the confirmation modal
  const handleDeleteCourseClick = (courseId) => {
    setPendingCourseId(courseId);
    setIsConfirmModalOpen(true);
  };

  // ✅ Step 2: Confirm delete action
  const confirmDeleteCourse = async () => {
    try {
      await deleteCourse(pendingCourseId, token);
      await fetchCourses(); // Refresh list
    } catch (error) {
      console.error("Erreur de connexion :", error);
      if (error.response?.data?.message) {
        setCourseError(error.response.data.message);
      } else {
        setCourseError(error.message);
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsConfirmModalOpen(false);
      setPendingCourseId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">{`Error: ${error}`}</div>;

  return (
   <div className="bg-white rounded-lg shadow-md">
  <div className="flex flex-wrap items-center gap-4 sm:justify-between p-4"> {/* Modified classes here */}
    <h1 className="text-2xl font-bold text-gray-800">إدارة الدورات</h1>
    <button
      onClick={handleOpenAddModal}
      className="flex items-center gap-2 bg-main bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
    >
      <Plus size={20} />
      <span>إضافة دورة</span>
    </button>
  </div>


        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">عنوان الدورة</th>
                <th scope="col" className="px-6 py-3 hidden md:table-cell">الكود</th>
                <th scope="col" className="px-6 py-3">السعر</th>
                <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{course.title}</div>
                      <div className="text-xs text-gray-500 md:hidden">{course.code}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">{course.code}</td>
                    <td dir="ltr" className="px-6 py-4">{course.price} DZD</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          className="p-2 text-primary hover:bg-primary/30 rounded-full transition-colors"
                          title="تعديل"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourseClick(course._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    لم يتم العثور على دورات.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
     {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="حذف الدورة"
        message="هل أنت متأكد أنك تريد حذف هذه الدورة؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        confirmColor="red" // 🔴 makes the confirm button red
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteCourse}
      />
 <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={loginError}
      />
      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={editingCourse}
        onSave={handleSaveCourse}
        isLoading={actionLoading}
      />
    </div>
  );
}
