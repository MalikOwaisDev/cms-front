import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// --- Reusable SVG Icons for Cards ---
const PatientsIcon = () => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
    <path d="m2 3 2.5 2.5.5.5 2.5 2.5" />
    <path d="m14 2 6 6-4 4-6-6Z" />
    <path d="m10 14-1 1-2.5 2.5L2 22" />
    <path d="m18 6 4 4" />
    <path d="m20 10-1.5 1.5" />
  </svg>
);
const InvoicesIcon = () => (
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
  </svg>
);
const TimeLogsIcon = () => (
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

// --- Reusable Dashboard Card Component (Decent & Nice version) ---
const DashboardCard = ({ title, to, icon, description, colorClass }) => {
  return (
    <Link
      to={to}
      className="group block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg hover:border-[#FE4982]/50 dark:hover:border-[#FE4982] border border-transparent dark:border-slate-700 hover:-translate-y-1 transition-all duration-300"
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This logic authenticates the user. For this demo, we use mock data.
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUser({ name: "Admin" }); // Mock user data
  }, [navigate]);

  // Loading state
  if (!user) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>; // Shows a blank page while loading
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
      to: "/wellness",
      icon: <WellnessIcon />,
      colorClass: {
        bg: "bg-pink-100 dark:bg-pink-900/50",
        text: "text-pink-600 dark:text-pink-400",
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-md text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user.name}! Here is your system overview.
          </p>
        </div>

        {/* Responsive Grid for Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
