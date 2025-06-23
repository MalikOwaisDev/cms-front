import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const mockInvoices = [
  {
    _id: "inv_12345ABC",
    patient: { name: "Eleanor Vance" },
    totalAmount: 575.0,
    status: "unpaid",
    issueDate: "2025-06-23",
    dueDate: "2025-07-23",
  },
  {
    _id: "inv_67890DEF",
    patient: { name: "Johnathan Doe" },
    totalAmount: 320.5,
    status: "paid",
    issueDate: "2025-06-20",
    dueDate: "2025-07-20",
  },
  {
    _id: "inv_11223GHI",
    patient: { name: "Marcus Rivera" },
    totalAmount: 890.0,
    status: "unpaid",
    issueDate: "2025-06-15",
    dueDate: "2025-07-15",
  },
  {
    _id: "inv_44556JKL",
    patient: { name: "Sophia Chen" },
    totalAmount: 125.0,
    status: "paid",
    issueDate: "2025-05-30",
    dueDate: "2025-06-30",
  },
  {
    _id: "inv_77889MNO",
    patient: { name: "David Miller" },
    totalAmount: 650.0,
    status: "paid",
    issueDate: "2025-05-28",
    dueDate: "2025-06-28",
  },
];

const getInvoices = async (token) => {
  console.log(`Fetching invoices with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockInvoices };
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

// --- Loading Skeleton for Table ---
const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 bg-white rounded-lg p-4 flex items-center justify-between"
      >
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/5"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
      </div>
    ))}
  </div>
);

// --- Invoice List Page Component ---
export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getInvoices(token)
      .then((res) => setInvoices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    if (status === "paid") {
      return (
        <div className={`${baseClasses} bg-green-100 text-green-800`}>Paid</div>
      );
    }
    return (
      <div className={`${baseClasses} bg-orange-100 text-orange-800`}>
        Unpaid
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Invoices</h1>
            <p className="text-slate-600 mt-1">
              Manage and track all patient invoices.
            </p>
          </div>
          <Link
            to="/invoices/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
          >
            <PlusIcon /> Create New Invoice
          </Link>
        </div>

        {/* Invoice List / Table */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Invoice ID
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Patient
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Issue Date
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600">
                      Amount
                    </th>
                    <th className="p-3 text-sm font-semibold text-slate-600 text-center">
                      Status
                    </th>
                    <th className="p-3 rounded-r-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-[#1D2056] font-semibold">
                        <Link
                          to={`/invoices/${inv._id}`}
                          className="hover:underline"
                        >
                          {inv._id}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-800">{inv.patient.name}</td>
                      <td className="p-4 text-slate-600">
                        {new Date(inv.issueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-800 font-semibold">
                        ${inv.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 flex justify-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/invoices/${inv._id}`}
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
