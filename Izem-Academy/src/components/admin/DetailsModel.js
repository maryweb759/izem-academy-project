import React, { useState, useEffect, useCallback} from "react";
import Pagination from "../Pagination";
import { X, Eye, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllEnrollement, processEnrollment } from "../../api/enrollement"; // adjust import path
import useAuthStore from "../../zustand/stores/authStore"; // if you store token in Zustand or context
import LoadingSpinner from "../LoadingSpinner";
import CopyButton from "../../components/copyComponent";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/confirmationModal";

// STYLED DETAILS MODAL
const DetailsModal = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">تفاصيل طلب التسجيل</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
           <div className="flex justify-between items-start pb-6">
<span dir="ltr" className="text-gray-900 font-bold text-lg">{request.totalAmount} DZD</span>
                    <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : request.status === "approved"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {request.status.toUpperCase()}
                </span>
                  </div>

          {/* Student Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-4 border border-blue-100">
  <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
    معلومات الطالب
  </h3>
  <div className="space-y-2">
    <div className="flex items-center">
      <span className="text-gray-600 font-medium w-40">الاسم:</span>
      <span className="text-gray-900 font-semibold">{request.user.fullName}</span>
    </div>
    <div className="flex items-center">
      
       <span className="text-gray-600 font-medium w-40">الهاتف:</span>
        <CopyButton textToCopy={request.user.phone} />
      <span dir="ltr" className="text-gray-900">{request.user.phone}</span>
      
    </div>
    <div className="flex items-center">
<span className="text-gray-600 font-medium w-40">تاريخ اضافة الطالب:</span>
      <span dir="ltr" className="text-gray-900">{new Date(request.requestedAt).toLocaleString()}</span>
    </div>
  </div>
</div>


         

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
              الدورات المطلوبة 
            </h3>
            <div className="space-y-3">
              {request.courses.map((c, idx) => (
                <div 
                  key={c._id} 
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Card Component
const MobileRequestCard = ({ req, index, onViewDetails, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }`}
      onClick={onViewDetails}
    >
      {/* Header - Always Visible */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{req.user.fullName}</h3>
          <p className="text-sm text-gray-600">{req.user.phone}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${
            req.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : req.status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {req.status}
        </span>
      </div>

      {/* Quick Info */}
      <div className="space-y-1 text-sm mb-3">
        <p className="text-gray-700">
          <span className="font-medium">Course:</span> {req.courses[0]?.title}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Total:</span> {req.totalAmount} DZD
        </p>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t pt-3 mb-3 space-y-1 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Price:</span> {req.courses[0]?.price} DZD
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Date:</span> {new Date(req.requestedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Less' : 'More'}
        </button>
        
        <div className="flex gap-2">
          <button
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            title="Approve"
          >
            <CheckCircle size={18} />
          </button>
          
          <button
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            title="Reject"
          >
            <XCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EnrollmentRequestsTable() {
  const [requests, setRequests] = useState([
   
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [reason, setReason] = useState("");
    const [error, setError] = useState(null);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const closeErrorModal = () => setErrorModalOpen(false);

    const itemsPerPage = 5;
  const token = useAuthStore((s) => s.token); // or wherever you store the token

 const fetchRequests = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await getAllEnrollement(token, currentPage + 1, itemsPerPage);
    setRequests(res.data.data || []);
    setTotalPages(res.data.pagination.totalPages);
  } catch (err) {
    console.error("Error fetching requests:", err);
     setError(err.message);
      console.error("Error updating enrollment:", err);
         setErrorModalOpen(true);
  } finally {
    setLoading(false);
  }
}, [token, currentPage]); // Dependencies here

useEffect(() => {
  fetchRequests();
}, [fetchRequests]); // Now stable reference


   const handleActionClick = (id, action) => {
    setPendingId(id);
    setPendingAction(action);
    setIsConfirmModalOpen(true);
  };

  const confirmAction = async () => {
    setError(null);
    try {
      const body = { action: pendingAction };
      if (pendingAction === "reject") {
        if (!reason.trim()) return alert("Please enter a rejection reason.");
        body.rejectionReason = reason;
      }

      const res = await processEnrollment(body, pendingId, token);

      if (res?.status === "success") {
        setSuccessMessage(res.message);
        setIsSuccessModalOpen(true);
      }

      // refresh
      fetchRequests();
    } catch (err) {
      setError(err.message);
      console.error("Error updating enrollment:", err);
         setErrorModalOpen(true);
      
    } finally {
      setIsConfirmModalOpen(false);
      setReason("");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-3 sm:p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">طلبات التسجيل</h2>
      
      {/* Mobile View - Cards */}
      <div className="block lg:hidden space-y-3">
        {requests.map((req, index) => (
          <MobileRequestCard
            key={req._id}
            req={req}
            index={index}
            onViewDetails={() => setSelectedRequest(req)}
            onApprove={() => handleActionClick(req._id, "approve")}
            onReject={() => handleActionClick(req._id, "reject")}
          />
        ))}
        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No requests found
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm border">
          {/* CENTERED HEADERS */}
          <thead className="bg-white text-gray-700 uppercase border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 border text-center">طالب</th>
              <th className="px-4 py-3 border text-center">هاتف</th>
              <th className="px-4 py-3 border text-center">عنوان الدورة</th>
              <th className="px-4 py-3 border text-center">إجمالي</th>
              <th className="px-4 py-3 border text-center">تاريخ الطلب</th>
              <th className="px-4 py-3 border text-center">حالة</th>
              <th className="px-4 py-3 border text-center">إجراءات</th>
            </tr>

          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr 
                key={req._id} 
                /* CLICKABLE ROW */
                onClick={() => setSelectedRequest(req)}
                className={`border-t hover:bg-gray-200 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* CENTERED DATA */}
                <td className="px-4 py-3 border text-center">{req.user.fullName}</td>
                <td dir="ltr" className="px-4 py-3 border text-center"> <CopyButton textToCopy={req.user.phone} />
                <span>{req.user.phone} </span></td>
                <td className="px-4 py-3 border text-center">{req.courses[0]?.title}</td>
                <td dir="ltr" className="px-4 py-3 border text-center">{req.totalAmount} DZD</td>
                <td className="px-4 py-3 border text-center">
                  {new Date(req.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 border">
                  {/* NO DETAILS ICON - Only Approve/Reject */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(req._id, "approve")
                      }}
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    
                    <button
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(req._id, "reject");
                      }}
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500 bg-gray-50">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 {/* Confirmation Modal */}
 <ConfirmationModal
  isOpen={isConfirmModalOpen}
  title={
    pendingAction === "reject" ? "رفض الطلب" : "الموافقة على الطلب"
  }
  message={
    pendingAction === "reject"
      ? "هل أنت متأكد أنك تريد رفض هذا التسجيل؟"
      : "هل أنت متأكد أنك تريد الموافقة على هذا التسجيل؟"
  }
  confirmLabel={pendingAction === "reject" ? "رفض" : "موافقة"}
  cancelLabel="غلق"
  confirmColor={pendingAction === "reject" ? "red" : "primary"}
  showReasonInput={pendingAction === "reject"}
  reason={reason}
  setReason={setReason}
  onCancel={() => setIsConfirmModalOpen(false)}
  onConfirm={confirmAction}
/>

      {/* <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={
          pendingAction === "reject" ? "Reject Request" : "Approve Request"
        }
        message={
          pendingAction === "reject"
            ? "Are you sure you want to reject this enrollment?"
            : "Are you sure you want to approve this enrollment?"
        }
        confirmLabel={pendingAction === "reject" ? "Reject" : "Approve"}
        showReasonInput={pendingAction === "reject"}
        reason={reason}
        setReason={setReason}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
      /> */}
      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
      />

      {/* Details Modal */}
      {selectedRequest && (
        <DetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
      {/* error dialog */}
       <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={error}
      />
    </div>
  );
}
