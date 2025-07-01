import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

// --- API Calls ---
const getTimeLogs = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/time-logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { data: res.data };
};

const getUser = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const deleteTimeLog = async (logId, token) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/time-logs/${logId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// --- SVG ICONS ---
const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ViewIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const DeleteIcon = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
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

// --- Components ---
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

// --- Main Page Component ---
export default function TimeLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getUser(token)
      .then((res) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });

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
            onClick={() => navigate(-1)}
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
          {/* Search and Sort Controls */}
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
                <ClockIcon />
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
