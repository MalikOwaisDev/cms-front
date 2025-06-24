import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES (for demonstration) ---
let mockTrainings = [
  {
    _id: "tr_1",
    recordId: "rec_1",
    title: "Patient Privacy & HIPAA",
    content:
      "Complete the online module regarding patient data protection and HIPAA regulations.",
    status: "completed",
    dateCompleted: "2025-06-20",
    deadline: "2025-06-25",
  },
  {
    _id: "tr_2",
    recordId: "rec_2",
    title: "Emergency Procedures",
    content:
      "Review the updated fire and medical emergency protocols document.",
    status: "pending",
    deadline: "2025-06-30",
  },
  {
    _id: "tr_3",
    recordId: "rec_3",
    title: "Medication Administration Basics",
    content:
      "Pass the online quiz for safe medication handling and administration.",
    status: "pending",
    deadline: "2025-07-05",
  },
  {
    _id: "tr_4",
    recordId: "rec_4",
    title: "Advanced First Aid",
    content: "Attend the in-person workshop and get certified.",
    status: "completed",
    dateCompleted: "2025-05-30",
    deadline: "2025-05-29",
  },
];

const getTrainings = async (token) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { data: mockTrainings };
};

const markTrainingComplete = async (recordId, token) => {
  await new Promise((r) => setTimeout(r, 1000));
  mockTrainings = mockTrainings.map((t) =>
    t.recordId === recordId
      ? {
          ...t,
          status: "completed",
          dateCompleted: new Date().toISOString().split("T")[0],
        }
      : t
  );
  return { data: { message: "Training marked as complete." } };
};

// --- ICONS (Self-contained SVG components) ---
const ClockIcon = () => (
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
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
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
const BookOpenIcon = () => (
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
    className="lucide lucide-book-open-check"
  >
    <path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z" />
    <path d="M16 3h6v15h-7c-1.7 0-3 1.3-3 3V7c0-2.2 1.8-4 4-4Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// --- Loading Skeleton for Cards ---
const CardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
      >
        <div className="space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-32"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Training List Page Component (for Caregivers) ---
export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTrainings();
  }, [token, navigate]);

  const fetchTrainings = () => {
    setLoading(true);
    getTrainings(token)
      .then((res) => setTrainings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleComplete = async (recordId) => {
    setUpdatingId(recordId);
    try {
      await markTrainingComplete(recordId, token);
      setTrainings((prev) =>
        prev.map((t) =>
          t.recordId === recordId
            ? {
                ...t,
                status: "completed",
                dateCompleted: new Date().toISOString().split("T")[0],
              }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === "completed") {
      return (
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
          <CheckCircleIcon /> Completed
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
        <ClockIcon /> Pending
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            My Assigned Trainings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Complete these modules to stay up-to-date with your certifications.
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <CardSkeleton />
          ) : trainings.length > 0 ? (
            trainings.map((t) => (
              <div
                key={t._id}
                className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 transition-colors ${
                  t.status === "completed"
                    ? "border-green-500"
                    : "border-[#FE4982]"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1D2056] dark:text-slate-100">
                      {t.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                      {t.content}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                      Deadline:{" "}
                      <span className="font-semibold">
                        {new Date(t.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-4 flex-shrink-0 pt-2 sm:pt-0">
                    <StatusBadge status={t.status} />
                    {t.status === "pending" && (
                      <button
                        onClick={() => handleComplete(t.recordId)}
                        disabled={updatingId === t.recordId}
                        className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:bg-green-400 disabled:cursor-wait"
                      >
                        {updatingId === t.recordId ? (
                          "Updating..."
                        ) : (
                          <>
                            <CheckIcon /> Mark Complete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <BookOpenIcon className="mx-auto text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                All Clear!
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                You have no pending trainings at the moment.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
