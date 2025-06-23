import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
const mockTrainings = [
  {
    _id: "tr_1",
    title: "Patient Privacy & HIPAA",
    status: "completed",
    dateCompleted: "2025-06-20",
    caregiver: { name: "Alice Johnson" },
  },
  {
    _id: "tr_2",
    title: "Emergency Procedures",
    status: "completed",
    dateCompleted: "2025-06-18",
    caregiver: { name: "Bob Williams" },
  },
  { _id: "tr_3", title: "Medication Administration Basics", status: "pending" },
  {
    _id: "tr_4",
    title: "Advanced First Aid",
    status: "completed",
    dateCompleted: "2025-05-30",
    caregiver: { name: "Alice Johnson" },
  },
  {
    _id: "tr_5",
    title: "Infection Control Protocols",
    status: "completed",
    dateCompleted: "2025-05-15",
    caregiver: { name: "Charlie Brown" },
  },
];

const getTrainings = async (token) => {
  console.log(`Fetching trainings with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockTrainings };
};

// --- ICONS (Self-contained SVG components) ---
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

// --- Reusable Header/Footer ---
const Header = ({ user, onLogout }) => (
  <header className="bg-[#1D2056] text-white shadow-md print:hidden">
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
  <footer className="bg-slate-100 text-center p-4 mt-auto print:hidden">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse
    </p>
  </footer>
);

// --- Loading Skeleton for List ---
const ListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-48"></div>
            <div className="h-3 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
    ))}
  </div>
);

// --- Training History Page Component ---
export default function TrainingHistory() {
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getTrainings(token)
      .then((res) => {
        const filtered = res.data.filter((t) => t.status === "completed");
        setCompletedTrainings(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Training History
            </h1>
            <p className="text-slate-600 mt-1">
              A log of all completed training modules by caregivers.
            </p>
          </div>
        </div>

        {/* Training List */}
        <div className="space-y-4">
          {loading ? (
            <ListSkeleton />
          ) : (
            completedTrainings.map((t) => (
              <div
                key={t._id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {t.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Completed by:{" "}
                      <span className="font-medium">{t.caregiver.name}</span>
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <p className="text-sm font-semibold text-slate-600">
                    {new Date(t.dateCompleted).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {!loading && completedTrainings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <p className="text-slate-500">No completed trainings found.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
