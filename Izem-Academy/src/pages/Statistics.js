import React from "react";
import user from "../assets/user.png";
import { FormattedMessage } from "react-intl";

const Statistics = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 sm:py-8 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl  shadow-sm p-3 text-center">
        <div className="flex justify-center mb-2">
          <img src={user} alt="user" className="w-[25px] h-[25px]" />
        </div>
        <h2 className="text-base font-medium font-roboto  text-mainDarkColor leading-tight tracking-tight mb-1  ">
          <FormattedMessage
            id="Dashboard.statistics.users"
            defaultMessage="مجموع الأعضاء"
          />
        </h2>
        <p className="text-darkGrey text-base font-medium font-raleway leading-snug tracking-tight">
          {data?.total_user || 0}
        </p>
      </div>

      <div className="bg-white rounded-xl  shadow-sm p-3 text-center">
        <div className="flex justify-center mb-2">
          <img src={user} alt="user" className="w-[25px] h-[25px]" />
        </div>
        <h2 className="text-base font-medium font-roboto  text-mainDarkColor leading-tight tracking-tight mb-1  ">
          <FormattedMessage
            id="Dashboard.statistics.activeUsers"
            defaultMessage="الأعضاء النشطين"
          />
        </h2>
        <p className="text-darkGrey text-base font-medium font-raleway leading-snug tracking-tight">
          {data?.total_user_active_subscription || 0}
        </p>
      </div>
    </div>
  );
};

export default Statistics;
