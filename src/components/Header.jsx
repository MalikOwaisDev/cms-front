import axios from "axios";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// --- Reusable SVG Icons ---
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Main Header Component ---
export default function Header() {
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});

  // State for theme (light/dark mode)
  // It checks localStorage first, then system preference
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  // Effect to apply the theme class to the root <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Save the user's preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        // const decoded = jwtDecode(token);

        // Wait for the API response
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/";
    navigate("/login");
    setUser({});
  };

  const menuItems = [
    { name: "Patients", path: "/patients" },
    { name: "Training", path: "/trainings" },
    { name: "Invoices", path: "/invoices" },
    { name: "Time Logs", path: "/timelogs" },
    { name: "Wellness", path: "/wellness" },
  ];

  // Style for active NavLink
  const activeLinkStyle = {
    color: "#FE4982",
    fontWeight: "600",
  };

  return (
    // The header is sticky, has a z-index to stay on top, and has background colors for both light and dark modes.
    <header className="bg-white dark:bg-[#1D2056] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          {/* Light Mode Logo */}
          <img
            src="/logo3.png"
            alt="MindfulTrust Logo Light"
            className="h-10 block dark:hidden"
          />

          {/* Dark Mode Logo */}
          <img
            src="/logo2.png"
            alt="MindfulTrust Logo Dark"
            className="h-10 hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="text-slate-600 dark:text-slate-300 hover:text-[#FE4982] dark:hover:text-[#FE4982] transition-colors"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* User Avatar & Logout (Example) */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#FE4982] flex items-center justify-center font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="hidden sm:inline font-[600] text-black dark:text-white">
                {user.name || user.role}
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute sm:right-3 -right-5  mt-2 sm:w-32 w-28 bg-white rounded-md shadow-lg py-1 z-50 text-slate-700">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#1D2056] border-t border-slate-200 dark:border-slate-700">
          <nav className="flex flex-col p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                onClick={() => setIsMenuOpen(false)} // Close menu on click
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
