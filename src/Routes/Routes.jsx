import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { SuspenseLoader } from "../Components/UI/SuspenseLoader";

import RouteLayout from "../RouteLayout/RouteLayout";
import DashboardLayout from "../Dashboard/DashboardLayout/DashboardLayout";
import PrivateRoutes from "./PrivateRoutes";
import Error404 from "../Components/Error404";

// Lazy loading all major pages
const Home = lazy(() => import("../Home/Home"));
const Meals = lazy(() => import("../Page/Meals/Meals"));
const Register = lazy(() => import("../Auth/Register"));
const Login = lazy(() => import("../Auth/Login"));
const MealDetails = lazy(() => import("../Page/MealDetails/MealDetails"));
const MyProfile = lazy(() => import("../Dashboard/MyProfile/MyProfile"));
const MyOrderPage = lazy(() => import("../Dashboard/MyOrderPage/MyOrderPage"));
const MyReviewPage = lazy(() => import("../Dashboard/MyReviewPage/MyReviewPage"));
const FavMeals = lazy(() => import("../Dashboard/FavMeals/FavMeals"));
const CreateMeal = lazy(() => import("../Dashboard/Chef/CreateMeal"));
const MyMeals = lazy(() => import("../Dashboard/Chef/MyMeals"));
const OrderRequests = lazy(() => import("../Dashboard/Chef/OrderRequests"));
const ManageUsers = lazy(() => import("../Dashboard/Admin/ManageUsers"));
const ManageRequests = lazy(() => import("../Dashboard/Admin/ManageRequests"));
const PlatformStats = lazy(() => import("../Dashboard/Admin/PlatformStats"));
const ManageBlogs = lazy(() => import("../Dashboard/Admin/ManageBlogs"));
const ManageComplaints = lazy(() => import("../Dashboard/Admin/ManageComplaints"));
const Settings = lazy(() => import("../Dashboard/Settings/Settings"));
const DashboardHome = lazy(() => import("../Dashboard/DashboardHome/DashboardHome"));
const PaymentSuccess = lazy(() => import("../Dashboard/MyOrderPage/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("../Dashboard/MyOrderPage/PaymentCancelled"));
const About = lazy(() => import("../Components/About/About"));
const FAQ = lazy(() => import("../Components/FAQ/FAQ"));
const Blog = lazy(() => import("../Components/Blog/Blog"));
const BlogDetails = lazy(() => import("../Components/Blog/BlogDetails"));

// Helper component to wrap lazy components
const Load = (Component) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout></RouteLayout>,
    children: [
      {
        index: true,
        element: Load(Home),
      },
      {
        path: "/meals",
        element: Load(Meals),
      },
      {
        path: '/about',
        element: Load(About)
      },
      {
        path: '/FAQ',
        element: Load(FAQ)
      },
      {
        path: '/blog',
        element: Load(Blog)
      },
      {
        path: '/blog/:id',
        element: Load(BlogDetails)
      },
      {
        path: "/mealDetails/:id",
        element: Load(MealDetails),
      },
      {
        path: "/payment-success",
        element: Load(PaymentSuccess)
      },
      {
        path: "/payment-cancel",
        element: Load(PaymentCancelled)
      },
    ],
  },
  {
    path: "/register",
    element: Load(Register),
  },
  {
    path: "/login",
    element: Load(Login),
  },
  {
    path: '*',
    element: <Error404></Error404>
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: Load(DashboardHome)
      },
      {
        path: 'myProfile',
        element: Load(MyProfile)
      },
      {
        path: 'myOrders',
        element: Load(MyOrderPage)
      },
      {
        path: "myReviews",
        element: Load(MyReviewPage)
      },
      {
        path: "favoriteMeals",
        element: Load(FavMeals)
      },
      {
        path: "createMeals",
        element: Load(CreateMeal)
      },
      {
        path: "myMeals",
        element: Load(MyMeals)
      },
      {
        path: "orderRequest",
        element: Load(OrderRequests)
      },
      {
        path: "manageUsers",
        element: Load(ManageUsers)
      },
      {
        path: "manageRequests",
        element: Load(ManageRequests)
      },
      {
        path: "platformStats",
        element: Load(PlatformStats)
      },
      {
        path: "manageBlogs",
        element: Load(ManageBlogs)
      },
      {
        path: "manageComplaints",
        element: Load(ManageComplaints)
      },
      {
        path: "settings",
        element: Load(Settings)
      }
    ]
  },
]);
