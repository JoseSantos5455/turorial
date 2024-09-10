import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../slices/auth.slice";

const ManagerGuard = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (![1, 3].includes(user?.roleId)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ManagerGuard;
