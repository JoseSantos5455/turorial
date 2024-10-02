import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser } from "../slices/auth.slice";
import { showLoginModal } from "../slices/modal.slice"; 

const AdminGuard = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // If no token, redirect to login
  if (!token) {
    dispatch(showLoginModal());
  }

  // Check if user roles exist and user is admin
  if (!user?.roles || user.roles[0] !== "ROLE_ADMIN") {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
