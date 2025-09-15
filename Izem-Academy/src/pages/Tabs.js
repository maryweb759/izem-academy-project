// src/components/Dashboard/Tabs.jsx
import React from "react";
import { FormattedMessage } from "react-intl";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full grid grid-cols-3 mb-6 sm:mb-8">
      {[
        {
          key: "messages",
          label: (
            <FormattedMessage
              id="Dashboard.tabs.messages"
              defaultMessage="الرسائل"
            />
          ),
        },
        {
          key: "retrait",
          label: (
            <FormattedMessage
              id="Dashboard.tabs.retrait"
              defaultMessage="طلبات السحب"
            />
          ),
        },
        {
          key: "paiement",
          label: (
            <FormattedMessage
              id="Dashboard.tabs.paiement"
              defaultMessage="طلبات الدفع"
            />
          ),
        },
      ]
        .reverse()
        .map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-roboto ${
              activeTab === tab.key
                ? "border-b-2 border-black font-semibold text-mainDarkColor"
                : "text-mainDarkColor"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
    </div>
  );
};

export default Tabs;
