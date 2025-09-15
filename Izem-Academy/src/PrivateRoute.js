import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./zustand/stores/authStore";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
