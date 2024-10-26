import { createBrowserRouter, Navigate } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import SecondLayout from "../layout/SecondLayout";
import AuthGuard from "./AuthGuard";
import AdminGuard from "./AdminGuard";
import ManagerGuard from "./ManagerGuard";
import PaymentCheck from "./PaymentCheck";



const Login = Loadable({ loader: () => import("../pages/login/Login") });
const ManageUser = Loadable({ loader: () => import("../pages/admin/ManageUser/ManageUser") });
const Detail = Loadable({ loader: () => import("../pages/admin/ManageUser/Detail/Detail") });
const ManageCourse = Loadable({ loader: () => import("../pages/admin/ManageCourse/ManageCourse") });
const Cost = Loadable({ loader: () => import("../pages/admin/Cost") });
const Quiz = Loadable({ loader: () => import("../pages/admin/Quiz") });
const Quizes = Loadable({ loader: () => import("../pages/leaningPage/Quizz") });
const Register = Loadable({ loader: () => import("../pages/register/Register") });
const Lotrinh = Loadable({ loader: () => import("../pages/lotrinh/Lotrinh") });
const Post = Loadable({ loader: () => import("../pages/post/Post") });
const Contact = Loadable({ loader: () => import("../pages/contact/Contact") });
const Package = Loadable({ loader: () => import("../pages/package/Package") });
const CourseDetail = Loadable({ loader: () => import("../pages/courseDetail/CourseDetai") });
const Law = Loadable({ loader: () => import("../pages/law/Law") });
const ErrorPage = Loadable({ loader: () => import("../pages/error/ErroePage") });
const learningPage = Loadable({ loader: () => import("../pages/leaningPage/LearningPage") });
const Success = Loadable({ loader: () => import("../pages/success/SuccessPage") });
const Fail = Loadable({ loader: () => import("../pages/fail/Fail") });
const Profile = Loadable({
  loader: () => import("../pages/profile/profile"),
});
const CreateCourse = Loadable({
  loader: () => import("../pages/admin/ManageCourse/CreateCourse"),
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
  { path: "/success", element: Success },
  { path: "/fail", element: Fail },
  {
    path: "/",
    element: <MainLayout showFooter={false} />,
    children: [

      { index: true, element: Home },
      { path: "/lotrinh", element: Lotrinh },
      { path: "/baiviet", element: Post },
      { path: "/quiz", element: Quizes },
      { path: "/tutorial/:tutorialId", element: CourseDetail },
      { path: "/lienhe", element: Contact },
      { path: "/combo", element: Package },
      { path: "/law", element: Law },
      {
        path: "/",
        element: <AuthGuard />,
        children: [

          {
            path: "/profile", element: Profile,
          },

          {
            path: "/learning/:courseId",
            element: <PaymentCheck />,
            children: [
              { path: "/learning/:courseId", element: learningPage },
            ]
          },
        ]
      },
    ],
  },
  {
    path: "/admin",
    element: <SecondLayout />,
    children: [
      {
        path: "/admin",
        element: <Navigate to="/" replace />,
      },
      {
        element: <AdminGuard />,
        children: [
          { index: true, element: Admin },
          { index: true, path: "dashboard", element: Admin },
          { path: "users", element: ManageUser },
          { path: "users/user-details/:userId", element: Detail },
          { path: "courses", element: ManageCourse },
          { path: "money", element: Cost },
          { path: "quizs", element: Quiz },
          { path: "create-course", element: CreateCourse },
        ],
      },
    ],
  },
  {
    path: "*",
    element: ErrorPage,
  },
]);

