import { use } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading/Loading";

const DashboardHome = () => {
    const { user, loading } = use(AuthContext);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loading /></div>;
    }

    // Role-based redirection
    if (user?.data?.role === "admin") {
        return <Navigate to="/dashboard/platformStats" replace />;
    }

    // Default for everyone else (Chef, Customer, or if role is missing)
    return <Navigate to="/dashboard/myProfile" replace />;
};

export default DashboardHome;
