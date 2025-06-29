import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- FORM ICONS ---
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
const TrashIcon = () => (
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
  </svg>
);
const SendIcon = () => (
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
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// --- MOCK API SERVICES ---
const mockPatients = [
  { _id: "pat1", name: "Johnathan Doe" },
  { _id: "pat2", name: "Eleanor Vance" },
  { _id: "pat3", name: "Marcus Rivera" },
];
const getPatients = async (token) => {
  await new Promise((r) => setTimeout(r, 500));
  return { data: mockPatients };
};
const createInvoice = async (invoiceData, token) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { data: { message: "Invoice created successfully!" } };
};

// --- Main Create Invoice Page Component ---
export default function CreateInvoice() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [services, setServices] = useState([{ description: "", amount: "" }]);
  const [patients, setPatients] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    getPatients(token)
      .then((res) => setPatients(res.data))
      .catch((err) => setError("Could not fetch patients."));
  }, [token, navigate]);

  const handleAddService = () =>
    setServices([...services, { description: "", amount: "" }]);
  const handleRemoveService = (index) =>
    setServices(services.filter((_, i) => i !== index));
  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const totalAmount = useMemo(
    () => services.reduce((total, s) => total + (Number(s.amount) || 0), 0),
    [services]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!patientId || services.some((s) => !s.description || !s.amount)) {
      setError("Please select a patient and fill all service details.");
      return;
    }
    setLoading(true);
    try {
      const invoiceData = {
        patient: patientId,
        services: services.map((s) => ({ ...s, amount: Number(s.amount) })),
        total: totalAmount,
        issueDate: invoiceDate,
        status: "unpaid",
      };
      const res = await createInvoice(invoiceData, token);
      setSuccess(res.data.message);
      setPatientId("");
      setServices([{ description: "", amount: "" }]);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Create New Invoice
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details below to generate an invoice for a patient.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label
                  htmlFor="patient"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Patient
                </label>
                <select
                  id="patient"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                >
                  <option value="" disabled>
                    Select a patient
                  </option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="invoiceDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Issue Date
                </label>
                <input
                  type="date"
                  id="invoiceDate"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Services Rendered
              </h2>
              {services.map((service, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center"
                >
                  <input
                    type="text"
                    placeholder="Service Description (e.g., 'Physical Therapy')"
                    value={service.description}
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={service.amount}
                    onChange={(e) =>
                      handleServiceChange(index, "amount", e.target.value)
                    }
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-red-500 hover:text-red-700 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center gap-2 text-[#1D2056] dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <PlusIcon /> Add Service Line
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-medium text-slate-600 dark:text-slate-400">
                  Total:
                </span>
                <span className="text-3xl font-bold text-[#1D2056] dark:text-slate-100">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:ring-offset-slate-900 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <SendIcon /> Submit Invoice
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center mt-4">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center mt-4">
                {success}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
