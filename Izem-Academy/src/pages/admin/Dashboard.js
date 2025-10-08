import { useEffect, useState } from "react";
import DataCard from "../../components/cards";
import LoadingSpinner from "../../components/LoadingSpinner";

import EnrollmentRequestsTable from "../../components/admin/DetailsModel";
import { dashboardCards} from "../../api/users";
import useAuthStore from "../../zustand/stores/authStore"; // Assuming you use Zustand for auth
export default function Dashboard() {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiResponse = await dashboardCards(token);
        
        if (apiResponse.success) {
          const { 
            totalIncome, 
            totalStudents, 
            totalEnrollmentRequests, 
            totalCourses,
            enrollmentBreakdown 
          } = apiResponse.data;

          // Map API response to cards format
          const mappedData = [
            {
              name: "الإيرادات الكلية",
              amount: `${totalIncome} DZ`,
              icon: "revenue-icon",
              color: "#208FB4",
              progressValue: 100,
            },
            {
              name: " الطلاب المسجلين ",
              amount: totalStudents,
              icon: "users-icon",
              color: "#FD6C75",
              progressValue: 100,
            },
            {
              name: "التسجيلات المؤكدة ",
              amount: enrollmentBreakdown.approved,
              icon: "enrollments-icon",
              color: "#B4708D",
              progressValue: 100,
            },
            {
              name: "إجمالي الدورات",
              amount: totalCourses,
              icon: "courses-icon",
              color: "#F1BF5A",
              progressValue: 100,
            },
          ];

          setCardsData(mappedData);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 if (loading) return <LoadingSpinner />;
 

  if (error) {
    return <div className="text-center py-8 text-red-500">خطأ: {error}</div>;
  }

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