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
import DashboardHome from "../Dashboard/DashboardHome/DashboardHome";

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
        path: "/mealDetails/:id",
        element: (
          <PrivateRoutes>
            <MealDetails></MealDetails>
          </PrivateRoutes>
        ),
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
        path: '/dashboard/myProfile',
        element: <MyProfile></MyProfile>
      },
      {
        path: '/dashboard/myOrders',
        element: <MyOrderPage></MyOrderPage>
      },
      {
        path: "/dashboard/myReviews",
        element: <MyReviewPage></MyReviewPage>
      },
      {
        path: "/dashboard/favoriteMeals",
        element: <FavMeals></FavMeals>
      },
      {
        path: "/dashboard/createMeals",
        element: <CreateMeal></CreateMeal>
      },
      {
        path: "/dashboard/myMeals",
        element: <MyMeals></MyMeals>
      },
      {
        path: "/dashboard/orderRequest",
        element: <OrderRequests></OrderRequests>
      },
      {
        path: "/dashboard/manageUsers",
        element: <ManageUsers></ManageUsers>
      },
      {
        path: "/dashboard/manageRequests",
        element: <ManageRequests></ManageRequests>
      },
      {
        path: "/dashboard/platformStats",
        element: <PlatformStats></PlatformStats>
      }
    ]
  },
]);
