import React, { use } from "react";
import { NavLink, Outlet } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { user, loading } = use(AuthContext);

  // --- ACTIVE TOGGLE DESIGN LOGIC ---
  const navLinkStyles = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-2" // Active State
        : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200" // Inactive State
    }`;

  const handleDisabledButton = () => {
    Swal.fire({
      title: "sorry!",
      text: "You are Fraud. You can't Create any meal at all!.",
      icon: "error",
      confirmButtonText: "OK",
      background: "#1f2937",
      color: "#ffffff",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col">
        <nav className="navbar sticky top-0 z-20 backdrop-blur-md border-b border-neutral-800">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-4">
            <h1 className="text-lg font-medium text-neutral-200">Dashboard</h1>
          </div>
        </nav>

        <main className="p-6">
          <div className="rounded-2xl border border-neutral-800 p-6 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-[#161926] border-r border-neutral-800">
          <div className="px-6 py-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              LocalChefBazaar
            </h2>
          </div>

          <div className="px-4">
            <h3 className="px-4 text-[10px] uppercase tracking-[2px] text-neutral-500 mb-4 font-bold">
              Main Menu
            </h3>

            <ul className="space-y-2">
              <li>
                <NavLink to="/" end className={navLinkStyles}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-0 group-[.active]:opacity-100 transition-opacity" />
                  Homepage
                </NavLink>
              </li>

              {/* CHEF Section */}
              {user?.data?.role === "chef" && (
                <>
                  {user?.data?.status !== "fraud" ? (
                    <NavLink
                      to="/dashboard/createMeals"
                      className={navLinkStyles}
                    >
                      Create Meals
                    </NavLink>
                  ) : (
                    /* Fraud State: Shows the style but blocks navigation and triggers Swal */
                    <div
                      onClick={handleDisabledButton}
                      className={`${navLinkStyles} opacity-50 cursor-not-allowed`}
                    >
                      Create Meals
                    </div>
                  )}
                  <li>
                    <NavLink to="/dashboard/myMeals" className={navLinkStyles}>
                      My Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/orderRequest"
                      className={navLinkStyles}
                    >
                      Order Requests
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink to="/dashboard/myProfile" className={navLinkStyles}>
                  My Profile
                </NavLink>
              </li>

              {/* CUSTOMER Section */}
              {user?.data?.role === "customer" && (
                <>
                  <li>
                    <NavLink to="/dashboard/myOrders" className={navLinkStyles}>
                      My Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/myReviews"
                      className={navLinkStyles}
                    >
                      My Reviews
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/favoriteMeals"
                      className={navLinkStyles}
                    >
                      Favorite Meals
                    </NavLink>
                  </li>
                </>
              )}

              {/* ADMIN Section */}
              {user?.data?.role === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/manageUser"
                      className={navLinkStyles}
                    >
                      Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manageRequest"
                      className={navLinkStyles}
                    >
                      Manage Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/platformStatistic"
                      className={navLinkStyles}
                    >
                      Platform Statistics
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
