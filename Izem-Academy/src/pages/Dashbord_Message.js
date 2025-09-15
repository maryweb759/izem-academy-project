import React, { useState } from "react";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { getAllMessages } from "../api/users";
import { Search, X } from "lucide-react";
import useErrorStore from "../zustand/stores/useErrorStore";
import { FormattedMessage, useIntl } from "react-intl";

function Dashbord_Message() {
  const token = useAuthStore((state) => state.token);
  const [search, setSearch] = useState("");
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const intl = useIntl();

  const {
    data: messageData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["messageAll"],
    queryFn: () => getAllMessages(token),
  });

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF3D00" size={50} />
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (isError) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : errorMessage;
    return <div className="text-center py-8 text-red-500">{message}</div>;
  }

  // Fonction pour filtrer les messages
  const filteredMessages = messageData.filter((msg) => {
    const searchLower = search.toLowerCase();
    return (
      msg.user?.userName.toLowerCase().includes(searchLower) ||
      msg.user?.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="flex items-center gap-2 p-2 relative">
        <div className="flex items-center flex-grow px-2 bg-white border border-[#E7E7E7] rounded-3xl">
          <Search size={22} className="text-[#B5B5B5]" />
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: "DashboardMessage.search.placeholder",
              defaultMessage: "ابحث عن رسالة",
            })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow bg-transparent p-2 text-gray-700 focus:outline-none"
          />
          <button
            className="text-[#B5B5B5] focus:outline-none"
            onClick={() => {
              setSearch("");
            }}
          >
            <X size={22} className="text-[#B5B5B5]" />
          </button>
        </div>
      </div>

      {/* Liste des messages filtrés */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FormattedMessage
              id="DashboardMessage.message.empty"
              defaultMessage="لا توجد رسائل"
            />
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="rounded bg-white p-4 shadow-sm">
              <p className="mb-2 text-mainDarkColor font-roboto font-normal text-[18px] leading-[30px]">
                {msg.message}
              </p>
              <div className="mb-2">
                <p className="text-[#696879] font-roboto font-bold text-[16px] leading-[20px]">
                  {msg.user?.userName}
                </p>
                <p className="text-[#696879] font-roboto font-normal text-[14px] leading-[20px]">
                  {msg.user?.email}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashbord_Message;
