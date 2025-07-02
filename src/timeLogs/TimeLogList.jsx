import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTimeLogs, deleteTimeLog } from "../services/timeLog";
import { useUser } from "../hooks/useUser";
import { PlusIcon, ClockIcon, ViewIcon, DeleteIcon, BackIcon } from "../Icons";

const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between space-x-4"
      >
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="w-1/6 h-4 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block"></div>
      </div>
    ))}
  </div>
);

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl">
      <p className="text-slate-800 dark:text-slate-200 mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
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
  const { data: user } = useUser(); // Using the custom hook to fetch user data
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
      setLogs(logs.filter((log) => log._id !== logId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete time log:", error);
    } finally {
      setLoading(false);
      getTimeLogs(token)
        .then((res) => setLogs(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  function formatDuration(duration) {
    const hours = Math.floor(duration);

    const minutes = Math.round((duration - hours) * 60);

    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  const filteredAndSortedLogs = useMemo(() => {
    return logs
      .filter(
        (log) =>
          log.caregiver?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [logs, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Time Logs
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {user && user.role === "admin"
                  ? "Review all submitted work logs from caregivers."
                  : "View your submitted work logs."}
              </p>
            </div>
            <Link
              to="/timelogs/log"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
            >
              <PlusIcon /> Log New Time
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="relative flex flex-col md:flex-row gap-4 mb-6 ">
            <input
              type="text"
              placeholder={
                user && user.role === "admin"
                  ? "Search by Caregiver or Patient"
                  : "Search by Patient"
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 pr-8 border appearance-none border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            >
              <option value="desc">Sort by Date (Newest First)</option>
              <option value="asc">Sort by Date (Oldest First)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0  right-2 flex items-center text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : filteredAndSortedLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Caregiver
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Patient
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Date
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Duration
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Description
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-slate-100 dark:border-slate-700/50"
                    >
                      <td className="p-4 text-slate-700 dark:text-slate-200 font-semibold">
                        {log.caregiver?.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {log.patient?.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-mono hidden sm:table-cell">
                        {formatDuration(log.duration)}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                        {log.description}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/timelogs/${log.logID}`)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                          >
                            <span className="text-slate-600 dark:text-slate-300">
                              <ViewIcon />
                            </span>
                          </button>
                          {user && user.role === "admin" && (
                            <button
                              onClick={() => setShowDeleteConfirm(log.logID)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full text-red-500"
                            >
                              <DeleteIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Get started by logging a new time entry.
              </p>
            </div>
          )}
        </div>
      </main>

      {showDeleteConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this time log?"
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}

      <Footer />
    </div>
  );
}
