import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// --- Reusable SVG Icons --- (Code hidden for brevity)
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
    {" "}
    <circle cx="12" cy="12" r="5"></circle>{" "}
    <line x1="12" y1="1" x2="12" y2="3"></line>{" "}
    <line x1="12" y1="21" x2="12" y2="23"></line>{" "}
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>{" "}
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>{" "}
    <line x1="1" y1="12" x2="3" y2="12"></line>{" "}
    <line x1="21" y1="12" x2="23" y2="12"></line>{" "}
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>{" "}
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>{" "}
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
    {" "}
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>{" "}
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
    {" "}
    <line x1="3" y1="12" x2="21" y2="12"></line>{" "}
    <line x1="3" y1="6" x2="21" y2="6"></line>{" "}
    <line x1="3" y1="18" x2="21" y2="18"></line>{" "}
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
    {" "}
    <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
    <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
  </svg>
);

// --- Main Header Component ---
export default function Header() {
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const [image, setImage] = useState({});
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // State for theme (light/dark mode)
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );
  // Add state for active dropdown and mobile submenu
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState(null);

  // Effect to apply the theme class to the root <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
        setImage(res.data.avatar);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
      if (dropdownOpen && !e.target.closest(".relative")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, dropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/";
    navigate("/login");
    setUser({});
  };

  const buildMenuItems = (user) => [
    {
      name: "Patients",
      path: "/patients",
      subMenu: [
        { name: "All Patients", path: "/patients" },
        ...(user.role === "admin"
          ? [{ name: "Add New Patient", path: "/patients/new" }]
          : []),
      ],
    },
    {
      name: "Training",
      path: "/trainings",
      subMenu: [
        { name: "All Trainings", path: "/trainings" },
        ...(user.role === "admin"
          ? [{ name: "Create Training", path: "/trainings/create" }]
          : []),
        { name: "Training History", path: "/trainings/history" },
      ],
    },
    {
      name: "Invoices",
      path: "/invoices",
      subMenu: [
        { name: "View Invoices", path: "/invoices" },
        { name: "Create Invoice", path: "/invoices/create" },
      ],
    },
    {
      name: "Time Logs",
      path: "/timelogs",
      subMenu: [
        { name: "My Time Logs", path: "/timelogs" },
        { name: "New Time log", path: "/timelogs/log" },
      ],
    },
    {
      name: "Wellness",
      path: "/wellness/plans",
      subMenu: [
        { name: "Wellness Plans", path: "/wellness/plans" },
        { name: "New Care Plan", path: "/wellness/plans/create" },
        { name: "Resources", path: "/wellness/resources" },
      ],
    },
  ];

  const menuItems = buildMenuItems(user);

  const filteredMenuItems =
    user.role === "admin"
      ? menuItems
      : menuItems.filter((item) => item.name !== "Invoices");

  const activeLinkStyle = {
    color: "#FE4982",
    fontWeight: "600",
  };

  return (
    <header className="sticky bg-white dark:bg-[#1D2056] shadow-md top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center">
          <img
            src="/logo3.png"
            alt="MindfulTrust Logo Light"
            className="h-10 block dark:hidden"
          />
          <img
            src="/logo2.png"
            alt="MindfulTrust Logo Dark"
            className="h-10 hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center -mb-[10px] gap-6">
          {filteredMenuItems.map((item, index) => (
            <div
              key={item.name}
              className="relative pb-3" // <-- CHANGE HERE: Added padding to the bottom
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <NavLink
                to={item.path}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="text-slate-600 dark:text-slate-300 hover:text-[#FE4982] dark:hover:text-[#FE4982] transition-colors flex items-center gap-1"
              >
                {item.name}
                <svg
                  className={`w-4 h-4 transition-transform ease-out duration-100 ${
                    activeDropdown === index ? "-rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </NavLink>
              {/* Dropdown Menu */}
              {activeDropdown === index && (
                <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2A2D6E] rounded-md shadow-lg py-1 z-50 transition-all duration-300 transform-gpu opacity-100 scale-100">
                  {/* ^^-- CHANGE HERE: Removed mt-2  */}
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#FE4982] flex items-center justify-center font-bold text-white">
                {image ? (
                  <img
                    className="w-full h-full rounded-full"
                    src={image}
                    alt={user.name || "User Avatar"}
                  />
                ) : (
                  <span className="text-xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-[600] text-slate-700 dark:text-slate-100">
                {user.name || user.role}
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute sm:right-3 -right-5 mt-2 sm:w-32 w-28 bg-white dark:bg-[#1d2056] dark:text-white rounded-md shadow-lg py-1 z-50 text-slate-700">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button
              ref={toggleRef}
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
        <div
          ref={menuRef}
          className="absolute w-full pl-1 lg:hidden bg-white dark:bg-[#1D2056] border-t border-slate-200 dark:border-slate-700"
        >
          <nav className="flex flex-col p-4 space-y-1">
            {filteredMenuItems.map((item, index) => (
              <div key={item.name}>
                <div
                  onClick={() =>
                    activeMobileSubMenu === index
                      ? setActiveMobileSubMenu(null)
                      : setActiveMobileSubMenu(index)
                  }
                  className="flex items-center justify-between p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <NavLink to={item.path} onClick={(e) => e.stopPropagation()}>
                    {item.name}
                  </NavLink>
                  <svg
                    className={`w-5 h-5 transition-transform ease-out duration-300 ${
                      activeMobileSubMenu === index ? "-rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {activeMobileSubMenu === index && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.subMenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
