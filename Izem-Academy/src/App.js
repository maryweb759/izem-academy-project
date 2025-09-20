import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Withdraw from "./pages/Withdraw";
import Contact from "./pages/Contact";
import Landing from "./pages/Landing";
import Footer from "./components/footer"; // ⬅️ import Footer
import StudentDashboard from "./pages/studentDashboard";


import ChangePassword from "./pages/ChangePassword";
import TRC20Wallet from "./pages/TRC20Wallet";
import Payment from "./pages/Payment";
import WithdrawHistory from "./pages/withdrawHistory";
import Levels from "./pages/Levels";
import PaymentHistory from "./pages/PaymentHistory";
import MembershipList from "./pages/MembershipList";
import Account from "./pages/Account";
import Notification from "./pages/Notification";
import Dashboard from "./pages/Dashboard";
import ActivateAccount from "./pages/ActivateAccount";
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./PrivateRoute";
import { IntlProvider } from "react-intl";
import useLanguageStore from "./zustand/stores/languageStore";
import config from "./lang/config.json";

function App() {
  const { language, messages, dir } = useLanguageStore();

  return (
    <IntlProvider
      messages={messages[language]}
      locale={language}
      defaultLocale={config.defaultLanguage}
      onError={(err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Translation error:", err);
        }
      }}
    >
      <div dir={dir}>
        <Router>
          <Navbar /> 
          <Routes>
            {/* Route publique */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Landing />} />
             <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/:referral_code" element={<Register />} />

            <Route
              path="/reset-password/:tokenRestPassword"
              element={<ResetPassword />}
            />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/activate-account/:token"
              element={<ActivateAccount />}
            />


            {/* Routes protégées */}
            <Route element={<PrivateRoute />}>
<Route path="/student_dashboard/*" element={<StudentDashboard />} />
              <Route path="/withdraw/:rtc_wallet" element={<Withdraw />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/change_password" element={<ChangePassword />} />
              <Route path="/change_wallet" element={<TRC20Wallet />} />
              <Route path="/payment/:nom" element={<Payment />} />
              <Route path="/withdraw_history" element={<WithdrawHistory />} />
              <Route path="/payment_history" element={<PaymentHistory />} />
              <Route path="/levels" element={<Levels />} />
              <Route
                path="/membership_list/:referral_code"
                element={<MembershipList />}
              />
              <Route path="/account/:referral_code" element={<Account />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/dashboard" element={<Dashboard />} />

            </Route>
          </Routes>
           <Footer />
        </Router>
      </div>
    </IntlProvider>
  );
}

export default App;
