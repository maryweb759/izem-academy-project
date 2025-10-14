import ErrorModal from "../components/modals/ErrorModal"; // import your reusable error modal
    import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ResponsePopup({ response, onClose }) {
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);

  if (!response) return null;

  const { status,totalAmount, requestedCourses, skippedCourses, message } = response;

  // if error → use ErrorModal instead of this popup
  if (status === "error") {
    return (
      <ErrorModal
        isOpen={true}
        closeModal={onClose} // reuse the same close handler
        message={message || "حدث خطأ غير متوقع"}
      />
    );
  }

  // success / skipped popup
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="p-6 rounded-2xl shadow-xl w-96 relative bg-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
         {/* New Courses */}

{requestedCourses?.length > 0 && (
  <div className="m-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
    {/* Header with Icon + Title */}
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-green-100 text-green-600 rounded-full p-2 flex items-center justify-center">
        <CheckCircle size={22} strokeWidth={2.5} />
      </div>
      <h2 className="text-lg font-bold text-green-800">
        أخبار رائعة! 🎉 تم تقديم طلبك بنجاح
      </h2>
    </div>

    {/* Description */}
    <p className="text-green-700 leading-relaxed">
      يرجى دفع المبلغ المستحق وقدره{" "}
      <span className="font-extrabold text-xl text-green-900">
        {totalAmount} دج
      </span>{" "}
      ثم إرسال الإيصال إلى المشرف. سيتم مراجعة الطلب والموافقة عليه خلال{" "}
      <span className="font-semibold text-green-800">12 ساعة</span>.
    </p>

    {/* Course list */}
    <ul className="list-disc list-inside mt-3 text-secondDarkColor">
      {requestedCourses.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  </div>
)}



        {/* Skipped Courses */}
        {skippedCourses?.length > 0 && (
          <>
            <h2 className="text-lg font-bold m-4 p-2 bg-yellow-100">
              لا يمكنك الاشتراك في هذه الدورة، فهي موجودة من قبل في مجموعتك ⚠️
            </h2>
            <ul className="list-disc list-inside text-secondDarkColor">
              {skippedCourses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        )}

       
      </div>
    </div>
  );
}
