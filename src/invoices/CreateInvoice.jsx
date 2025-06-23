import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // To mock user data

// --- MOCK API SERVICES (for demonstration) ---
// In your real app, these would be in separate service files.
const mockPatients = [
  { _id: "pat1", name: "Johnathan Doe" },
  { _id: "pat2", name: "Eleanor Vance" },
  { _id: "pat3", name: "Marcus Rivera" },
];

const getPatients = async (token) => {
  console.log("Fetching patients with token:", token);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: mockPatients };
};

const createInvoice = async (invoiceData, token) => {
  console.log("Creating invoice with token:", token);
  console.log("Invoice Data:", invoiceData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In a real scenario, you might get the created invoice back
  return { data: { message: "Invoice created successfully!" } };
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
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
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

// --- Reusable Header/Footer for consistent layout ---
const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="bg-[#1D2056] text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold tracking-wider">
          CarePulse
        </Link>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#FE4982] flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-slate-700">
              <button
                onClick={onLogout}
                className="w-full text-left block px-4 py-2 text-sm hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
const Footer = () => (
  <footer className="bg-slate-100 text-center p-4 mt-auto">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse Management System.
    </p>
  </footer>
);

// --- Main Create Invoice Page Component ---
export default function CreateInvoice() {
  const navigate = useNavigate();
  // State for the form
  const [patientId, setPatientId] = useState("");
  const [services, setServices] = useState([{ description: "", amount: "" }]);
  const [patients, setPatients] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token"); // Assume token is available

  // Fetch patients on component mount
  useEffect(() => {
    if (!token) navigate("/login");
    getPatients(token)
      .then((res) => setPatients(res.data))
      .catch((err) => setError("Could not fetch patients."));
  }, [token, navigate]);

  const handleAddService = () => {
    setServices([...services, { description: "", amount: "" }]);
  };

  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const totalAmount = useMemo(() => {
    return services.reduce(
      (total, service) => total + (Number(service.amount) || 0),
      0
    );
  }, [services]);

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
      setSuccess(res.data.message || "Invoice created successfully!");
      // Reset form
      setPatientId("");
      setServices([{ description: "", amount: "" }]);
    } catch (err) {
      setError("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Create New Invoice
          </h1>
          <p className="text-slate-600 mt-1">
            Fill in the details below to generate an invoice.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-sm"
        >
          {/* Top Section: Patient and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="patient"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Patient
              </label>
              <select
                id="patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
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
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Issue Date
              </label>
              <input
                type="date"
                id="invoiceDate"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
              />
            </div>
          </div>

          {/* Middle Section: Service Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
              Services
            </h2>
            {services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center animate-fade-in"
              >
                <input
                  type="text"
                  placeholder="Service Description (e.g., 'Physical Therapy Session')"
                  value={service.description}
                  onChange={(e) =>
                    handleServiceChange(index, "description", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={service.amount}
                  onChange={(e) =>
                    handleServiceChange(index, "amount", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  className="text-red-500 hover:text-red-700 p-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddService}
              className="flex items-center gap-2 text-[#1D2056] font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <PlusIcon /> Add Service Line
            </button>
          </div>

          {/* Bottom Section: Total and Submit */}
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-medium text-slate-600">Total:</span>
              <span className="text-3xl font-bold text-[#1D2056]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60"
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

          {/* Feedback Messages */}
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          {success && (
            <p className="text-green-600 mt-4 text-center">{success}</p>
          )}
        </form>
      </main>

      <Footer />
    </div>
  );
}
