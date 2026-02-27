import { use, useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { Button, Container } from "../UI";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const { user, logOut } = use(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = () => {
    logOut()
      .then((result) => console.log(result?.user))
      .catch((err) => console.log(err));
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
      ? "text-primary bg-primary/10"
      : "text-foreground/80 hover:text-primary hover:bg-neutral-100 dark:hover:bg-white/5"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/meals" className={navLinkClass}>Meals</NavLink>
      </li>
      <li>
        <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navLinkClass}>About</NavLink>
      </li>
      <li>
        <NavLink to="/FAQ" className={navLinkClass}>FAQ</NavLink>
      </li>
      {user && (<>
        <li>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/myProfile" className={navLinkClass}>Profile</NavLink>
        </li>
      </>
      )}
    </>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "glass border-b border-white/20 dark:border-white/10 py-2"
        : "bg-transparent py-4"
        }`}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Menu"
            >
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
              className="menu menu-sm dropdown-content mt-3 p-2 shadow-xl bg-surface/90 backdrop-blur-md rounded-box w-52 border border-white/10"
            >
              <li>
                <div className="flex items-center justify-between px-4 py-2 mb-2 lg:hidden">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </li>
              <div className="divider my-0 lg:hidden"></div>
              {links}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              LocalChef<span className="text-primary">Bazaar</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1">{links}</ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block mr-1">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-1">
                <span className="text-sm font-semibold">{user?.data?.displayName || 'User'}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  {user?.data?.role || 'Member'}
                </span>
              </div>
              <div className="avatar ring-2 ring-primary ring-offset-2 ring-offset-surface rounded-full transition-transform hover:scale-105 cursor-pointer">
                <div className="w-9 rounded-full">
                  <img src={user?.data?.photoURL || user?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="User" />
                </div>
              </div>
              <Button onClick={handleLogOut} variant="outline" size="sm" className="hidden sm:inline-flex">
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log In
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
