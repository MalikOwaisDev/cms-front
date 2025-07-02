import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTimeLogs, deleteTimeLog } from "../services/timeLog";
import { useUser } from "../hooks/useUser";
import {
  PlusIcon,
  ClockIcon,
  ViewIcon,
  DeleteIcon,
  BackIcon,
  SortIcon,
} from "../Icons";

// --- RESPONSIVE SKELETON: Mimics the new card layout ---
const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="w-full sm:w-1/2 space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
          <div className="w-full sm:w-1/4 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
          <div className="w-full sm:w-auto flex justify-end gap-2">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
      <p className="text-slate-800 dark:text-slate-200 mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default function TimeLogList() {
  document.title = "Time Logs | Care Management System";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const { userQuery } = useUser();
  const { data: user } = userQuery;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getTimeLogs(token)
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleDelete = async (logId) => {
    try {
      await deleteTimeLog(logId, token);
      setLogs(logs.filter((log) => log.logID !== logId));
    } catch (error) {
      console.error("Failed to delete time log:", error);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const filteredAndSortedLogs = useMemo(() => {
    return logs
      .filter(
        (log) =>
          log.caregiver?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [logs, searchTerm, sortOrder]);

  function formatDuration(duration) {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- CORRECTED: Responsive Page Header with Back Button --- */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="flex-grow flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Time Logs
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {user?.role === "admin"
                  ? "Review all submitted work logs from caregivers."
                  : "View your submitted work logs."}
              </p>
            </div>
            <Link
              to="/timelogs/log"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
            >
              <PlusIcon /> Log New Time
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={
                user?.role === "admin"
                  ? "Search by Caregiver, Patient, or Description..."
                  : "Search by Patient or Description..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-[#FE4982] focus:outline-none"
            />
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-3 pr-10 appearance-none border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-[#FE4982] focus:outline-none"
              >
                <option value="desc">Sort: Newest First</option>
                <option value="asc">Sort: Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <SortIcon />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filteredAndSortedLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedLogs.map((log) => (
              <div
                key={log._id}
                className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-x-4 gap-y-3">
                  <div className="col-span-2 md:col-span-1">
                    <div className="font-bold text-slate-800 dark:text-slate-100">
                      {log.caregiver?.name || "N/A"}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      for {log.patient?.name || "N/A"}
                    </div>
                  </div>

                  <p className="col-span-2 md:col-span-2 text-sm text-slate-600 dark:text-slate-300">
                    {log.description}
                  </p>

                  <div className="col-span-2 sm:col-span-1 md:col-span-1 text-left">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#FE4982]">
                      {formatDuration(log.duration)}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 md:col-span-1 flex items-center justify-start sm:justify-end gap-2">
                    {/* CORRECTED: Navigation now uses log.logID */}
                    <Link
                      to={`/timelogs/${log.logID || log._id}`}
                      title="View or Edit Details"
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                      <ViewIcon />
                    </Link>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => setShowDeleteConfirm(log.logID)}
                        title="Delete Log"
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center flex flex-col py-16">
            <span className="mx-auto text-slate-400 dark:text-slate-500">
              <ClockIcon size={48} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
              No Time Logs Found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your search returned no results, or no logs have been submitted.
            </p>
          </div>
        )}
      </main>

      {showDeleteConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this time log? This action cannot be undone."
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}

      <Footer />
    </div>
  );
}
