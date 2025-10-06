import ErrorModal from "../components/modals/ErrorModal"; // import your reusable error modal

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
          <>
            {/* <h2 className="text-lg font-bold m-4 p-2 bg-green-100">
              تمت إضافة الدورة بنجاح ✅
            </h2> */}
           <h2 className="text-lg font-bold m-4 p-2 bg-green-100">
  تم تقديم الطلب بنجاح، يرجى دفع{' '}
  <span className="font-extrabold text-xl ">
    {totalAmount} دج
  </span>{' '}
  وإرسال الإيصال إلى المشرف، وسيتم الموافقة عليه خلال 12 ساعة
</h2>


            <ul className="list-disc list-inside text-secondDarkColor">
              {requestedCourses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
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
