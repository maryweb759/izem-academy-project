import { useEffect, useState } from "react";
import DataCard from "../../components/cards"; // adjust path
import EnrollmentRequestsTable from "../../components/admin/DetailsModel";
export default function Dashboard() {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // Replace this with your real API call later
      const response =  [
        {
          name: "الإيرادات الكلية",
          amount: 0,
          icon: "revenue-icon",
          color: "#208FB4", // hex color (matches DataCard)
          progressValue: 0,
        },
        {
          name: "المستخدمون النشطاء",
          amount: 0,
          icon: "users-icon",
          color: "#FD6C75",
          progressValue: 0,
        },
        {
          name: "إجمالي التسجيلات",
          amount: 0,
          icon: "enrollments-icon",
          color: "#B4708D",
          progressValue: 0,
        },
        {
          name: "إجمالي الدورات",
          amount: 0,
          icon: "courses-icon",
          color: "#F1BF5A",
          progressValue: 0,
        },
      ];

      setCardsData(response);
    };

    fetchData();
  }, []);

  return (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardsData.map((item, idx) => (
        <DataCard
          key={idx}
          name={item.name}
          amount={item.amount}
          icon={item.icon}
          color={item.color}
          progressValue={item.progressValue}
        />
      ))}
    </div>

    <div className="mt-8">
      <EnrollmentRequestsTable />
    </div>
  </>
);

}
