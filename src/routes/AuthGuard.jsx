import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser } from "../slices/auth.slice";
import { showLoginModal } from "../slices/modal.slice";

const AuthGuard = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch();

  if (!token) {
    dispatch(showLoginModal());
    return null;
  }
 

  return <Outlet />;
};

export default AuthGuard;
