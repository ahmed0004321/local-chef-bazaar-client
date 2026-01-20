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
import ManageOrders from "../Dashboard/Chef/OrderRequests";
import OrderRequests from "../Dashboard/Chef/OrderRequests";
import ManageUser from "../Dashboard/Admin/ManageUser";
import ManageRequest from "../Dashboard/Admin/ManageRequest";
import PlatformStatistic from "../Dashboard/Admin/PlatformStatistic";

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
        path: '/dashboard/myProfile',
        element: <PrivateRoutes>
          <MyProfile></MyProfile>
        </PrivateRoutes>
      },
      {
        path: '/dashboard/myOrders',
        element: <PrivateRoutes>
          <MyOrderPage></MyOrderPage>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/myReviews",
        element: <PrivateRoutes>
          <MyReviewPage></MyReviewPage>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/favoriteMeals",
        element: <PrivateRoutes>
           <FavMeals></FavMeals>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/createMeals",
        element: <PrivateRoutes>
          <CreateMeal></CreateMeal>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/myMeals",
        element: <PrivateRoutes>
          <MyMeals></MyMeals>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/orderRequest",
        element: <PrivateRoutes>
          <OrderRequests></OrderRequests>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/manageUser",
        element: <PrivateRoutes>
          <ManageUser></ManageUser>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/manageRequest",
        element: <PrivateRoutes>
          <ManageRequest></ManageRequest>
        </PrivateRoutes>
      },
      {
        path: "/dashboard/platformStatistic",
        element: <PrivateRoutes>
          <PlatformStatistic></PlatformStatistic>
        </PrivateRoutes>
      }
    ]
  },
]);
