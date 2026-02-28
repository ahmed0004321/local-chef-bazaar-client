import { createBrowserRouter } from "react-router";
import RouteLayout from "../RouteLayout/RouteLayout";
import Home from "../Home/Home";
import Meals from "../Page/Meals/Meals";
import DashboardLayout from "../Dashboard/DashboardLayout/DashboardLayout";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import PrivateRoutes from "./PrivateRoutes";
import MealDetails from "../Page/MealDetails/MealDetails";
import MyProfile from "../Dashboard/MyProfile/MyProfile";
import MyOrderPage from "../Dashboard/MyOrderPage/MyOrderPage";
import MyReviewPage from "../Dashboard/MyReviewPage/MyReviewPage";
import FavMeals from "../Dashboard/FavMeals/FavMeals";
import CreateMeal from "../Dashboard/Chef/CreateMeal";
import MyMeals from "../Dashboard/Chef/MyMeals";
import OrderRequests from "../Dashboard/Chef/OrderRequests";
import ManageUsers from "../Dashboard/Admin/ManageUsers";
import ManageRequests from "../Dashboard/Admin/ManageRequests";
import PlatformStats from "../Dashboard/Admin/PlatformStats";
import ManageBlogs from "../Dashboard/Admin/ManageBlogs";
import ManageComplaints from "../Dashboard/Admin/ManageComplaints";
import Settings from "../Dashboard/Settings/Settings";
import DashboardHome from "../Dashboard/DashboardHome/DashboardHome";

import PaymentSuccess from "../Dashboard/MyOrderPage/PaymentSuccess";
import PaymentCancelled from "../Dashboard/MyOrderPage/PaymentCancelled";
import Error404 from "../Components/Error404";
import About from "../Components/About/About";
import FAQ from "../Components/FAQ/FAQ";
import Blog from "../Components/Blog/Blog";
import BlogDetails from "../Components/Blog/BlogDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout></RouteLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/meals",
        element: <Meals></Meals>,
      },
      {
        path: '/about',
        element: <About></About>
      },
      {
        path: '/FAQ',
        element: <FAQ></FAQ>
      },
      {
        path: '/blog',
        element: <Blog></Blog>
      },
      {
        path: '/blog/:id',
        element: <BlogDetails></BlogDetails>
      },
      {
        path: "/mealDetails/:id",
        element: (
          <MealDetails></MealDetails>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />
      },
      {
        path: "/payment-cancel",
        element: <PaymentCancelled />
      },
    ],
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
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
        element: <DashboardHome />
      },
      {
        path: 'myProfile',
        element: <MyProfile></MyProfile>
      },
      {
        path: 'myOrders',
        element: <MyOrderPage></MyOrderPage>
      },
      {
        path: "myReviews",
        element: <MyReviewPage></MyReviewPage>
      },
      {
        path: "favoriteMeals",
        element: <FavMeals></FavMeals>
      },
      {
        path: "createMeals",
        element: <CreateMeal></CreateMeal>
      },
      {
        path: "myMeals",
        element: <MyMeals></MyMeals>
      },
      {
        path: "orderRequest",
        element: <OrderRequests></OrderRequests>
      },
      {
        path: "manageUsers",
        element: <ManageUsers></ManageUsers>
      },
      {
        path: "manageRequests",
        element: <ManageRequests></ManageRequests>
      },
      {
        path: "platformStats",
        element: <PlatformStats></PlatformStats>
      },
      {
        path: "manageBlogs",
        element: <ManageBlogs></ManageBlogs>
      },
      {
        path: "manageComplaints",
        element: <ManageComplaints></ManageComplaints>
      },
      {
        path: "settings",
        element: <Settings></Settings>
      }
    ]
  },
]);
