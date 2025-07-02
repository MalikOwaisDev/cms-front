import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTimeLog } from "../services/timeLog";
import {
  UserIcon,
  BackIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
} from "../Icons";

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
  document.title = `${id} Time Log | Care Management System`;
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

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/timelogs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
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
                <EditIcon size={20} /> Description of Work
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
              onClick={() => navigate("/timelogs")}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Back
            </button>
            <Link
              to={`/timelogs/edit/${id}`} // Assumes an edit route exists
              className="bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-all"
            >
              <EditIcon size={20} /> Edit Log
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
