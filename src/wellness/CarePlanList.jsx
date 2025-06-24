import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// --- MOCK API SERVICES ---
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
  await new Promise((r) => setTimeout(r, 1000));
  return { data: mockCarePlans };
};
const updateGoalStatus = async ({ planId, goalIndex, status }, token) => {
  await new Promise((r) => setTimeout(r, 1000));
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

// --- PAGE ICONS ---
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
const ClipboardListIcon = () => (
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
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

// --- Loading Skeleton ---
const CardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
      >
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Care Plan List Page ---
export default function CarePlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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
    setUpdatingId(`${planId}-${goalIndex}`);
    await updateGoalStatus({ planId, goalIndex, status }, token);
    const refreshedPlans = await getCarePlans(token);
    setPlans(refreshedPlans.data);
    setUpdatingId(null);
  };

  const GoalStatusBadge = ({ status }) => {
    const statusStyles = {
      pending:
        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
      "in progress":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      achieved:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Patient Care Plans
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
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
          ) : plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
              >
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-[#1D2056] dark:text-slate-100">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                    Patient: {plan.patient?.name}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.goals.map((g, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">
                          <TargetIcon />
                        </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          {g.goal}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <GoalStatusBadge status={g.status} />
                        {g.status !== "achieved" && (
                          <select
                            value={g.status}
                            onChange={(e) =>
                              handleStatusChange(plan._id, i, e.target.value)
                            }
                            disabled={updatingId === `${plan._id}-${i}`}
                            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-xs p-1.5 focus:ring-1 focus:ring-[#FE4982] focus:outline-none disabled:opacity-50"
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
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <ClipboardListIcon className="mx-auto text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Care Plans Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Get started by creating a new care plan for a patient.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
