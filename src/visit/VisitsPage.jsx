import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header"; // Assuming Header.js is in the right place
import Footer from "../components/Footer";
import { PlusIcon } from "../Icons"; // Assuming Icons.js is in the right place

// A simple loading spinner component
const Spinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#FE4982] rounded-full animate-spin"></div>
  </div>
);

// Component for the status badge
const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-3 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap";
  let statusClasses = "";

  switch (status) {
    case "scheduled":
      statusClasses =
        "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      break;
    case "completed":
      statusClasses =
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      break;
    case "in_progress":
      statusClasses =
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      break;
    default:
      statusClasses =
        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
  }

  return (
    <span className={`${baseClasses} ${statusClasses}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default function VisitsPage() {
  document.title = "Manage Visits | Care Management System";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State management
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("scheduled");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchVisits = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:4000/api/visits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisits(res.data.visits || []);
      } catch (err) {
        setError("Could not load visits. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [token, navigate]);

  // Derived state for filtering and pagination (No changes here)
  const filteredVisits = visits.filter((visit) => {
    if (activeTab === "completed") {
      return visit.status === "completed";
    }
    return visit.status === "scheduled" || visit.status === "in_progress";
  });

  const totalPages = Math.ceil(filteredVisits.length / ITEMS_PER_PAGE);
  const paginatedVisits = filteredVisits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeString) =>
    new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString(
      {},
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header and Tabs (No changes here) */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Manage Visits
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View, track, and schedule all patient visits.
              </p>
            </div>
            <Link
              to="/visits/create"
              className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-colors"
            >
              <PlusIcon />
              Schedule New Visit
            </Link>
          </div>
          <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => handleTabClick("scheduled")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "scheduled"
                    ? "border-b-2 border-[#FE4982] text-[#FE4982]"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Scheduled & In Progress
              </button>
              <button
                onClick={() => handleTabClick("completed")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "completed"
                    ? "border-b-2 border-[#FE4982] text-[#FE4982]"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Completed
              </button>
            </nav>
          </div>

          {/* --- Responsive Visits Display --- */}
          <div>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/50 rounded-lg">
                {error}
              </div>
            ) : paginatedVisits.length > 0 ? (
              <>
                {/* == DESKTOP & TABLET VIEW: TABLE == */}
                <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Patient
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Caregiver
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedVisits.map((visit) => (
                        <tr
                          key={visit._id}
                          className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {visit.patient?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {visit.caregiver?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(visit.date)}
                          </td>
                          <td className="px-6 py-4">{`${formatTime(
                            visit.startTime
                          )} - ${formatTime(visit.endTime)}`}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={visit.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/visits/view/${visit._id}`}
                              className="font-medium text-[#FE4982] hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* == MOBILE VIEW: CARDS == */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedVisits.map((visit) => (
                    <div
                      key={visit._id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white pr-2">
                          {visit.patient?.name || "N/A"}
                        </h3>
                        <StatusBadge status={visit.status} />
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                        <p>
                          <strong>Caregiver:</strong>{" "}
                          {visit.caregiver?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(visit.date)}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {`${formatTime(visit.startTime)} - ${formatTime(
                            visit.endTime
                          )}`}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
                        <Link
                          to={`/visits/view/${visit._id}`}
                          className="font-medium text-[#FE4982] hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                No {activeTab} visits found.
              </div>
            )}
          </div>

          {/* Pagination Controls (No changes here) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
