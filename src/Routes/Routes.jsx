import { createBrowserRouter } from "react-router";
import RouteLayout from "../RouteLayout/RouteLayout";
import Home from "../Home/Home";
import Meals from "../Page/Meals/Meals";
import DashboardLayout from "../Dashboard/DashboardLayout/DashboardLayout";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import PrivateRoutes from "./PrivateRoutes";
import MealDetails from "../Page/MealDetails/MealDetails";

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
      {
        path: "/dashboard",
        element: (
          <PrivateRoutes>
            <DashboardLayout></DashboardLayout>
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
]);
