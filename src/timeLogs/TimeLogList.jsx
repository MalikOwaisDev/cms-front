import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const mockTimeLogs = [
  {
    _id: "tl_1",
    caregiver: { name: "Alice" },
    patient: { name: "Eleanor Vance" },
    date: "2025-06-23",
    startTime: "09:00",
    endTime: "11:30",
    duration: "2 hour(s), 30 minute(s)",
    description: "Assisted with morning routine and medication.",
  },
  {
    _id: "tl_2",
    caregiver: { name: "Bob" },
    patient: { name: "Johnathan Doe" },
    date: "2025-06-23",
    startTime: "10:00",
    endTime: "12:00",
    duration: "2 hour(s), 0 minute(s)",
    description: "Physical therapy session.",
  },
  {
    _id: "tl_3",
    caregiver: { name: "Alice" },
    patient: { name: "Marcus Rivera" },
    date: "2025-06-22",
    startTime: "14:00",
    endTime: "17:00",
    duration: "3 hour(s), 0 minute(s)",
    description: "Accompanied to doctor's appointment.",
  },
  {
    _id: "tl_4",
    caregiver: { name: "Charlie" },
    patient: { name: "Eleanor Vance" },
    date: "2025-06-22",
    startTime: "08:00",
    endTime: "10:00",
    duration: "2 hour(s), 0 minute(s)",
    description: "Meal preparation and light housekeeping.",
  },
];

const getTimeLogs = async (token) => {
  console.log(`Fetching time logs with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockTimeLogs };
};

// --- ICONS (Self-contained SVG components) ---
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

// --- Reusable Header/Footer ---
const Header = ({ user, onLogout }) => (
  <header className="bg-[#1D2056] text-white shadow-md print:hidden">
    <div className="container mx-auto flex items-center justify-between p-4">
      <Link to="/" className="text-xl font-bold tracking-wider">
        CarePulse
      </Link>
      <button
        onClick={onLogout}
        className="text-sm font-semibold hover:opacity-80"
      >
        Logout
      </button>
    </div>
  </header>
);
const Footer = () => (
  <footer className="bg-slate-100 text-center p-4 mt-auto print:hidden">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse
    </p>
  </footer>
);

// --- Loading Skeleton for Table ---
const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-16 bg-white rounded-lg p-4 flex items-center justify-between space-x-4"
      >
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="flex-1 h-4 bg-slate-200 rounded"></div>
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
    setLoading(true);
    getTimeLogs(token)
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Time Logs</h1>
            <p className="text-slate-600 mt-1">
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

        {/* Time Log List / Table */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Caregiver
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Patient
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Date
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Duration
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-100">
                      <td className="p-4 text-slate-800 font-semibold">
                        {log.caregiver?.name}
                      </td>
                      <td className="p-4 text-slate-600">
                        {log.patient?.name}
                      </td>
                      <td className="p-4 text-slate-600">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-600">{log.duration}</td>
                      <td className="p-4 text-slate-600 text-sm">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
