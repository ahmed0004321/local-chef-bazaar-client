import React, { use } from "react";
import { Link, Outlet, NavLink, useLocation } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading/Loading";
import { FaHome, FaUser, FaList, FaPlusCircle, FaUtensils, FaClipboardList, FaHeart, FaStar, FaBars, FaChartBar, FaUsers, FaTasks } from "react-icons/fa";

const DashboardLayout = () => {
  const { user, loading } = use(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
      ? "bg-primary text-white shadow-lg shadow-primary/20"
      : "text-foreground/70 hover:bg-surface hover:text-primary"
    }`;

  const SidebarContent = () => (
    <>
      <div className="px-6 py-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            LocalChef<span className="text-primary">Bazaar</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-1">
        <p className="px-4 text-xs font-bold text-foreground/40 uppercase tracking-wider mb-2 mt-4">Main Menu</p>

        <NavLink to="/" className={navLinkClass}>
          <FaHome /> Homepage
        </NavLink>
        <NavLink to="/dashboard/myProfile" className={navLinkClass} end>
          <FaUser /> My Profile
        </NavLink>

        {/* CHEF MENU */}
        {user?.data?.role === "chef" && (
          <>
            <p className="px-4 text-xs font-bold text-foreground/40 uppercase tracking-wider mb-2 mt-6">Chef Console</p>
            <NavLink to="/dashboard/createMeals" className={navLinkClass}>
              <FaPlusCircle /> Create Meal
            </NavLink>
            <NavLink to="/dashboard/myMeals" className={navLinkClass}>
              <FaUtensils /> My Meals
            </NavLink>
            <NavLink to="/dashboard/orderRequest" className={navLinkClass}>
              <FaClipboardList /> Order Requests
            </NavLink>
          </>
        )}

        {/* CUSTOMER MENU */}
        {user?.data?.role === "customer" && (
          <>
            <p className="px-4 text-xs font-bold text-foreground/40 uppercase tracking-wider mb-2 mt-6">Customer Zone</p>
            <NavLink to="/dashboard/myOrders" className={navLinkClass}>
              <FaList /> My Orders
            </NavLink>
            <NavLink to="/dashboard/myReviews" className={navLinkClass}>
              <FaStar /> My Reviews
            </NavLink>
            <NavLink to="/dashboard/favoriteMeals" className={navLinkClass}>
              <FaHeart /> Favorites
            </NavLink>
          </>
        )}

        {/* ADMIN MENU */}
        {user?.data?.role === "admin" && (
          <>
            <p className="px-4 text-xs font-bold text-foreground/40 uppercase tracking-wider mb-2 mt-6">Admin Console</p>
            <NavLink to="/dashboard/platformStats" className={navLinkClass}>
              <FaChartBar /> Platform Stats
            </NavLink>
            <NavLink to="/dashboard/manageUsers" className={navLinkClass}>
              <FaUsers /> Manage Users
            </NavLink>
            <NavLink to="/dashboard/manageRequests" className={navLinkClass}>
              <FaTasks /> Manage Requests
            </NavLink>
          </>
        )}
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-3 bg-surface/50 p-3 rounded-xl border border-neutral-200 dark:border-white/5">
          <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="" className="w-10 h-10 rounded-full" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.displayName}</p>
            <p className="text-xs text-foreground/50 truncate capitalize">{user?.data?.role || "Member"}</p>
          </div>
        </div>
      </div>
    </>
  );

  // Dynamic Title Logic
  const location = useLocation();

  React.useEffect(() => {
    const titles = {
      '/dashboard/myProfile': 'Local Chef Bazaar - My Profile',
      '/dashboard/myOrders': 'Local Chef Bazaar - My Orders',
      '/dashboard/myReviews': 'Local Chef Bazaar - My Reviews',
      '/dashboard/favoriteMeals': 'Local Chef Bazaar - Favorites',
      '/dashboard/createMeals': 'Local Chef Bazaar - Create Meal',
      '/dashboard/myMeals': 'Local Chef Bazaar - My Meals',
      '/dashboard/orderRequest': 'Local Chef Bazaar - Order Requests',
      '/dashboard/manageUsers': 'Local Chef Bazaar - Manage Users',
      '/dashboard/manageRequests': 'Local Chef Bazaar - Manage Requests',
      '/dashboard/platformStats': 'Local Chef Bazaar - Platform Stats',
    };
    const defaultTitle = 'Local Chef Bazaar - Dashboard';
    document.title = titles[location.pathname] || defaultTitle;
  }, [location]);

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-background text-foreground font-sans">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden navbar bg-surface/80 backdrop-blur border-b border-neutral-200 dark:border-white/10 sticky top-0 z-20">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">Dashboard</span>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden bg-neutral-50 dark:bg-black/20">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-30">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="w-72 min-h-full bg-surface border-r border-neutral-200 dark:border-white/5 flex flex-col">
          <SidebarContent />
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
