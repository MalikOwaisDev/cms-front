import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useUser } from "./hooks/useUser";
import {
  PatientsIcon,
  TrainingIcon,
  InvoicesIcon,
  TimeLogsIcon,
  WellnessIcon,
  AlertCircleIcon,
} from "./Icons";

const DashboardCard = ({ title, to, icon, description, colorClass }) => {
  return (
    <Link
      to={to}
      className="group block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-zinc-300 dark:hover:shadow-zinc-700 hover:shadow-lg hover:border-[#FE4982]/50 dark:hover:border-[#FE4982] border border-transparent dark:border-slate-700 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClass.bg}`}>
          <div className={colorClass.text}>{icon}</div>
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

// --- Main Dashboard Page ---
export default function Dashboard() {
  document.title = "Dashboard | Care Management System";
  const { data: user } = useUser(); // Using the custom hook to fetch user data
  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);

      // Optional: clear it after a few seconds
      const timer = setTimeout(() => {
        setError("");
        window.history.replaceState({}, document.title); // clears state
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Loading state
  if (!user && !error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />
        <div className="w-full h-[85vh] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Animated SVG Spinner */}
            <svg
              className="animate-spin h-10 w-10 text-[#FE4982]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            {/* Styled Loading Text */}
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardItems = [
    {
      title: "Patients",
      description: "Manage patient records",
      to: "/patients",
      icon: <PatientsIcon />,
      colorClass: {
        bg: "bg-sky-100 dark:bg-sky-900/50",
        text: "text-sky-600 dark:text-sky-400",
      },
    },
    {
      title: "Training",
      description: "Assign & track modules",
      to: "/trainings",
      icon: <TrainingIcon />,
      colorClass: {
        bg: "bg-purple-100 dark:bg-purple-900/50",
        text: "text-purple-600 dark:text-purple-400",
      },
    },
    {
      title: "Invoices",
      description: "Create & manage billing",
      to: "/invoices",
      icon: <InvoicesIcon />,
      colorClass: {
        bg: "bg-green-100 dark:bg-green-900/50",
        text: "text-green-600 dark:text-green-400",
      },
    },
    {
      title: "Time Logs",
      description: "Review caregiver hours",
      to: "/timelogs",
      icon: <TimeLogsIcon />,
      colorClass: {
        bg: "bg-orange-100 dark:bg-orange-900/50",
        text: "text-orange-600 dark:text-orange-400",
      },
    },
    {
      title: "Wellness",
      description: "Oversee wellness plans",
      to: "/wellness/plans",
      icon: <WellnessIcon />,
      colorClass: {
        bg: "bg-pink-100 dark:bg-pink-900/50",
        text: "text-pink-600 dark:text-pink-400",
      },
    },
  ];

  const filteredDashboardItems =
    user?.role === "admin"
      ? dashboardItems // Show all items for admin
      : dashboardItems.filter((item) => item.title !== "Invoices");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          // Error Display Block
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 text-red-800 dark:text-red-300 px-6 py-8 rounded-xl flex flex-col items-center text-center">
            <AlertCircleIcon className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold">An Error Occurred</h2>
            <p className="mt-1">{error}</p>
            <Link
              to="/login"
              className="mt-6 bg-[#FE4982] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#E03A6D] transition-all"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          // Main Dashboard Content
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="text-md text-slate-500 dark:text-slate-400 mt-1">
                Welcome back, {user?.name}! Here is your system overview.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDashboardItems.map((item) => (
                <DashboardCard key={item.title} {...item} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
