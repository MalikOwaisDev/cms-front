import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

// --- Loading Skeleton for Patient Table ---
const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 bg-white rounded-lg p-4 flex items-center justify-between space-x-4"
      >
        <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
        <div className="flex-1 h-4 bg-slate-200 rounded"></div>
        <div className="w-1/4 h-4 bg-slate-200 rounded"></div>
        <div className="w-1/6 h-4 bg-slate-200 rounded"></div>
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

  // A simple avatar component
  const Avatar = ({ name }) => (
    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Patients</h1>
            <p className="text-slate-600 mt-1">
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

        {/* Patient List / Table */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-200">
                  <tr>
                    <th
                      className="p-3 text-sm font-semibold text-slate-600"
                      colSpan="2"
                    >
                      Name
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Diagnosis
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Age
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Last Visit
                    </th>
                    <th className="p-3 rounded-r-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <Avatar name={p.name} />
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        <Link
                          to={`/patients/${p._id}`}
                          className="hover:underline hover:text-[#FE4982]"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-600">{p.diagnosis}</td>
                      <td className="p-4 text-slate-600">{p.age}</td>
                      <td className="p-4 text-slate-600">
                        {new Date(p.lastVisit).toLocaleDateString()}
                      </td>
                      <td className="p-4">
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
