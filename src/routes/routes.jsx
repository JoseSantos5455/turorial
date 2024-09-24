import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import SecondLayout from "../layout/SecondLayout";
import AuthGuard from "./AuthGuard";
import AdminGuard from "./AdminGuard";
import ManagerGuard from "./ManagerGuard";



const Login = Loadable({ loader: () => import("../pages/login/Login") });
const ManageUser = Loadable({ loader: () => import("../pages/admin/ManageUser/ManageUser") });
const Detail = Loadable({ loader: () => import("../pages/admin/ManageUser/Detail/Detail") });
const ManageCourse = Loadable({ loader: () => import("../pages/admin/ManageCourse") });
const Cost = Loadable({ loader: () => import("../pages/admin/Cost") });
const Quiz = Loadable({ loader: () => import("../pages/admin/Quiz") });
const Register = Loadable({ loader: () => import("../pages/register/Register") });
const Lotrinh = Loadable({ loader: () => import("../pages/lotrinh/Lotrinh") });
const Post = Loadable({ loader: () => import("../pages/post/Post") });
const Contact = Loadable({ loader: () => import("../pages/contact/Contact") });
const CourseDetail = Loadable({ loader: () => import("../pages/courseDetail/CourseDetai") });
const Law = Loadable({ loader: () => import("../pages/law/Law") });
const ErrorPage = Loadable({ loader: () => import("../pages/error/ErroePage") });
const learningPage = Loadable({ loader: () => import("../pages/leaningPage/LearningPage") });
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
        path: "/tutorial/:tutorialId",
        element: CourseDetail,
      },
      {
        path: "/learning/:courseId",
        element: learningPage,
      },
      {
        path: "/lienhe",
        element: Contact,
      },
      {
        path: "/law",
        element: Law,
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
            element: Profile,

          },
        ],
      },

    ],
  },
  {
    path: "/",
    element: <SecondLayout showFooter={false} />,
    children: [
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
        path: "users",
        children: [
          {
            index: true,
            element: ManageUser,
          },
          {
            path: "user-details/:userId",
            element: Detail,
          }
        ]
      },
      {
        path: "/videos",
        element: ManageCourse,
      },
      {
        path: "/money",
        element: Cost,
      },
      {
        path: "/quizs",
        element: Quiz,
      },
      {
        path: "/money",
        element: Cost,
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
    element: ErrorPage,
  },
]);
