import { useState, useEffect } from "react";
import { useNavigate, Link, useParams, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES ---
let mockInvoice = {
  _id: "inv_12345ABC",
  patient: {
    _id: "pat2",
    name: "Eleanor Vance",
    address: "456 Oak Avenue, Metropolis",
  },
  services: [
    { description: "Comprehensive Wellness Check-up", amount: 250.0 },
    { description: "Nutritional Consultation", amount: 150.0 },
    { description: "Physical Therapy Assessment", amount: 175.0 },
  ],
  totalAmount: 575.0,
  status: "unpaid",
  issueDate: "2025-06-23",
  dueDate: "2025-07-23",
};
const getInvoiceById = async (id, token) => {
  await new Promise((r) => setTimeout(r, 800));
  return { data: mockInvoice };
};
const markInvoicePaid = async (id, token) => {
  await new Promise((r) => setTimeout(r, 1000));
  mockInvoice.status = "paid";
  return { data: { message: "Invoice marked as paid." } };
};

// --- PAGE ICONS ---
const PrintIcon = () => (
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
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);
const DownloadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Loading Skeleton ---
const InvoiceSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-8">
      <div>
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mt-2"></div>
      </div>
      <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
    </div>
    <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded mt-8"></div>
    <div className="flex justify-end mt-8">
      <div className="h-12 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

// --- Invoice Details Page ---
export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id || !token) {
      navigate("/login");
      return;
    }
    getInvoiceById(id, token)
      .then((res) => setInvoice(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token, navigate]);

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      await markInvoicePaid(id, token);
      const updated = await getInvoiceById(id, token);
      setInvoice(updated.data);
    } catch (err) {
      console.error("Failed to mark as paid", err);
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const paidClasses =
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    const unpaidClasses =
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
    const baseClasses = "px-3 py-1.5 text-sm font-semibold rounded-full";
    return (
      <div
        className={`${baseClasses} ${
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
        {loading ? (
          <InvoiceSkeleton />
        ) : (
          invoice && (
            <>
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-[#1D2056] dark:text-slate-100">
                      INVOICE
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      #{invoice._id}
                    </p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 border-t border-slate-100 dark:border-slate-700 pt-8">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Billed To
                    </h2>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {invoice.patient.name}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {invoice.patient.address}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Details
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Issue Date:</strong>{" "}
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Due Date:</strong>{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <tr className="border-b-2 border-slate-100 dark:border-slate-700">
                        <th className="p-3">Service Description</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {invoice.services.map((s, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {s.description}
                          </td>
                          <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                            ${s.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-8">
                  <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <p>Subtotal</p>
                      <p>${invoice.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <p>Tax (0%)</p>
                      <p>$0.00</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[#1D2056] dark:text-slate-100 border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 !">
                      <p>Total Amount</p>
                      <p>${invoice.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                >
                  <PrintIcon /> Print
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                  <DownloadIcon /> Download PDF
                </button>
                {invoice.status === "unpaid" && (
                  <button
                    onClick={handleMarkPaid}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all disabled:opacity-60"
                  >
                    <CheckCircleIcon />{" "}
                    {loading ? "Processing..." : "Mark as Paid"}
                  </button>
                )}
              </div>
            </>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
