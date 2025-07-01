import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const getPatients = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { data: res.data };
};

// --- DELETE PATIENT FUNCTION ---
const deletePatient = async (id, token) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/patients/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
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
    {" "}
    <line x1="12" y1="5" x2="12" y2="19"></line>{" "}
    <line x1="5" y1="12" x2="19" y2="12"></line>{" "}
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
    <polyline points="9 18 15 12 9 6"></polyline>
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
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400 dark:text-slate-500"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    <line x1="10" y1="11" x2="10" y2="17"></line>{" "}
    <line x1="14" y1="11" x2="14" y2="17"></line>{" "}
  </svg>
);
const AlertTriangleIcon = () => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
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

// --- CONFIRMATION MODAL COMPONENT ---
const ConfirmationModal = ({
  isOpen,
  modalRef,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-sans">
      <div
        ref={modalRef}
        className="modal bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-in zoom-in-95 fade-in-0"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="h-6 w-6 text-red-600 dark:text-red-400">
              <AlertTriangleIcon />
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {children}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {" "}
            Delete{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Loading Skeleton for Patient Table ---
const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-white dark:bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between space-x-4"
      >
        <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
        </div>
        <div className="w-1/4 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
    ))}
  </div>
);

// --- Patient List Page Component ---
export default function ListPatients() {
  const modalRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const itemsPerPage = 10;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userRes.data);
        const patientsRes = await getPatients(token);
        setPatients(patientsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleDeleteClick = (patientId) => {
    setPatientToDelete(patientId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await deletePatient(patientToDelete, token);
      const updatedPatients = patients.filter((p) => p._id !== patientToDelete);
      setPatients(updatedPatients);

      // After deleting, check if the current page is now empty and adjust
      const newTotalPages = Math.ceil(updatedPatients.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }

      setSuccess("Patient deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to delete patient:", err);
      setError("Failed to delete patient.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsModalOpen(false);
      setPatientToDelete(null);
    }
  };

  const Avatar = ({ name }) => {
    const colors = [
      "bg-pink-200 text-pink-800",
      "bg-purple-200 text-purple-800",
      "bg-blue-200 text-blue-800",
      "bg-green-200 text-green-800",
      "bg-yellow-200 text-yellow-800",
      "bg-indigo-200 text-indigo-800",
    ];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${color}`}
      >
        {name ? name.charAt(0).toUpperCase() : "?"}
      </div>
    );
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
  // This slice correctly creates a new array with only the items for the current page
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Patients
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                {" "}
                {user && user.role === "admin"
                  ? "A comprehensive list of all registered patients."
                  : "View Your Parents"}
              </p>
            </div>
            {user && user.role === "admin" && (
              <Link
                to="/patients/new"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
              >
                <PlusIcon /> Add New Patient
              </Link>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-4 text-center p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 text-center p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm">
          {loading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : patients.length > 0 ? (
            <div>
              {/* --- Table Headers --- */}
              <div className="hidden sm:grid grid-cols-12 items-center gap-x-6 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="col-span-4 font-semibold text-sm text-slate-600 dark:text-slate-300">
                  Patient
                </div>
                <div className="col-span-3 font-semibold text-sm text-slate-600 dark:text-slate-300">
                  Diagnosis
                </div>
                <div className="col-span-2 font-semibold text-sm text-slate-600 dark:text-slate-300">
                  Age
                </div>
                <div className="col-span-3 font-semibold text-sm text-slate-600 dark:text-slate-300">
                  Last Visit
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {/* The .map function now correctly iterates over `currentPatients`, not the full `patients` array */}
                {currentPatients.map((p) => (
                  <div
                    key={p._id}
                    className="grid grid-cols-12 items-center gap-x-6 px-6 py-4 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    {/* --- Patient Name and Avatar (Mobile and Desktop) --- */}
                    <div className="col-span-12 sm:col-span-4 flex items-center gap-4">
                      <Avatar name={p.name} />
                      <div className="flex-grow">
                        <Link
                          to={`/patients/${p.pID}`}
                          className="font-bold text-md text-slate-800 dark:text-slate-100 hover:text-[#FE4982] dark:hover:text-[#FE4982] transition-colors"
                        >
                          {" "}
                          {p.name}{" "}
                        </Link>
                        {/* Diagnosis shown under name on mobile */}
                        <div className="text-sm text-slate-500 dark:text-slate-400 sm:hidden mt-1">
                          {p.diagnosis}
                        </div>
                      </div>
                    </div>

                    {/* --- Other details (Desktop only) --- */}
                    <div className="hidden sm:block col-span-3 text-slate-600 dark:text-slate-300">
                      {p.diagnosis}
                    </div>
                    <div className="hidden sm:block col-span-2 text-slate-600 dark:text-slate-300">
                      {p.age} years
                    </div>
                    <div className="hidden sm:block col-span-2 text-slate-600 dark:text-slate-300">
                      {new Date(p.lastVisit).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* --- Action Buttons --- */}
                    <div className="hidden sm:flex col-span-1 items-center justify-end gap-2 ml-auto sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.role === "admin" && (
                        <button
                          onClick={() => handleDeleteClick(p._id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 p-2 rounded-full hover:bg-red-100 dark:hover:bg-slate-700"
                          title="Delete Patient"
                        >
                          <TrashIcon />
                        </button>
                      )}
                      <Link
                        to={`/patients/${p.pID}`}
                        className="text-slate-500 hover:text-[#FE4982] dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="View Details"
                      >
                        <ChevronRightIcon />
                      </Link>
                    </div>

                    {/* Action buttons for mobile view */}
                    <div className="col-span-12 sm:hidden flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      {user.role === "admin" && (
                        <button
                          onClick={() => handleDeleteClick(p._id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg text-sm"
                          title="Delete Patient"
                        >
                          Delete
                        </button>
                      )}
                      <Link
                        to={`/patients/${p.pID}`}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm text-center"
                        title="View Details"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Pagination Controls --- */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {indexOfFirstPatient + 1}
                    </span>
                    -
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {Math.min(indexOfLastPatient, patients.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {patients.length}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeftIcon /> Previous
                    </button>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24">
              <span className="inline-block mx-auto text-slate-400 dark:text-slate-500">
                {" "}
                <UserGroupIcon />{" "}
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">
                {" "}
                No Patients Found{" "}
              </h3>
              <p className="mt-2 text-md text-slate-500 dark:text-slate-400">
                {" "}
                Get started by adding a new patient to the system.{" "}
              </p>
            </div>
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Patient Confirmation"
        modalRef={modalRef}
      >
        <p>
          Are you sure you want to delete this patient? This action is permanent
          and cannot be undone.
        </p>
      </ConfirmationModal>

      <Footer />
    </div>
  );
}
