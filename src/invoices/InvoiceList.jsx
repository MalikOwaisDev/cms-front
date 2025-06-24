import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES ---
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

const getInvoices = async () => {
  // await new Promise((r) => setTimeout(r, 1000));
  return { data: mockInvoices };
};

// --- ICONS ---
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
const InvoiceIcon = () => (
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
    class="lucide lucide-file-text"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

// --- Loading Skeleton for Table ---
const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between space-x-4"
      >
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/5"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
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
    getInvoices(token)
      .then((res) => setInvoices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const StatusBadge = ({ status }) => {
    const paidClasses =
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    const unpaidClasses =
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
    return (
      <div
        className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
          status === "paid" ? paidClasses : unpaidClasses
        }`}
      >
        {status}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Invoices
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
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

        <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Invoice ID
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Patient
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Issue Date
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Amount
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
                      Status
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-[#1D2056] dark:text-pink-400 font-semibold hidden sm:table-cell">
                        <Link
                          to={`/invoices/${inv._id}`}
                          className="hover:underline"
                        >
                          {inv._id.replace("inv_", "#")}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-200 font-semibold">
                        {inv.patient.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                        {new Date(inv.issueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-200 font-semibold">
                        ${inv.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/invoices/${inv._id}`}
                          className="text-slate-400 hover:text-[#FE4982] dark:hover:text-pink-400"
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
              <InvoiceIcon className="mx-auto text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Invoices Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Get started by creating a new invoice.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
