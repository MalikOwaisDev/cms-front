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

// --- RESPONSIVE Helper Component for a single line item ---
const ViewItem = ({ icon, label, children }) => (
  // Stacks vertically on mobile, row on larger screens
  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">
        {icon}
      </span>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </div>
    <div className="text-left sm:text-right text-slate-800 dark:text-slate-100 font-semibold pl-9 sm:pl-0">
      {children}
    </div>
  </div>
);

// --- RESPONSIVE Skeleton Loader ---
const ViewSkeleton = () => (
  <div className="max-w-2xl mx-auto animate-pulse">
    <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-8"></div>
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="py-5 flex justify-between items-center">
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
    <div className="mt-8 flex justify-end gap-4">
      <div className="h-11 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="h-11 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
    </div>
  </div>
);

// --- Time Log View Page Component ---
export default function TimeLogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLog, setTimeLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Set document title after fetching data
    if (timeLog) {
      document.title = `Log by ${
        timeLog.caregiver?.name || "Caregiver"
      } | Care Management System`;
    } else {
      document.title = `Time Log Details | Care Management System`;
    }
  }, [timeLog]);

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
        setError("Failed to fetch time log details. It may have been deleted.");
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

  // This now parses the text-based duration from the DB
  function formatDuration(duration) {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date(1970, 0, 1, hours, minutes); // Use a fixed date
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      // More reliable than checking state
      navigate(-1);
    } else {
      navigate("/timelogs");
    }
  };

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <ViewSkeleton />
        </main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 flex justify-center items-center text-center">
          <div>
            <p className="text-lg text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={handleGoBack}
              className="mt-6 bg-[#FE4982] text-white font-bold py-2.5 px-6 rounded-lg hover:bg-[#E03A6D]"
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* --- RESPONSIVE Header with clean alignment --- */}
          <div className="flex items-start gap-4 mb-8">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Time Log Details
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                A summary of work submitted by{" "}
                {timeLog.caregiver?.name || "Caregiver"}.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm">
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
                <span className="font-bold text-[#FE4982]">
                  {formatDuration(timeLog.duration) || "Not Calculated"}
                </span>
              </ViewItem>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                <EditIcon size={18} /> Description of Work
              </h3>
              <p className="text-slate-700 dark:text-slate-200 text-base whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {timeLog.description}
              </p>
            </div>

            <div className="mt-6 pt-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60">
              Log Submitted:{" "}
              {new Date(timeLog.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>

          {/* --- RESPONSIVE Action Buttons --- */}
          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full sm:w-auto flex justify-center items-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Back to List
            </button>
            <Link
              to={`/timelogs/edit/${id}`}
              className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-all"
            >
              <EditIcon size={18} /> Edit Log
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
