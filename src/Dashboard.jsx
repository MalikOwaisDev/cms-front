import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// --- ICONS (Self-contained SVG components) ---
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const TrainingIcon = () => (
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
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 5 4 5 6 0v-5"></path>
  </svg>
);
const InvoiceIcon = () => (
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
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);
const TimeLogIcon = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const WellnessIcon = () => (
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
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// --- Header Component ---
const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-[#1D2056] text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold tracking-wider">
          MindfulTrst Care & Services
        </h1>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#FE4982] flex items-center justify-center font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="hidden sm:inline font-semibold">
              {user.name || user.role}
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-slate-700">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-slate-100"
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left block px-4 py-2 text-sm hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Dashboard Card Component ---
const DashboardCard = ({ title, to, icon, color }) => {
  return (
    <Link
      to={to}
      className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="text-slate-400 group-hover:text-[#FE4982] transition-colors">
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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
};

// --- Footer Component ---
const Footer = () => (
  <footer className="bg-slate-100 text-center p-4 mt-auto">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse Management System. All Rights
      Reserved.
    </p>
  </footer>
);

// --- Main Dashboard Page ---
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserData = async (token) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    setUser(res.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getUserData(token);
    // try {
    //   const decoded = jwtDecode(token);
    //   console.log(user);
    // } catch (err) {
    //   console.error("Invalid token", err);
    //   localStorage.removeItem("token");
    //   navigate("/login");
    // }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    // You can return a full-page loader here if you have one
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  const dashboardItems = [
    {
      title: "Patients",
      to: "/patients",
      icon: <UserIcon />,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: "Training",
      to: "/trainings",
      icon: <TrainingIcon />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Invoices",
      to: "/invoices",
      icon: <InvoiceIcon />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Time Logs",
      to: "/timelogs",
      icon: <TimeLogIcon />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Wellness",
      to: "/wellness/plans",
      icon: <WellnessIcon />,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {user.name}!
          </h1>
          <p className="text-slate-600 mt-1">
            Here's a quick overview of your system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
