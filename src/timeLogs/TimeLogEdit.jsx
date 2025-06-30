import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

// --- ICONS (Reused for consistency) ---
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
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
const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const SaveIcon = () => (
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
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
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

// --- API Calls ---
const getTimeLog = (id, token) =>
  axios.get(`${import.meta.env.VITE_API_URL}/api/time-logs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
const getPatients = (token) =>
  axios.get(`${import.meta.env.VITE_API_URL}/api/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
const updateTimeLog = (id, logData, token) =>
  axios.put(`${import.meta.env.VITE_API_URL}/api/time-logs/${id}`, logData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Edit Time Log Page Component ---
export default function TimeLogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [loading, setLoading] = useState(true); // For initial data load
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch both the time log and the patient list at the same time
        const [timeLogRes, patientsRes] = await Promise.all([
          getTimeLog(id, token),
          getPatients(token),
        ]);

        const timeLogData = timeLogRes.data;

        // Pre-populate the form with fetched data
        setForm({
          patient: timeLogData.patient?._id || "",
          // The date input requires 'YYYY-MM-DD' format
          date: new Date(timeLogData.date).toISOString().split("T")[0],
          startTime: timeLogData.startTime,
          endTime: timeLogData.endTime,
          description: timeLogData.description,
        });

        setPatients(patientsRes.data);
      } catch (err) {
        setError("Failed to load time log data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const duration = useMemo(() => {
    if (!form.startTime || !form.endTime) return null;
    const start = new Date(`1970-01-01T${form.startTime}`);
    const end = new Date(`1970-01-01T${form.endTime}`);
    if (end <= start) return { error: "End time must be after start time" };

    let diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));

    return { text: `${hours} hour(s), ${minutes} minute(s)` };
  }, [form.startTime, form.endTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !form.patient ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.description
    ) {
      setError("Please fill out all fields to submit the log.");
      return;
    }
    if (duration?.error) {
      setError(duration.error);
      return;
    }
    setSubmitting(true);
    try {
      await updateTimeLog(id, { ...form, duration: duration?.text }, token);
      setSuccess("Time log updated successfully!");
      setTimeout(() => navigate(`/timelogs/${id}`), 2000);
    } catch (err) {
      setError("Failed to update time log. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 -mt-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Edit Time Log
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Make changes to your submitted hours.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-6"
          >
            {/* --- Patient Select --- */}
            <div>
              <label
                htmlFor="patient"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Patient
              </label>
              <div className="relative">
                <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                  <UserIcon />
                </span>
                <select
                  id="patient"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 appearance-none bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                >
                  <option value="" disabled>
                    Select a patient
                  </option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {/* ... other JSX for dropdown arrow ... */}
              </div>
            </div>

            {/* --- Date, Start Time, End Time Inputs --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Date
                </label>
                <div className="relative">
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </span>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Start Time
                </label>
                <div className="relative">
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <ClockIcon />
                  </span>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  End Time
                </label>
                <div className="relative">
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <ClockIcon />
                  </span>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </div>

            {/* --- Duration Display --- */}
            {duration?.text && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[#1D2056] dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-center font-semibold">
                Total Duration: {duration.text}
              </div>
            )}

            {/* --- Description Textarea --- */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Description of Work
              </label>
              <div className="relative">
                <span className="absolute top-4 left-3 text-slate-400">
                  <EditIcon />
                </span>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g., Assisted with daily tasks, administered medication..."
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                ></textarea>
              </div>
            </div>

            {/* --- Buttons and Messages --- */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center">
                  {success}
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:ring-offset-slate-900 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60"
                >
                  {submitting ? (
                    "Saving..."
                  ) : (
                    <>
                      {" "}
                      <SaveIcon /> Update Log{" "}
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
