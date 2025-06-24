import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES ---
const mockTrainings = [
  {
    _id: "tr_1",
    title: "Patient Privacy & HIPAA",
    status: "completed",
    dateCompleted: "2025-06-20",
    caregiver: { name: "Alice Johnson" },
  },
  {
    _id: "tr_2",
    title: "Emergency Procedures",
    status: "completed",
    dateCompleted: "2025-06-18",
    caregiver: { name: "Bob Williams" },
  },
  {
    _id: "tr_3",
    title: "Medication Administration Basics",
    status: "pending",
    caregiver: { name: "Charlie Brown" },
  },
  {
    _id: "tr_4",
    title: "Advanced First Aid",
    status: "completed",
    dateCompleted: "2025-05-30",
    caregiver: { name: "Alice Johnson" },
  },
  {
    _id: "tr_5",
    title: "Infection Control Protocols",
    status: "completed",
    dateCompleted: "2025-05-15",
    caregiver: { name: "Charlie Brown" },
  },
];
const getTrainings = async (token) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { data: mockTrainings };
};

// --- ICONS ---
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
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
const ArchiveIcon = () => (
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
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

// --- Loading Skeleton ---
const ListSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    ))}
  </div>
);

// --- Training History Page ---
export default function TrainingHistory() {
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getTrainings(token)
      .then((res) => {
        const filtered = res.data.filter((t) => t.status === "completed");
        setCompletedTrainings(filtered);
      })
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
              Training History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              A log of all completed training modules by caregivers.
            </p>
          </div>
          <Link
            to="/trainings/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
          >
            <PlusIcon /> Create New Training
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-sm">
          {loading ? (
            <ListSkeleton />
          ) : completedTrainings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Training Module
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Caregiver
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">
                      Date Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedTrainings.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-slate-100 dark:border-slate-700/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-green-500 dark:text-green-400 flex-shrink-0">
                            <CheckCircleIcon />
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {t.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {t.caregiver.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-right">
                        {new Date(t.dateCompleted).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <ArchiveIcon className="mx-auto text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Completed Trainings
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Completed training records will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
