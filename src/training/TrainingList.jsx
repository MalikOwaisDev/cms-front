import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../hooks/useUser";
import { getTrainings, deleteTraining } from "../services/training";
import {
  ClockIcon,
  CheckCircleIcon,
  BookOpenIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BackIcon,
} from "../Icons";

const CardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
      >
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="mt-4 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 ml-auto"></div>
      </div>
    ))}
  </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-sans">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-in zoom-in-95 fade-in-0">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="h-6 w-6 text-red-600 dark:text-red-400">
              <AlertTriangleIcon size={24} />
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
            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-all shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Training List Page Component ---
export default function TrainingList() {
  document.title = "Trainings | Care Management System";
  const { data: user } = useUser();
  const [allTrainings, setAllTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTrainings(token);
        setAllTrainings(res.data);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <CardSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return user?.role === "admin" ? (
    <AdminTrainingView
      trainings={allTrainings}
      setTrainings={setAllTrainings}
      token={token}
      loading={loading}
    />
  ) : (
    <CaregiverTrainingView
      allTrainings={allTrainings}
      user={user}
      token={token}
      loading={loading}
    />
  );
}

// --- ADMIN VIEW COMPONENT ---
const AdminTrainingView = ({ trainings, setTrainings, token, loading }) => {
  const [filter, setFilter] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const navigate = useNavigate();
  const trainingsPerPage = 10;

  const today = new Date();
  const upcoming = trainings.filter(
    (t) => new Date(t.deadline).setHours(23, 59, 59, 999) >= today
  );
  const past = trainings.filter(
    (t) => new Date(t.deadline).setHours(23, 59, 59, 999) < today
  );

  const filteredTrainings = filter === "upcoming" ? upcoming : past;
  const totalPages = Math.ceil(filteredTrainings.length / trainingsPerPage);
  const currentTrainings = filteredTrainings.slice(
    (currentPage - 1) * trainingsPerPage,
    currentPage * trainingsPerPage
  );

  const handleDeleteClick = (id) => {
    setTrainingToDelete(id);
    setIsModalOpen(true);
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const confirmDelete = async () => {
    if (!trainingToDelete) return;
    try {
      await deleteTraining(trainingToDelete, token);
      const updatedList = trainings.filter((t) => t.tID !== trainingToDelete);
      setTrainings(updatedList);
      // After deleting, check if the current page is now empty and adjust
      const newTotalPages = Math.ceil(
        updatedList.filter((t) =>
          filter === "upcoming"
            ? new Date(t.deadline).setHours(23, 59, 59, 999) >= today
            : new Date(t.deadline).setHours(23, 59, 59, 999) < today
        ).length / trainingsPerPage
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    } catch (error) {
      console.error("Failed to delete training:", error);
    } finally {
      setIsModalOpen(false);
      setTrainingToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Manage Trainings
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Oversee all training modules for caregivers.
              </p>
            </div>
            <Link
              to="/trainings/create"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE4982] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#E03A6D] transition-all"
            >
              <PlusIcon /> Create New Training
            </Link>
          </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => {
              setFilter("upcoming");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "upcoming"
                ? "border-b-2 border-[#FE4982] text-[#FE4982]"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => {
              setFilter("past");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "past"
                ? "border-b-2 border-red-500 text-red-600"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Past Deadline ({past.length})
          </button>
        </div>

        {loading ? (
          <div className="p-4">
            <CardSkeleton />
          </div>
        ) : currentTrainings.length > 0 ? (
          <div className="space-y-4">
            {currentTrainings.map((t) => (
              <div
                key={t._id}
                className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-grow">
                    <h2 className="text-lg font-bold text-[#1D2056] dark:text-slate-100">
                      {t.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Deadline:{" "}
                      {new Date(t.deadline).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Assigned to: {t.assignedTo?.length || 0} caregivers
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/trainings/edit/${t.tID}`}
                      className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100"
                    >
                      <EditIcon size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(t.tID)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col text-center py-16 bg-white dark:bg-slate-800/50 rounded-xl">
            <span className="mx-auto text-slate-400 dark:text-slate-500">
              <BookOpenIcon size={48} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
              No trainings in this category.
            </h3>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(currentPage - 1) * trainingsPerPage + 1}
              </span>
              -
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {Math.min(
                  currentPage * trainingsPerPage,
                  filteredTrainings.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {filteredTrainings.length}
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
                Next <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Training"
      >
        <p>
          Are you sure you want to permanently delete this training module? This
          action cannot be undone.
        </p>
      </ConfirmationModal>
    </div>
  );
};

// --- CAREGIVER VIEW COMPONENT ---
const CaregiverTrainingView = ({ allTrainings, user, loading }) => {
  const [myTrainings, setMyTrainings] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const trainingsPerPage = 10;

  useEffect(() => {
    if (user) {
      setMyTrainings(
        allTrainings.filter((t) => t.training?.assignedTo?.includes(user._id))
      );
    }
  }, [allTrainings, user]);

  const StatusBadge = ({ status }) =>
    status === "completed" ? (
      <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
        <CheckCircleIcon /> Completed
      </div>
    ) : (
      <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
        <ClockIcon /> Pending
      </div>
    );
  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const filteredTrainings = myTrainings.filter((t) => t.status === filter);
  const totalPages = Math.ceil(filteredTrainings.length / trainingsPerPage);
  const currentTrainings = filteredTrainings.slice(
    (currentPage - 1) * trainingsPerPage,
    currentPage * trainingsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 -mt-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-300">
              <BackIcon />
            </span>
          </button>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              My Assigned Trainings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Complete these modules to stay up-to-date.
            </p>
          </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => {
              setFilter("pending");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "pending"
                ? "border-b-2 border-[#FE4982] text-[#FE4982]"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Pending ({myTrainings.filter((t) => t.status === "pending").length})
          </button>
          <button
            onClick={() => {
              setFilter("completed");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "completed"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Completed (
            {myTrainings.filter((t) => t.status === "completed").length})
          </button>
        </div>

        {loading ? (
          <div className="p-4">
            <CardSkeleton />
          </div>
        ) : currentTrainings.length > 0 ? (
          <div className="space-y-6">
            {currentTrainings.map((t) => {
              const isCompleted = t.status === "completed";
              const Wrapper = isCompleted ? "div" : Link;
              const wrapperProps = isCompleted
                ? {}
                : { to: `/trainings/view/${t.training.tID}/` };

              return (
                <Wrapper
                  key={t._id}
                  {...wrapperProps}
                  className={`block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 transition-all duration-300 ${
                    isCompleted
                      ? "border-green-500 hover:cursor-auto"
                      : "border-[#FE4982] hover:scale-[1.005] hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1D2056] dark:text-slate-100">
                        {t.training.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                        {t.training.content}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                        {isCompleted ? "Completed on: " : "Deadline: "}
                        <span className="font-semibold">
                          {new Date(
                            isCompleted ? t.dateCompleted : t.training.deadline
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0 pt-2 sm:pt-0">
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col text-center py-16 bg-white dark:bg-slate-800/50 rounded-xl">
            <span className="mx-auto text-slate-400 dark:text-slate-500">
              <BookOpenIcon size={48} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
              All Clear!
            </h3>
            <p className="mt-1 text-md text-slate-500 dark:text-slate-400">
              You have no {filter} trainings.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(currentPage - 1) * trainingsPerPage + 1}
              </span>
              -
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {Math.min(
                  currentPage * trainingsPerPage,
                  filteredTrainings.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {filteredTrainings.length}
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
                Next <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
