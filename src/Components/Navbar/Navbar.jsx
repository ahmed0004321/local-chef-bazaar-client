import { use } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { user, logOut } = use(AuthContext);
  console.log(user);

  const handleLogOut = () => {
    logOut()
      .then((result) => console.log(result?.user))
      .catch((err) => console.log(err));
  };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/meals">Meals</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    /* OUTER FIXED GLASS NAVBAR */
    <div className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-white/30">
      {/* INNER CONTAINER */}
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100/80 backdrop-blur-md rounded-box mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
           <Link to='/'><p className="btn btn-ghost text-xl">LocalChefBazaar</p></Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>

        <div className="navbar-end gap-2 flex items-center">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL} alt="User" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500 font-medium">Active</span>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
              </div>
              <button onClick={handleLogOut} className="btn btn-outline btn-sm">
                LogOut
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-medium">Inactive</span>
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
