import React from "react";

const Table = ({ activeTab, data }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="w-full ">
        <thead className="bg-gray-100">
          <tr>
            {activeTab === "paiement" && (
              <>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  البريد الإلكتروني
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  المبلغ
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  RFC-20
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  التاريخ
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  الوقت
                </th>
              </>
            )}
            {activeTab === "retrait" && (
              <>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  البريد الإلكتروني
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  الصورة
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  المستوى
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  الوقت
                </th>
              </>
            )}
            {activeTab === "messages" && (
              <>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  الاسم
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  البريد الإلكتروني
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                  الرسالة
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              {activeTab === "paiement" && (
                <>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.montant}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.rfc}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.time}
                  </td>
                </>
              )}
              {activeTab === "retrait" && (
                <>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.image}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.niveau}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.time}
                  </td>
                </>
              )}
              {activeTab === "messages" && (
                <>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.message}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
