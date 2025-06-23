import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
let mockCarePlans = [
  {
    _id: "cp_1",
    title: "Post-Surgery Recovery Plan",
    patient: { name: "Eleanor Vance" },
    description:
      "A 4-week plan to ensure proper healing and mobility restoration after knee surgery.",
    goals: [
      { goal: "Walk 500 steps daily without assistance", status: "achieved" },
      {
        goal: "Attend all scheduled physical therapy sessions",
        status: "in progress",
      },
      { goal: "Follow prescribed medication schedule", status: "in progress" },
    ],
  },
  {
    _id: "cp_2",
    title: "Diabetes Management",
    patient: { name: "Johnathan Doe" },
    description:
      "Ongoing plan to monitor blood sugar levels and promote a healthy lifestyle.",
    goals: [
      {
        goal: "Monitor and log blood sugar levels twice daily",
        status: "in progress",
      },
      { goal: "Follow the low-sugar diet plan", status: "pending" },
    ],
  },
];

const getCarePlans = async (token) => {
  console.log(`Fetching care plans with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockCarePlans };
};

const updateGoalStatus = async ({ planId, goalIndex, status }, token) => {
  console.log(`Updating goal for plan ${planId} with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  mockCarePlans = mockCarePlans.map((plan) => {
    if (plan._id === planId) {
      const newGoals = [...plan.goals];
      newGoals[goalIndex].status = status;
      return { ...plan, goals: newGoals };
    }
    return plan;
  });
  return { data: { message: "Status updated." } };
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
const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

// --- Loading Skeleton for Cards ---
const CardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg"></div>
          <div className="h-10 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Care Plan List Page Component ---
export default function CarePlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPlans();
  }, [token, navigate]);

  const fetchPlans = () => {
    setLoading(true);
    getCarePlans(token)
      .then((res) => setPlans(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (planId, goalIndex, status) => {
    await updateGoalStatus({ planId, goalIndex, status }, token);
    // Refetch to show updated data
    fetchPlans();
  };

  const GoalStatusBadge = ({ status }) => {
    let colors = "bg-slate-100 text-slate-600";
    if (status === "in progress") colors = "bg-blue-100 text-blue-700";
    if (status === "achieved") colors = "bg-green-100 text-green-700";
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${colors}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Patient Care Plans
            </h1>
            <p className="text-slate-600 mt-1">
              Track and manage the progress of all wellness goals.
            </p>
          </div>
          <Link
            to="/wellness/plans/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
          >
            <PlusIcon /> Create New Plan
          </Link>
        </div>

        <div className="space-y-6">
          {loading ? (
            <CardSkeleton />
          ) : (
            plans.map((plan) => (
              <div key={plan._id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-[#1D2056]">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-slate-500 font-semibold">
                    Patient: {plan.patient?.name}
                  </p>
                  <p className="text-slate-600 mt-2 text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3">
                  {plan.goals.map((g, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <TargetIcon className="text-slate-400 flex-shrink-0" />
                        <span className="text-slate-700">{g.goal}</span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <GoalStatusBadge status={g.status} />
                        {g.status !== "achieved" && (
                          <select
                            value={g.status}
                            onChange={(e) =>
                              handleStatusChange(plan._id, i, e.target.value)
                            }
                            className="bg-white border border-slate-300 rounded-md text-xs p-1 focus:ring-1 focus:ring-[#FE4982] focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="achieved">Achieved</option>
                          </select>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {!loading && plans.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <p className="text-slate-500">
                No care plans have been created yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
