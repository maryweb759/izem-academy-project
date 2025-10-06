import { useEffect, useState } from "react";
import DataCard from "../../components/cards"; // adjust path
import EnrollmentRequestsTable from "../../components/admin/DetailsModel";
export default function Enrollement() {



  return (
  <>

    <div className="mt-8">
      <EnrollmentRequestsTable />
    </div>
  </>
);

}
