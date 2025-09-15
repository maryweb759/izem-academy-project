import React, { useState } from "react";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { getAllWithDraw, reponseWithDraw } from "../api/withdraw";
import Pagination from "../components/Pagination";
import { Search, Filter, X, Check } from "lucide-react";
import useErrorStore from "../zustand/stores/useErrorStore";
import copy from "../assets/copy.png";
import Modal from "react-modal";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import CopyButton from "../components/copyComponent";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

Modal.setAppElement("#root");

const itemsPerPage = 10;

function Dashbord_WithDraw() {
  const token = useAuthStore((state) => state.token);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalIsOpenApproved, setModalIsOpenApproved] = useState(false);
  const [modalIsOpenRejected, setModalIsOpenRejected] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const [selectedWithDraw, setSelectedWithDraw] = useState(null);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("all");
  const [etat, setEtat] = useState("pending");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const intl = useIntl();
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  const stateMapping = {
    all: (
      <FormattedMessage
        id="DashboardWithdraw.filter.all"
        defaultMessage="الكل"
      />
    ),
    pending: (
      <FormattedMessage
        id="DashboardWithdraw.filter.pending"
        defaultMessage="قيد الانتظار"
      />
    ),
    approved: (
      <FormattedMessage
        id="DashboardWithdraw.filter.approved"
        defaultMessage="مكتملة"
      />
    ),
    rejected: (
      <FormattedMessage
        id="DashboardWithdraw.filter.rejected"
        defaultMessage="مرفوض"
      />
    ),
  };

  const errorMessage = useErrorStore((state) => state.errorMessage);
  const {
    data: withDrawData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["withDrawAll", etat, currentPage, itemsPerPage],
    queryFn: () =>
      getAllWithDraw(token, search, etat, currentPage, itemsPerPage),
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
    return <div className="text-center py-8 text-red-500"> {message}</div>;
  }

  const withDraws = withDrawData?.withdrawUsers || [];
  const totalPages = withDrawData?.totalPage || 1;

  const handleSearchClick = () => {
    if (search.trim() === "") {
      setSearch("all");
    } else {
      setSearch(search);
    }
    refetch();
  };
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    refetch();
  };
  return (
    <div>
      <div className="flex items-center gap-2 p-2 relative">
        {/* Filtre Button */}
        <button
          className="flex items-center justify-center  w-9 h-[35px] bg-white rounded-xl border border-[#e7e7e7]"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={22} className="text-[#B3B3B3]" />
        </button>
        {/* Menu déroulant des options de filtrage */}
        {isFilterOpen && (
          <div className="absolute left-0 top-14 w-48 bg-white border border-[#E7E7E7] rounded-lg shadow-lg z-10">
            {Object.entries(stateMapping).map(([key, value]) => (
              <div
                key={key}
                className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors ${
                  etat === key ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  setEtat(key);
                  setIsFilterOpen(false);
                }}
              >
                {value}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center flex-grow px-2 bg-white border border-[#E7E7E7] rounded-3xl">
          <Search size={22} className="text-[#B5B5B5]" />
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: "DashboardWithdraw.search.placeholder",
              defaultMessage: "بحث",
            })}
            value={search !== "all" ? search : ""}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow bg-transparent p-2 text-gray-700 focus:outline-none"
          />
          <button
            className="text-[#B5B5B5] focus:outline-none"
            onClick={() => {
              setSearch("all");
              refetch();
            }}
          >
            <X size={22} className="text-[#B5B5B5]" />
          </button>
        </div>
        <button
          className="flex items-center justify-center w-9 h-[35px] bg-main rounded-xl border border-[#e7e7e7]"
          onClick={handleSearchClick}
        >
          <Search size={22} className="text-white" />
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead
              className={`bg-[#f8f8f8] ${isRTL ? "text-right" : "text-left"}`}
            >
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.id"
                    defaultMessage="ID"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.email"
                    defaultMessage="e-MAIL"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.amount"
                    defaultMessage="montant"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.wallet"
                    defaultMessage="rtc-20"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.time"
                    defaultMessage="temp"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardWithdraw.header.actions"
                    defaultMessage="actions"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {withDraws.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.withdraw_point?.toFixed(2)}
                  </td>
                  <td className=" py-3 px-4 text-sm text-gray-700 flex flex-wrap gap-2 items-center">
                    <CopyButton textToCopy={item.user.rtc_wallet} />
                    <span>{item.user.rtc_wallet}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.created_at}
                  </td>
                  <td className=" py-3 px-4 text-sm text-gray-700 flex">
                    {item.etat === "rejected" && (
                      <X size={20} className="text-[#EA5455] " />
                    )}
                    {item.etat === "approved" && (
                      <Check size={20} className="text-[#61C478]" />
                    )}
                    {item.etat === "pending" && (
                      <div className="flex gap-2 ">
                        <button
                          className="bg-[#EA5455] text-white p-1 rounded-full"
                          onClick={() => {
                            setSelectedWithDraw(item?.id);
                            setModalIsOpenRejected(true);
                          }}
                        >
                          <X size={20} />
                        </button>
                        <button
                          className="bg-[#61C478] text-white p-1 rounded-full"
                          onClick={() => {
                            setSelectedWithDraw(item?.id);
                            setModalIsOpenApproved(true);
                          }}
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
      />
      <Modal
        isOpen={modalIsOpenApproved}
        onRequestClose={() => setModalIsOpenApproved(false)}
        contentLabel={
          <FormattedMessage
            id="DashboardWithdraw.modal.image.label"
            defaultMessage="Image Preview"
          />
        }
        className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={() => setModalIsOpenApproved(false)}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-500 flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <p className="text-textModal font-semibold text-lg">
              <FormattedMessage
                id="DashboardWithdraw.modal.approve.title"
                defaultMessage="هل تريد الموافقة على الطلب؟"
              />
            </p>

            <div className="flex gap-2 ">
              <button
                className="w-[99px] py-2 bg-[#FF3D00] text-white text-center rounded-md text-sm font-medium"
                onClick={() => setModalIsOpenApproved(false)}
              >
                <FormattedMessage
                  id="DashboardWithdraw.button.no"
                  defaultMessage="لا"
                />
              </button>
              <button
                className="w-[99px] py-2 bg-[#61C478] flex items-center justify-center text-white text-center rounded-md text-sm font-medium"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const data = {
                      id_withdraw: selectedWithDraw,
                      validate: true,
                    };
                    const result = await reponseWithDraw(data, token);
                    setModalIsOpenApproved(false);
                    setSelectedWithDraw(null);
                    setSuccessMessage(result.message);
                    openSuccessModal();
                  } catch (error) {
                    console.log("error", error);
                    setModalIsOpenApproved(false);
                    setSelectedWithDraw(null);
                    if (error.response && error.response.data.message) {
                      setLocalErrorMessage(error.response.data.message);
                    } else {
                      setLocalErrorMessage(errorMessage);
                    }
                    openErrorModal();
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="white" size={16} />
                ) : (
                  <FormattedMessage
                    id="DashboardWithdraw.button.yes"
                    defaultMessage="نعم"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpenRejected}
        onRequestClose={() => setModalIsOpenRejected(false)}
        contentLabel={
          <FormattedMessage
            id="DashboardWithdraw.modal.image.label"
            defaultMessage="Image Preview"
          />
        }
        className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={() => setModalIsOpenRejected(false)}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-[#EA5455] flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <p className="text-textModal font-semibold text-lg">
              <FormattedMessage
                id="DashboardWithdraw.modal.reject.title"
                defaultMessage="هل تريد رفض على الطلب؟"
              />
            </p>

            <div className="flex gap-2 ">
              <button
                className="w-[99px] py-2 bg-[#FF3D00] text-white text-center rounded-md text-sm font-medium"
                onClick={() => setModalIsOpenRejected(false)}
              >
                <FormattedMessage
                  id="DashboardWithdraw.button.no"
                  defaultMessage="لا"
                />
              </button>
              <button
                className="w-[99px] py-2 bg-[#61C478] text-white text-center rounded-md text-sm font-medium"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await reponseWithDraw(
                      {
                        id_withdraw: selectedWithDraw,
                        validate: false,
                      },
                      token
                    );
                    setModalIsOpenRejected(false);
                    setSelectedWithDraw(null);
                    setSuccessMessage(result.message);
                    openSuccessModal();
                  } catch (error) {
                    setModalIsOpenRejected(false);
                    setSelectedWithDraw(null);
                    if (error.response && error.response.data.message) {
                      setLocalErrorMessage(error.response.data.message);
                    } else {
                      setLocalErrorMessage(errorMessage);
                    }
                    openErrorModal();
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="white" size={16} />
                ) : (
                  <FormattedMessage
                    id="DashboardWithdraw.button.yes"
                    defaultMessage="نعم"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        message={localErrorMessage}
      />
    </div>
  );
}

export default Dashbord_WithDraw;
