import React, { useState, useEffect, useCallback } from "react";
import { getAllUsers, deleteUser, updateUserPassword } from '../../api/users'; // Assuming these will be in your API file
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { Edit, Trash2, KeyRound, PlusCircle, X, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Assuming FormInput, SuccessModal, ErrorModal are available components
// You might need to adjust the import paths based on your project structure
import FormInput from "../../components/FormInput"; // Placeholder, adjust path
import SuccessModal from "../../components/modals/SuccessModal"; // Placeholder, adjust path
import ErrorModal from "../../components/modals/ErrorModal"; // Placeholder, adjust path
import ConfirmationModal from "../../components/modals/confirmationModal"; // Placeholder, adjust path

// Reusable Modal Component (adapted from DetailsModal reference)
const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// A dedicated component for the mobile card view to keep the main component clean.
const UserCard = ({ user, onShowDetails, onDelete, onUpdatePassword }) => (
  <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onShowDetails(user)}>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-lg text-gray-800">{user.fullName}</h3>
        <p className="text-sm text-gray-600" dir="ltr">{user.phone}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          user.role === 'admin' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
        {user.role === 'admin' ? 'مدير' : 'طالب'}
      </span>
    </div>
    <div className="space-y-1 text-sm text-gray-700 border-t pt-3 mt-3">
      <p><span className="font-medium">المدينة:</span> {user.city}</p>
      <p><span className="font-medium">عدد الدورات:</span> {user.courses?.length || 0}</p>
    </div>
    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t" onClick={(e) => e.stopPropagation()}> {/* Prevent modal from opening when clicking buttons */}
      <button onClick={() => onUpdatePassword(user._id)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors" title="تغيير كلمة المرور">
        <KeyRound size={18} />
      </button>
      <button onClick={() => onDelete(user._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="حذف المستخدم">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToUpdatePassword, setUserToUpdatePassword] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchUsers = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await getAllUsers(token, page, 10, search);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage(error.message || "فشل في جلب المستخدمين");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    console.log("Add new user button clicked");
    // Future logic for opening a modal or navigating to a new page for adding a user
  };

  const handleShowUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

// ✅ Step 1: Trigger the confirmation modal
  const handleDeleteUserClick = (userId) => {
    setPendingUserId(userId);
    setIsConfirmModalOpen(true);
  };

  // ✅ Step 2: Confirm delete action
  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteUser(pendingUserId, token);

      setSuccessMessage("تم حذف المستخدم ودوراته بنجاح");
      setIsSuccessModalOpen(true);
      fetchUsers(currentPage); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage(error.message || "فشل في حذف المستخدم");
      setIsErrorModalOpen(true);
    } finally {
      setIsConfirmModalOpen(false);
      setPendingUserId(null);
    }
  };

  const handleUpdatePasswordClick = (userId) => {
    setUserToUpdatePassword(userId);
    setIsPasswordModalOpen(true);
    reset({ newPassword: "" }); // Clear form on open
  };

  const onSubmitUpdatePassword = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await updateUserPassword({ newPassword: data.newPassword },userToUpdatePassword, token);
      setSuccessMessage("Password updated successfully");
      setIsSuccessModalOpen(true);
      setIsPasswordModalOpen(false);
      setUserToUpdatePassword(null);
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage(error.message || "فشل في تحديث كلمة المرور");
      setIsErrorModalOpen(true);
    }
  };

  return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Header: Title and Add User Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">إدارة المستخدمين</h1>
          {/* <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            <span>إضافة مستخدم</span>
          </button> */}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          value={search}
          onChange={handleSearch}
          className="mb-4 px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-primary-light focus:border-primary"
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="lg:hidden space-y-4">
              {users.length > 0 ? (
                users.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onShowDetails={handleShowUserDetails}
                    onDelete={handleDeleteUserClick}
                    onUpdatePassword={handleUpdatePasswordClick}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد نتائج</p>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3 text-center">الاسم الكامل</th>
                    <th className="px-6 py-3 text-center">الهاتف</th>
                    <th className="px-6 py-3 text-center">المدينة</th>
                    <th className="px-6 py-3 text-center">الدور</th>
                    <th className="px-6 py-3 text-center">عدد الدورات</th>
                    <th className="px-6 py-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleShowUserDetails(user)}>
                        <td className="px-6 py-4 text-center font-medium text-gray-900">{user.fullName}</td>
                        <td className="px-6 py-4 text-center" dir="ltr">{user.phone}</td>
                        <td className="px-6 py-4 text-center">{user.city}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {user.role === 'admin' ? 'مدير' : 'طالب'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">{user.courses?.length || 0}</td>
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}> {/* Prevent modal from opening when clicking buttons */}
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => handleUpdatePasswordClick(user._id)} className="text-yellow-600 hover:text-yellow-800" title="تغيير كلمة المرور">
                              <KeyRound size={18} />
                            </button>
                            <button onClick={() => handleDeleteUserClick(user._id)} className="text-red-600 hover:text-red-800" title="حذف">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">لا توجد نتائج</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.currentPage - 1}
                  totalPages={pagination.totalPages}
                  paginate={(page) => setCurrentPage(page + 1)}
                />
                 <div className="text-center text-sm text-gray-600 mt-2">
                    صفحة {pagination.currentPage} من {pagination.totalPages} (إجمالي {pagination.totalUsers} مستخدم)
                </div>
              </div>
            )}
          </>
        )}

      {/* User Details Modal */}
      <CustomModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="تفاصيل المستخدم"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                معلومات المستخدم
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-40">الاسم:</span>
                  <span className="text-gray-900 font-semibold">{selectedUser.fullName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-40">الهاتف:</span>
                  <span dir="ltr" className="text-gray-900">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-40">المدينة:</span>
                  <span className="text-gray-900">{selectedUser.city}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-40">الدور:</span>
                  <span className="text-gray-900">{selectedUser.role === 'admin' ? 'مدير' : 'طالب'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-40">تاريخ التسجيل:</span>
                  <span dir="ltr" className="text-gray-900">{new Date(selectedUser.createdOn).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Courses Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
                الدورات المسجل بها
              </h3>
              <div className="space-y-3">
                {selectedUser.courses && selectedUser.courses.length > 0 ? (
                  selectedUser.courses.map((c, idx) => (
                    <div 
                      key={c._id || idx} 
                      className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{c.title}</h4>
                          <p className="text-sm text-gray-600">Code: {c.code}</p>
                        </div>
                        <span className="text-purple-600 font-bold text-lg">{c.price} DZD</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">لا توجد دورات مسجل بها.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Update Password Modal */}
      <CustomModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="تغيير كلمة المرور"
      >
        <form onSubmit={handleSubmit(onSubmitUpdatePassword)} className="space-y-4">
          <FormInput
            id="newPassword"
            label="كلمة المرور الجديدة"
            placeholder="********"
            type="password"
            register={register}
            errors={errors}
            Icon={KeyRound}
            validationRules={{
              required: "هذا الحقل مطلوب",
              minLength: {
                value: 6,
                message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
              },
            }}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            تحديث كلمة المرور
          </button>
        </form>
      </CustomModal>
       {/* ✅ Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="حذف المستخدم"
        message="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        confirmColor="red"
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteUser}
      />

      {/* Success and Error Modals */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />
    </div>
  );
}
