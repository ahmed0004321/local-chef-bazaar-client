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
              {/* Desktop User Info */}
              <div className="hidden md:flex flex-col items-end mr-1">
                <span className="text-sm font-semibold text-foreground">{user?.displayName || user?.data?.displayName || 'User'}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  {user?.data?.role || 'Member'}
                </span>
              </div>

              {/* Advanced Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar ring-2 ring-primary ring-offset-2 ring-offset-surface rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="w-9 rounded-full">
                    <img loading="lazy" src={user?.photoURL || user?.data?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="User" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content mt-3 z-50 p-2 shadow-2xl bg-surface/95 backdrop-blur-md rounded-2xl w-56 border border-white/10 animate-fade-in"
                >
                  <li className="px-4 py-3 border-b border-foreground/5 mb-2">
                    <p className="text-sm font-bold truncate">{user?.displayName || user?.data?.displayName}</p>
                    <p className="text-[10px] text-foreground/50 truncate uppercase tracking-widest">{user?.data?.role || 'Member'}</p>
                  </li>
                  <li>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/myProfile" className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                  </li>
                  <div className="divider my-1 opacity-10"></div>
                  <li>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-error/10 text-error rounded-xl transition-colors text-sm font-medium text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
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
