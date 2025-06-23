import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const mockPatients = [
  { _id: "pat1", name: "Johnathan Doe" },
  { _id: "pat2", name: "Eleanor Vance" },
  { _id: "pat3", name: "Marcus Rivera" },
];

const getPatients = async (token) => {
  console.log("Fetching patients with token:", token);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: mockPatients };
};

const createCarePlan = async (planData, token) => {
  console.log("Creating care plan with token:", token);
  console.log("Plan Data:", planData);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { data: { message: "Care plan created successfully!" } };
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
const ClipboardIcon = () => (
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
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);
const AlignLeftIcon = () => (
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
    <line x1="17" y1="10" x2="3" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="17" y1="18" x2="3" y2="18"></line>
  </svg>
);
const TargetIcon = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
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

// --- Reusable Header/Footer ---
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

// --- Care Plan Form Page Component ---
export default function CarePlanForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    title: "",
    description: "",
    goals: [{ goal: "", status: "pending" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    getPatients(token).then((res) => setPatients(res.data));
  }, [token]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...form.goals];
    newGoals[index].goal = value;
    setForm({ ...form, goals: newGoals });
  };

  const addGoal = () => {
    setForm({
      ...form,
      goals: [...form.goals, { goal: "", status: "pending" }],
    });
  };

  const removeGoal = (index) => {
    const newGoals = form.goals.filter((_, i) => i !== index);
    setForm({ ...form, goals: newGoals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.patient || !form.title || form.goals.some((g) => !g.goal)) {
      setError("Patient, Title, and all Goal fields are required.");
      return;
    }
    setLoading(true);
    try {
      await createCarePlan(form, token);
      setSuccess("Care plan created successfully!");
      setForm({
        patient: "",
        title: "",
        description: "",
        goals: [{ goal: "", status: "pending" }],
      });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to create care plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Create New Care Plan
            </h1>
            <p className="text-slate-600 mt-1">
              Develop a personalized health and wellness plan for a patient.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
          >
            {/* Plan Details */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Plan Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="patient"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Patient
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                    <select
                      id="patient"
                      name="patient"
                      value={form.patient}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
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
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Plan Title
                  </label>
                  <div className="relative">
                    <ClipboardIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                    <input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="e.g., Post-Surgery Recovery Plan"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Description
                </label>
                <div className="relative">
                  <AlignLeftIcon className="absolute top-4 left-3 text-slate-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Briefly describe the purpose and scope of this care plan."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  ></textarea>
                </div>
              </div>
            </fieldset>

            {/* Goals Section */}
            <fieldset>
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Patient Goals
              </legend>
              <div className="space-y-4">
                {form.goals.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative flex-grow">
                      <TargetIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                      <input
                        value={g.goal}
                        onChange={(e) => handleGoalChange(idx, e.target.value)}
                        placeholder={`Goal #${idx + 1}`}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                      />
                    </div>
                    {form.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(idx)}
                        className="text-red-500 hover:text-red-700 p-3 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGoal}
                  className="flex items-center gap-2 text-[#1D2056] font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <PlusIcon /> Add Another Goal
                </button>
              </div>
            </fieldset>

            {/* Actions */}
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
                  className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE4982] disabled:bg-opacity-60"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon /> Create Plan
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
