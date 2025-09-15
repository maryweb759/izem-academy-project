import React,{useState} from 'react'
import Statistics from './Statistics';
import Tabs from './Tabs';
import Dashboard_Paiement from './Dashboard_Paiement';
import Dashbord_Message from './Dashbord_Message';
import Dashbord_WithDraw from './Dashbord_WithDraw';
import { getAllUserInfo } from '../api/users';
import useAuthStore from '../zustand/stores/authStore'
import { ClipLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query'; 

function Dashboard() {
  const [activeTab, setActiveTab] = useState("paiement");
  const token = useAuthStore(state => state.token);
  const {
   data: userData,
  } = useQuery({
  queryKey: ['userAll'], 
  queryFn: () => getAllUserInfo(token),  
  });
 
  return (
    <div className="w-full bg-bgColor min-h-screen p-6 sm:p-8 md:p-10">
    <Statistics data={userData}/>
    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    
    {/* Affichage conditionnel des composants */}
      {activeTab === "paiement" && <Dashboard_Paiement />}
      {activeTab === "retrait" && <Dashbord_WithDraw />}
      {activeTab === "messages" && <Dashbord_Message  />}

    </div>
  )
}

export default Dashboard