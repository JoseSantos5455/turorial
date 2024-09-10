import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../slices/auth.slice";

const AdminGuard = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (user?.roleId !== 1) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
