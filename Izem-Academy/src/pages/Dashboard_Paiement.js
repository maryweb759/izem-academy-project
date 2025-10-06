import React, { useState } from "react";
import useAuthStore from "../zustand/stores/authStore";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import {
  getAllPaiment,
  approvePaiement,
  getReceiptPaiement,
  blockUser,
} from "../api/subscription";
import Pagination from "../components/Pagination";
import { Search, Filter, Image, X, Check, Ban } from "lucide-react";
import useErrorStore from "../zustand/stores/useErrorStore";
import Modal from "react-modal";
import SuccessModal from "../components/modals/SuccessModal";
import ErrorModal from "../components/modals/ErrorModal";
import { FormattedMessage, useIntl } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

Modal.setAppElement("#root");

const itemsPerPage = 10;

function Dashboard_Paiement() {
  const token = useAuthStore((state) => state.token);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenApproved, setModalIsOpenApproved] = useState(false);
  const [modalIsOpenRejected, setModalIsOpenRejected] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const openErrorModal = () => setErrorModalOpen(true);
  const closeErrorModal = () => setErrorModalOpen(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const [search, setSearch] = useState("all");
  const [etat, setEtat] = useState("pending");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalIsOpenBlock, setModalIsOpenBlock] = useState(false);
  const intl = useIntl();
  const { dir, language } = useLanguageStore();
  const isRTL = dir === "rtl";

  const stateMapping = {
    all: (
      <FormattedMessage
        id="DashboardPaiement.filter.all"
        defaultMessage="الكل"
      />
    ),
    pending: (
      <FormattedMessage
        id="DashboardPaiement.filter.pending"
        defaultMessage="قيد الانتظار"
      />
    ),
    approved: (
      <FormattedMessage
        id="DashboardPaiement.filter.approved"
        defaultMessage="مكتملة"
      />
    ),
    rejected: (
      <FormattedMessage
        id="DashboardPaiement.filter.rejected"
        defaultMessage="مرفوض"
      />
    ),
  };
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const {
    data: paimentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paimentAll", etat, currentPage, itemsPerPage],
    queryFn: () =>
      getAllPaiment(token, search, etat, currentPage, itemsPerPage),
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

  const paiments = paimentsData?.paiments || [];
  const totalPages = paimentsData?.totalPage || 1;

  const handleSearchClick = () => {
    if (search.trim() === "") {
      setSearch("all");
    } else {
      setSearch(search);
    }
    refetch();
  };
  const fetchReceiptImage = async (paiementId) => {
    try {
      const response = await getReceiptPaiement(paiementId, token);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image:", error);
      throw error;
    }
  };
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    refetch();
  };

  const getItemName = (item, lang) => {
    try {
      switch (lang) {
        case "ar":
          return item.nom_ar;
        case "fr":
          return item.nom_fr;
        case "en":
          return item.nom_en;
        default:
          return item.nom_ar;
      }
    } catch (e) {
      console.log(e);
      return item.nom_ar;
    }
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
              id: "DashboardPaiement.search.placeholder",
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
          {/* Tableau */}
          <table className="w-full ">
            <thead
              className={` bg-[#f8f8f8] ${isRTL ? "text-right" : "text-left"}`}
            >
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.id"
                    defaultMessage="ID"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.email"
                    defaultMessage="e-MAIL"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.image"
                    defaultMessage="image"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.level"
                    defaultMessage="niveau"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.time"
                    defaultMessage="temps"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.actions"
                    defaultMessage="actions"
                  />
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-[#1A1A27]">
                  <FormattedMessage
                    id="DashboardPaiement.header.block"
                    defaultMessage="bloquer"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {paiments.map((item) => (
                <tr key={item.paiement_id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.paiement_id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <button
                      onClick={async () => {
                        try {
                          const imageBlob = await fetchReceiptImage(
                            item.paiement_id
                          );
                          const imageUrl = URL.createObjectURL(imageBlob);
                          setSelectedImage(imageUrl);
                          setModalIsOpen(true);
                        } catch (error) {
                          console.error(
                            "Erreur lors de la récupération de l'image:",
                            error
                          );
                          setLocalErrorMessage(
                            "Erreur lors de la récupération de l'image"
                          );
                          openErrorModal();
                        }
                      }}
                      className="text-main hover:text-main-dark transition-colors"
                    >
                      <Image size={22} color="#EA5455" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getItemName(item, language)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(item.payed_at).toLocaleDateString()} <br />
                    {new Date(item.payed_at).toLocaleTimeString()}
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
                            setSelectedPayment(item.paiement_id);
                            setModalIsOpenRejected(true);
                          }}
                        >
                          <X size={20} />
                        </button>
                        <button
                          className="bg-[#61C478] text-white p-1 rounded-full"
                          onClick={() => {
                            setSelectedPayment(item.paiement_id);
                            setModalIsOpenApproved(true);
                          }}
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex ">
                      <button
                        className="bg-[#EA5455] text-white p-1 rounded-full"
                        onClick={() => {
                          setSelectedEmail(item.email);
                          setModalIsOpenBlock(true);
                        }}
                      >
                        <Ban size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Rest of the Modal code remains the same */}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
      />

      {/* { model pour bloque l'utilisateur} */}
      <Modal
        isOpen={modalIsOpenBlock}
        onRequestClose={() => setModalIsOpenBlock(false)}
        contentLabel="Block Confirmation"
        className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={() => setModalIsOpenBlock(false)}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-500 flex items-center justify-center rounded-full">
              <Ban className="h-8 w-8 text-white" />
            </div>

            <p className="text-textModal font-semibold text-lg">
              <FormattedMessage
                id="DashboardPaiement.modal.block.title"
                defaultMessage="هل تريد حظر هذا المستخدم؟"
              />
            </p>

            <div className="flex space-x-2 ">
              <button
                className="w-[99px] py-2 bg-[#FF3D00] text-white text-center rounded-md text-sm font-medium"
                onClick={() => setModalIsOpenBlock(false)}
              >
                <FormattedMessage
                  id="DashboardPaiement.button.no"
                  defaultMessage="لا"
                />
              </button>
              <button
                className="w-[99px] py-2 bg-[#61C478] flex items-center justify-center text-white text-center rounded-md text-sm font-medium"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await blockUser(
                      {
                        email: selectedEmail,
                      },
                      token
                    );
                    setModalIsOpenBlock(false);
                    setSelectedEmail(null);
                    setSuccessMessage(result.message);
                    openSuccessModal();
                    setModalIsOpenBlock(false);
                  } catch (error) {
                    console.log("error", error);
                    setModalIsOpenBlock(false);
                    setSelectedEmail(null);
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
                    id="DashboardPaiement.button.yes"
                    defaultMessage="نعم"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Modal pour afficher l'image */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Image Preview"
        className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            className="absolute -top-2 right-1 text-red-500"
            onClick={() => setModalIsOpen(false)}
          >
            <X size={24} />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Paiement"
              className="max-w-full max-h-[80vh] rounded-md"
            />
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpenApproved}
        onRequestClose={() => setModalIsOpenApproved(false)}
        contentLabel="Image Preview"
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
            {/* Icône de validation */}
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

            {/* Texte d'information */}
            <p className="text-textModal font-semibold text-lg">
              <FormattedMessage
                id="DashboardPaiement.modal.approve.title"
                defaultMessage="هل تريد الموافقة على الطلب؟"
              />
            </p>

            <div className="flex gap-2 ">
              <button
                className="w-[99px]  py-2 bg-[#FF3D00] text-white text-center rounded-md text-sm font-medium"
                onClick={() => setModalIsOpenApproved(false)}
              >
                <FormattedMessage
                  id="DashboardPaiement.button.no"
                  defaultMessage="لا"
                />
              </button>
              <button
                className="w-[99px]  py-2 bg-[#61C478]  flex items-center justify-center text-white text-center rounded-md text-sm font-medium"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await approvePaiement(
                      {
                        id_paiement: selectedPayment,
                        validate: true,
                      },
                      token
                    );
                    setModalIsOpenApproved(false);
                    setSelectedPayment(null);
                    setSuccessMessage(result.message);
                    openSuccessModal();
                  } catch (error) {
                    console.log("error", error);
                    setModalIsOpenApproved(false);
                    setSelectedPayment(null);
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
                    id="DashboardPaiement.button.yes"
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
        contentLabel="Image Preview"
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

            {/* Texte d'information */}
            <p className="text-textModal font-semibold text-lg">
              <FormattedMessage
                id="DashboardPaiement.modal.reject.title"
                defaultMessage="هل تريد رفض على الطلب؟"
              />
            </p>

            <div className="flex gap-2 ">
              <button
                className="w-[99px]  py-2 bg-[#FF3D00]  text-white text-center rounded-md text-sm font-medium"
                onClick={() => setModalIsOpenRejected(false)}
              >
                <FormattedMessage
                  id="DashboardPaiement.button.no"
                  defaultMessage="لا"
                />
              </button>
              <button
                className="w-[99px]  py-2 bg-[#61C478] text-white text-center rounded-md text-sm font-medium"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await approvePaiement(
                      {
                        id_paiement: selectedPayment,
                        validate: false,
                      },
                      token
                    );
                    setModalIsOpenRejected(false);
                    setSelectedPayment(null);
                    setSuccessMessage(result.message);
                    openSuccessModal();
                  } catch (error) {
                    setModalIsOpenRejected(false);
                    setSelectedPayment(null);
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
                    id="DashboardPaiement.button.yes"
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

export default Dashboard_Paiement;
