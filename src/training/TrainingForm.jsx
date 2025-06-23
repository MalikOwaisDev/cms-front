import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const mockCaregivers = [
  { _id: "user_1", name: "Alice Johnson" },
  { _id: "user_2", name: "Bob Williams" },
  { _id: "user_3", name: "Charlie Brown" },
  { _id: "user_4", name: "Diana Prince" },
];

// In a real app, this would fetch users with the 'caregiver' role
const getCaregivers = async (token) => {
  console.log("Fetching caregivers with token:", token);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: mockCaregivers };
};

const createTraining = async (trainingData, token) => {
  console.log("Creating training with token:", token);
  console.log("Training Data:", trainingData);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    data: { message: "Training module created and assigned successfully!" },
  };
};

// --- ICONS (Self-contained SVG components) ---
const BookOpenIcon = () => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
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
const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
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

// --- Training Form Page Component ---
export default function TrainingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", deadline: "" });
  const [caregivers, setCaregivers] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    getCaregivers(token).then((res) => setCaregivers(res.data));
  }, [token]);

  const handleAssigneeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAssignedTo([...assignedTo, value]);
    } else {
      setAssignedTo(assignedTo.filter((id) => id !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.title || !form.content || !form.deadline) {
      setError("Title, Content, and Deadline are required.");
      return;
    }
    setLoading(true);
    try {
      await createTraining({ ...form, assignedTo }, token);
      setSuccess("Training created and assigned successfully!");
      setForm({ title: "", content: "", deadline: "" });
      setAssignedTo([]);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to create training. Please try again.");
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
              Create New Training
            </h1>
            <p className="text-slate-600 mt-1">
              Design a module and assign it to caregivers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
          >
            {/* Training Details */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Module Details
              </legend>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Training Title
                </label>
                <div className="relative">
                  <BookOpenIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                  <input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g., Patient Privacy & HIPAA"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Content / Instructions
                </label>
                <div className="relative">
                  <AlignLeftIcon className="absolute top-4 left-3 text-slate-400" />
                  <textarea
                    id="content"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows="5"
                    placeholder="Describe the training requirements, link to materials, etc."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  ></textarea>
                </div>
              </div>
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Completion Deadline
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    id="deadline"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Assignee Selection */}
            <fieldset>
              <legend className="text-lg font-semibold text-[#1D2056] mb-4">
                Assign to Caregivers
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {caregivers.map((c) => (
                  <label
                    key={c._id}
                    htmlFor={`caregiver-${c._id}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      assignedTo.includes(c._id)
                        ? "bg-pink-50 border-[#FE4982] ring-2 ring-[#FE4982]"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`caregiver-${c._id}`}
                      value={c._id}
                      checked={assignedTo.includes(c._id)}
                      onChange={handleAssigneeChange}
                      className="h-4 w-4 rounded border-gray-300 text-[#FE4982] focus:ring-[#E03A6D]"
                    />
                    <span className="ml-3 font-medium text-slate-700">
                      {c.name}
                    </span>
                  </label>
                ))}
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
                    "Assigning..."
                  ) : (
                    <>
                      <SendIcon /> Create & Assign
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
