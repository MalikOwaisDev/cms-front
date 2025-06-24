import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES (for demonstration) ---
const mockPatients = [
  {
    _id: "pat_1",
    name: "Eleanor Vance",
    diagnosis: "Hypertension",
    age: 68,
    lastVisit: "2025-06-18",
  },
  {
    _id: "pat_2",
    name: "Johnathan Doe",
    diagnosis: "Type 2 Diabetes",
    age: 55,
    lastVisit: "2025-06-15",
  },
  {
    _id: "pat_3",
    name: "Marcus Rivera",
    diagnosis: "Asthma",
    age: 42,
    lastVisit: "2025-06-20",
  },
  {
    _id: "pat_4",
    name: "Sophia Chen",
    diagnosis: "Post-operative Care",
    age: 31,
    lastVisit: "2025-05-25",
  },
  {
    _id: "pat_5",
    name: "David Miller",
    diagnosis: "Arthritis",
    age: 72,
    lastVisit: "2025-06-10",
  },
];

const getPatients = async (token) => {
  console.log(`Fetching patients with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockPatients };
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
const ChevronRightIcon = () => (
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
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const UserGroupIcon = () => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// --- Loading Skeleton for Patient Table ---
const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between space-x-4"
      >
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="w-1/6 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    ))}
  </div>
);

// --- Patient List Page Component ---
export default function ListPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getPatients(token)
      .then((res) => setPatients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const Avatar = ({ name }) => (
    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Patients
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              A comprehensive list of all registered patients.
            </p>
          </div>
          <Link
            to="/patients/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
          >
            <PlusIcon /> Add New Patient
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100 dark:border-slate-700">
                  <tr>
                    <th
                      className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400"
                      colSpan="2"
                    >
                      Name
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Diagnosis
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Age
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                      Last Visit
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4">
                        <Avatar name={p.name} />
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">
                        <Link
                          to={`/patients/${p._id}`}
                          className="hover:underline hover:text-[#FE4982]"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                        {p.diagnosis}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {p.age}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                        {new Date(p.lastVisit).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/patients/${p._id}`}
                          className="text-slate-400 hover:text-[#FE4982]"
                        >
                          <ChevronRightIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <UserGroupIcon className="mx-auto text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Patients Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Get started by adding a new patient.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
