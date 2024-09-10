import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import AuthGuard from "./AuthGuard";
import AdminGuard from "./AdminGuard";
import ManagerGuard from "./ManagerGuard";


const Login = Loadable({ loader: () => import("../pages/login/Login") });
const Register = Loadable({ loader: () => import("../pages/register/Register") });
const Lotrinh = Loadable({ loader: () => import("../pages/lotrinh/Lotrinh") });
const Post = Loadable({ loader: () => import("../pages/post/Post") });
const Profile = Loadable({
  loader: () => import("../pages/profile/profile"),
});
// const Home = Loadable({ loader: () => import("../pages/home/Home") });
const Home = Loadable({
  loader: () => import("../pages/dashboard/Dashboard"),
});
const Admin = Loadable({
  loader: () => import("../pages/admin/Admin"),
});
// const ManageProducts = Loadable({
//   loader: () => import("../pages/manage/ManageProducts"),
// });

export const router = createBrowserRouter([
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/register",
    element: Register,
  },

  {
    path: "/",
    element: <MainLayout showFooter={false} />, 
    children: [
      {
        index: true, 
        element: Home,
      },
      {
        path: "/lotrinh",
        element: Lotrinh,
      },
      {
        path: "/baiviet",
        element: Post,
      },
      {
        path: "/",
        element: <AuthGuard />, 
        children: [
          {
            index: true,
            element: Home,
          },
          {
            path: "profile",
            element:Profile, 
           
          },
        ],
      },
      {
        path: "admin",
        element: <AuthGuard />, 
        children: [
          {
            index: false,
            element: <AdminGuard />, 
            children: [
              {
                index: true,
                element: Admin,
              },
            ],
          },
        ],
      },
      {
        path: "manage-products",
        element: <AuthGuard />, 
        children: [
          {
            index: false,
            element: <ManagerGuard />, 
            children: [
              {
                index: true,
                element: Admin,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>ERROR</div>,
  },
]);
