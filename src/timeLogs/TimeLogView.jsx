import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

// --- ICONS (Unchanged) ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
const BackIcon = () => (
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
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// --- API Call (Unchanged) ---
const getTimeLog = async (id, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/time-logs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data };
};

// --- Helper Component for a single line item in the view ---
const ViewItem = ({ icon, label, children }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-3">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </div>
    <div className="text-right text-slate-800 dark:text-slate-100 font-semibold">
      {children}
    </div>
  </div>
);

// --- Time Log View Page Component (Redesigned) ---
export default function TimeLogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLog, setTimeLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchTimeLog = async () => {
      try {
        const res = await getTimeLog(id, token);
        setTimeLog(res.data);
      } catch (err) {
        setError(
          "Failed to fetch time log details. It may not exist or you may not have permission to view it."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLog();
  }, [id, token, navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  function formatDuration(duration) {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- Loading and Error states (Unchanged) ---
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 -mt-7 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Time Log Details
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                A summary of work submitted by{" "}
                {timeLog.caregiver?.name || "Caregiver"}.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm">
            {/* --- Main Details List --- */}
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              <ViewItem icon={<UserIcon />} label="Caregiver">
                {timeLog.caregiver?.name || "Not Assigned"}
              </ViewItem>
              <ViewItem icon={<UserIcon />} label="Patient">
                {timeLog.patient?.name || "N/A"}
              </ViewItem>
              <ViewItem icon={<CalendarIcon />} label="Work Date">
                {formatDate(timeLog.date)}
              </ViewItem>
              <ViewItem icon={<ClockIcon />} label="Start Time">
                {formatTime(timeLog.startTime)}
              </ViewItem>
              <ViewItem icon={<ClockIcon />} label="End Time">
                {formatTime(timeLog.endTime)}
              </ViewItem>
              <ViewItem icon={<ClockIcon />} label="Total Duration">
                <span className="text-[#FE4982]">
                  {formatDuration(timeLog.duration) || "Not Calculated"}
                </span>
              </ViewItem>
            </div>

            {/* --- Description Section --- */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                <EditIcon /> Description of Work
              </h3>
              <p className="text-slate-700 dark:text-slate-200 text-base whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {timeLog.description}
              </p>
            </div>

            {/* --- Metadata Footer --- */}
            <div className="mt-6 pt-4 text-center text-xs text-slate-400 dark:text-slate-500">
              Log Submitted: {new Date(timeLog.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="mt-8 flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Back
            </button>
            <Link
              to={`/timelogs/edit/${id}`} // Assumes an edit route exists
              className="bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-all"
            >
              <EditIcon /> Edit Log
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
