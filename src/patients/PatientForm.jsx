import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const createPatient = async (patientData, token) => {
  console.log("Creating patient with token:", token);
  console.log("Patient Data:", patientData);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    data: {
      message: "Patient registered successfully!",
      patient: { ...patientData, _id: `pat_${Math.random()}` },
    },
  };
};

// --- ICONS (Self-contained SVG components) ---
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const ActivityIcon = () => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
const HashIcon = () => (
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
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);
const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const SaveIcon = () => (
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
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

// --- Reusable Components (Header, Footer) ---
const Header = ({ user, onLogout }) => (
  <header className="bg-[#1D2056] text-white shadow-md">
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
  <footer className="bg-slate-100 text-center p-4 mt-auto">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse
    </p>
  </footer>
);

// --- Patient Form Page Component ---
export default function PatientForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    diagnosis: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.age || !form.diagnosis || !form.contact) {
      setError("All fields are required to register a patient.");
      return;
    }
    setLoading(true);
    try {
      const res = await createPatient(form, token);
      setSuccess(res.data.message || "Patient registered successfully!");
      setForm({ name: "", age: "", diagnosis: "", contact: "" }); // Reset form
      setTimeout(() => setSuccess(""), 4000); // Clear success message after 4s
    } catch (err) {
      setError("Failed to create patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Register New Patient
            </h1>
            <p className="text-slate-600 mt-1">
              Enter the patient's details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
          >
            {/* Fieldset for Personal Details */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Personal Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Eleanor Vance"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Age
                  </label>
                  <div className="relative">
                    <HashIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="e.g., 68"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Contact Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="contact"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="(+92) 300-1234567"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Fieldset for Medical Details */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Medical Information
              </legend>
              <div>
                <label
                  htmlFor="diagnosis"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Primary Diagnosis
                </label>
                <div className="relative">
                  <ActivityIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="diagnosis"
                    name="diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    placeholder="e.g., Hypertension"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Form Actions and Feedback */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon /> Save Patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
