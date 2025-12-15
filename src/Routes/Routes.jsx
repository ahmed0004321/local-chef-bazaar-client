import { createBrowserRouter } from "react-router";
import RouteLayout from "../RouteLayout/RouteLayout";
import Home from "../Home/Home";
import Meals from "../Page/Meals/Meals";
import DashboardLayout from "../Dashboard/DashboardLayout/DashboardLayout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RouteLayout></RouteLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: '/meals',
                element: <Meals></Meals>
            },
            {
                path: '/dashboard',
                element: <DashboardLayout></DashboardLayout>
            }
        ]
    }
])