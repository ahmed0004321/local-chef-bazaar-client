import React, { use } from "react";
import { Link, Outlet } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

const DashboardLayout = () => {
  const { user } = use(AuthContext);
  console.log(user?.data?.role);
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar sticky top-0 z-20 bg-transparent backdrop-blur-md border-b border-neutral-700/40">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost hover:bg-neutral-800/40"
            >
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
          <div className="rounded-xl bg-transparent backdrop-blur-md border border-neutral-700/40 p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-transparent backdrop-blur-md border-r border-neutral-700/40">
          <div className="px-6 py-5 border-b border-neutral-700/40">
            <h2 className="text-sm font-medium text-neutral-200">
              LocalChefBazaar
            </h2>
          </div>

          {/* Menu */}
          <div className="px-4 py-6">
            <h3 className="px-3 text-xs uppercase tracking-wide text-neutral-400 mb-3">
              Main Menu
            </h3>

            <ul className="space-y-1">
              {/* Homepage always at top */}
              <li>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                >
                  Homepage
                </Link>
              </li>

              {/* Only for CHEF */}
              {user?.data?.role === "chef" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/createMeals"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      Create Meals
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/myMeals"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      My Meals
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/manageOrders"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      Manage Orders
                    </Link>
                  </li>
                </>
              )}

              {/* My Profile visible to all */}
              <li>
                <Link
                  to="/dashboard/myProfile"
                  className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                >
                  My Profile
                </Link>
              </li>

              {/* Only for CUSTOMER */}
              {user?.data?.role === "customer" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/myOrders"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      My Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/myReviews"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      My Reviews
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/favoriteMeals"
                      className="flex items-center px-4 py-2.5 rounded-md text-neutral-300 hover:bg-neutral-800/40"
                    >
                      Favorite Meals
                    </Link>
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
