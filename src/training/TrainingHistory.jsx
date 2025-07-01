import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

// --- API Service ---
const getTrainings = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/trainings/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data };
};

const getUser = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// --- ICONS (assuming these are defined as in your original code) ---
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
    {" "}
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>{" "}
    <polyline points="22 4 12 14.01 9 11.01"></polyline>{" "}
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
    {" "}
    <line x1="12" y1="5" x2="12" y2="19"></line>{" "}
    <line x1="5" y1="12" x2="19" y2="12"></line>{" "}
  </svg>
);
const ArchiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <rect width="20" height="5" x="2" y="3" rx="1" />{" "}
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /> <path d="M10 12h4" />{" "}
  </svg>
);
const ChevronLeftIcon = () => (
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
    {" "}
    <polyline points="15 18 9 12 15 6"></polyline>{" "}
  </svg>
);
const ChevronRightIcon = () => (
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
    {" "}
    <polyline points="9 18 15 12 9 6"></polyline>{" "}
  </svg>
);
const SearchIcon = () => (
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
    {" "}
    <circle cx="11" cy="11" r="8"></circle>{" "}
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{" "}
  </svg>
);
const BackIcon = () => (
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
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// --- Loading Skeleton ---
const ListSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    ))}
  </div>
);

// --- Training History Page ---
export default function TrainingHistory() {
  const [historyLog, setHistoryLog] = useState([]);
  const [filteredLog, setFilteredLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null); // <-- NEW: State to hold user info
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const itemsPerPage = 10;

  useEffect(() => {
    let storedUser = null;
    const fetchUser = async () => {
      // NEW: Retrieve user info from local storage
      const res = await getUser(token);
      if (!token) {
        navigate("/login");
        return;
      }
      setUser(res);
      return await storedUser;
    };
    storedUser = fetchUser();
    if (!storedUser) return; // If user fetch fails, exit early
    const fetchHistory = async () => {
      await getTrainings(token)
        .then((res) => {
          // Create a flat list of individual completion records (existing logic)
          const log = [];
          res.data.forEach((training) => {
            if (
              training.status === "completed" &&
              training.training.assignedTo
            ) {
              training.training.assignedTo.forEach((caregiver) => {
                log.push({
                  logId: `${training.training._id}-${caregiver._id}`,
                  title: training.training.title,
                  caregiverId: caregiver._id, // <-- MODIFIED: Store ID for filtering
                  caregiverName: caregiver.name,
                  dateCompleted: training.dateCompleted,
                });
              });
            }
          });

          // Sort by most recent completion date
          log.sort(
            (a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)
          );
          // --- NEW: Role-based filtering ---
          if (storedUser.role === "caregiver") {
            const caregiverLog = log.filter(
              (item) => item.caregiverId === storedUser._id
            );
            setHistoryLog(caregiverLog);
            setFilteredLog(caregiverLog);
          } else {
            // Admin sees all logs (original behavior)
            setHistoryLog(log);
            setFilteredLog(log);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    fetchHistory();
  }, [token, navigate]);

  useEffect(() => {
    // This search logic remains unchanged and works for both roles.
    // For caregivers, it will search within their already-filtered list.
    const results = historyLog.filter(
      (log) =>
        log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.role !== "caregiver" && // Only search by name if user is not a caregiver
          log.caregiverName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredLog(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, historyLog, user]);

  // Pagination logic (unchanged)
  const totalPages = Math.ceil(filteredLog.length / itemsPerPage);
  const currentItems = filteredLog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- UI Titles & Placeholders based on Role ---
  const pageTitle =
    user?.role === "caregiver" ? "My Completed Trainings" : "Training History";
  const pageSubtitle =
    user?.role === "caregiver"
      ? "A record of all your completed training modules."
      : "A log of all completed training modules by caregivers.";
  const searchPlaceholder =
    user?.role === "caregiver"
      ? "Search by training title..."
      : "Search by training or caregiver...";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                {pageSubtitle}
              </p>
            </div>
          </div>
          {/* NEW: Conditionally render "Create" button for admins only */}
          {user?.role === "admin" && (
            <Link
              to="/trainings/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#E03A6D] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-[#FE4982]"
            >
              <PlusIcon /> Create New Training
            </Link>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          {loading ? (
            <div className="p-4">
              <ListSkeleton />
            </div>
          ) : currentItems.length > 0 ? (
            <div>
              {/* NEW: Grid layout adapts based on role */}
              <div
                className={`hidden sm:grid ${
                  user?.role === "admin" ? "grid-cols-12" : "grid-cols-9"
                } gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-700`}
              >
                <div className="col-span-6 font-semibold text-sm text-slate-600 dark:text-slate-300">
                  Training Module
                </div>
                {/* NEW: Show caregiver column for admins only */}
                {user?.role === "admin" && (
                  <div className="col-span-3 font-semibold text-sm text-slate-600 dark:text-slate-300">
                    Caregiver
                  </div>
                )}
                <div className="col-span-3 font-semibold text-sm text-slate-600 dark:text-slate-300 text-right">
                  Date Completed
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {currentItems.map((log) => (
                  <div
                    key={log.logId}
                    className={`grid ${
                      user?.role === "admin" ? "grid-cols-12" : "grid-cols-9"
                    } gap-4 px-6 py-4 items-center`}
                  >
                    <div className="col-span-9 sm:col-span-6 flex items-center gap-4">
                      <span className="text-green-500 flex-shrink-0">
                        <CheckCircleIcon width={20} height={20} />
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {log.title}
                      </span>
                    </div>
                    {/* NEW: Show caregiver name for admins only */}
                    {user?.role === "admin" && (
                      <div className="col-span-9 sm:col-span-3 text-slate-500 dark:text-slate-400 pl-10 sm:pl-0">
                        {log.caregiverName}
                      </div>
                    )}
                    <div className="col-span-9 sm:col-span-3 text-slate-500 dark:text-slate-400 text-left sm:text-right pl-10 sm:pl-0">
                      {new Date(log.dateCompleted).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>
                    -
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {Math.min(currentPage * itemsPerPage, filteredLog.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {filteredLog.length}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon /> Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col text-center py-16">
              <span className="mx-auto text-slate-400 dark:text-slate-500">
                <ArchiveIcon />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Completed Trainings Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {searchTerm
                  ? `No records match your search for "${searchTerm}".`
                  : "Completed training records will appear here."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
