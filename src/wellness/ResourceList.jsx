import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const getResources = async (token) => {
  // This function is kept as is.
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/wellness/resources`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data };
};

const getUser = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

const ExternalLinkIcon = () => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>{" "}
    <polyline points="15 3 21 3 21 9"></polyline>{" "}
    <line x1="10" y1="14" x2="21" y2="3"></line>{" "}
  </svg>
);
const BookHeartIcon = () => (
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
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />{" "}
    <path d="M16 18.5a2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1 4 0Z" />{" "}
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
    {" "}
    <line x1="19" y1="12" x2="5" y2="12"></line>{" "}
    <polyline points="12 19 5 12 12 5"></polyline>{" "}
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
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <polyline points="3 6 5 6 21 6"></polyline>{" "}
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>{" "}
  </svg>
);

// --- Loading Skeleton ---
const CardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm space-y-4">
    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
    <div className="space-y-2 pt-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mt-2 pt-2"></div>
  </div>
);

// --- Confirmation Dialog Component ---
const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  // Close dialog on escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Close dialog on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
      >
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Confirm Deletion
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete this resource? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Wellness Resources Page ---
export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getUser(token)
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
    getResources(token)
      .then((res) => setResources(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleDeleteClick = (id) => {
    setResourceToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/wellness/resources/${resourceToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResources((prev) =>
        prev.filter((res) => res._id !== resourceToDelete)
      );
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setShowConfirmDialog(false);
      setResourceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setResourceToDelete(null);
  };

  const CategoryBadge = ({ category }) => {
    // This component is kept as is.
    const categoryStyles = {
      diet: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      "Mental Health":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      mental:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
      "Medical Info":
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      exercise:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
      default:
        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
          categoryStyles[category] || categoryStyles.default
        }`}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* ... (Your existing header and page title JSX remains unchanged) */}
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 -mt-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="mb-8 flex items-center justify-between w-full">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Wellness Resources
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                A curated library of articles, guides, and materials to support
                patient well-being.
              </p>
            </div>
            {user && user.role === "admin" && (
              <Link
                to="/wellness/resource/create"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
              >
                <PlusIcon /> Create New Resource
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
          ) : resources.length > 0 ? (
            resources.map((res) => (
              <div
                key={res._id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="mb-3 w-full flex justify-between">
                    <span>
                      <CategoryBadge category={res.category} />
                    </span>
                    {user && user.role === "admin" && (
                      <button
                        onClick={() => handleDeleteClick(res._id)}
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#1D2056] dark:text-slate-100">
                    {res.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm flex-grow">
                    {res.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE4982] hover:text-[#1D2056] dark:hover:text-pink-300 transition-colors"
                  >
                    Open Resource <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <span className="mx-auto text-slate-400 dark:text-slate-500">
                <BookHeartIcon />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No Resources Available
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Wellness resources will appear here when they are added.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showConfirmDialog && (
        <ConfirmationDialog onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}
