import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES ---
const mockTimeLogs = [
  {
    _id: "tl_1",
    caregiver: { name: "Alice" },
    patient: { name: "Eleanor Vance" },
    date: "2025-06-23",
    startTime: "09:00",
    endTime: "11:30",
    duration: "2h 30m",
    description: "Assisted with morning routine and medication.",
  },
  {
    _id: "tl_2",
    caregiver: { name: "Bob" },
    patient: { name: "Johnathan Doe" },
    date: "2025-06-23",
    startTime: "10:00",
    endTime: "12:00",
    duration: "2h 0m",
    description: "Physical therapy session.",
  },
  {
    _id: "tl_3",
    caregiver: { name: "Alice" },
    patient: { name: "Marcus Rivera" },
    date: "2025-06-22",
    startTime: "14:00",
    endTime: "17:00",
    duration: "3h 0m",
    description: "Accompanied to doctor's appointment.",
  },
  {
    _id: "tl_4",
    caregiver: { name: "Charlie" },
    patient: { name: "Eleanor Vance" },
    date: "2025-06-22",
    startTime: "08:00",
    endTime: "10:00",
    duration: "2h 0m",
    description: "Meal preparation and light housekeeping.",
  },
];

const getTimeLogs = async (token) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { data: mockTimeLogs };
};

// --- PAGE ICONS ---
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
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// --- Loading Skeleton for Table ---
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

// --- Time Log List Page Component ---
export default function TimeLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Time Logs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Review all submitted work logs from caregivers.
            </p>
          </div>
          <Link
            to="/timelogs/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
          >
            <PlusIcon /> Log New Time
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : logs.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
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
                        {log.duration}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <ClockIcon className="mx-auto text-slate-400 dark:text-slate-500" />
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

      <Footer />
    </div>
  );
}
