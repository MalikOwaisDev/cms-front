import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTimeLog, updateTimeLog } from "../services/timeLog";
import { getPatients } from "../services/patient";
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  SaveIcon,
  BackIcon,
} from "../Icons";

// --- Skeleton Loader for the Form ---
const FormSkeleton = () => (
  <div className="animate-pulse max-w-2xl mx-auto">
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-7">
      <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
      <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
        <div className="h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-12 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- Edit Time Log Page Component ---
export default function TimeLogEdit() {
  const { id } = useParams();
  document.title = `Edit Time Log | Care Management System`;
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const [timeLogRes, patientsRes] = await Promise.all([
          getTimeLog(id, token),
          getPatients(token),
        ]);

        const timeLogData = timeLogRes.data;
        setForm({
          patient: timeLogData.patient?._id || "",
          date: new Date(timeLogData.date).toISOString().split("T")[0],
          startTime: timeLogData.startTime,
          endTime: timeLogData.endTime,
          description: timeLogData.description,
        });
        setPatients(patientsRes.data);
      } catch (err) {
        setError("Failed to load time log data. Please try again.");
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

    const hoursText = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const minutesText =
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
    const connector = hours > 0 && minutes > 0 ? ", " : "";
    return { text: `${hoursText}${connector}${minutesText}` };
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
      setTimeout(() => navigate(`/timelogs`), 1500); // Redirect to list view
    } catch (err) {
      setError("Failed to update time log. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/timelogs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* RESPONSIVE: Header with responsive title and consistent spacing */}
          <div className="flex items-start gap-4 mb-8">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Edit Time Log
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Make changes to your submitted hours.
              </p>
            </div>
          </div>

          {loading ? (
            <FormSkeleton />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-6"
            >
              <div>
                <label
                  htmlFor="patient"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Patient
                </label>
                <div className="relative">
                  {/* RESPONSIVE: Vertically centered icon */}
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <UserIcon />
                  </span>
                  <select
                    id="patient"
                    name="patient"
                    value={form.patient}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3 appearance-none bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
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
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

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
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
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
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
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
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
              </div>

              {duration?.text && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-center text-sm font-semibold">
                  Total Duration: {duration.text}
                </div>
              )}

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Description of Work
                </label>
                <div className="relative">
                  <span className="absolute top-3.5 left-3 text-slate-400">
                    <EditIcon size={20} />
                  </span>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="e.g., Assisted with daily tasks, administered medication..."
                    rows="4"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">
                    {success}
                  </p>
                )}
                {/* RESPONSIVE: Buttons stack on mobile and have consistent styling */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="w-full sm:w-auto flex justify-center items-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-all disabled:bg-opacity-60"
                  >
                    {submitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <SaveIcon /> Update Log
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
