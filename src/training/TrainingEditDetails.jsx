import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const getTrainingDetails = async (id, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/trainings/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data };
};

const getCaregivers = async (token) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/patients/get-carers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data; // Return caregiver data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("No caregivers found.");
    }
    throw new Error("Unable to fetch caregivers. Please try again later.");
  }
};

const updateTraining = async (id, trainingData, token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/trainings/${id}`,
    trainingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

// --- ICONS ---
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
const BookOpenIcon = () => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const AlignLeftIcon = () => (
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
    <line x1="17" y1="10" x2="3" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="17" y1="18" x2="3" y2="18"></line>
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
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const SearchXIcon = () => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="14" y1="8" x2="8" y2="14"></line>
    <line x1="8" y1="8" x2="14" y2="14"></line>
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

// --- Skeleton Loader ---
const EditFormSkeleton = () => (
  <div className="animate-pulse space-y-10">
    <div className="space-y-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
    </div>
    <div className="space-y-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
    </div>
  </div>
);

export default function TrainingEditDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");

    const fetchData = async () => {
      try {
        setLoading(true);
        const [trainingRes, caregiversRes] = await Promise.all([
          getTrainingDetails(id, token),
          getCaregivers(token),
        ]);
        setForm(trainingRes.data);
        setCaregivers(caregiversRes);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Could not load training data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  // --- FORM STATE HANDLERS ---
  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleAssigneeChange = (e) => {
    const { value, checked } = e.target;
    const caregiverId = value;

    setForm((prev) => {
      let updatedAssignedTo;

      if (checked) {
        // Add the full object only if it's not already included
        if (!prev.assignedTo.some((a) => a._id === caregiverId)) {
          const caregiver = caregivers.find((c) => c._id === caregiverId);
          updatedAssignedTo = [...prev.assignedTo, caregiver];
        } else {
          updatedAssignedTo = prev.assignedTo;
        }
      } else {
        // Remove by matching _id
        updatedAssignedTo = prev.assignedTo.filter(
          (a) => a._id !== caregiverId
        );
      }

      return {
        ...prev,
        assignedTo: updatedAssignedTo,
      };
    });
  };

  // --- QUIZ STATE HANDLERS ---
  const addQuestion = () =>
    setForm((prev) => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        { question: "", options: ["", "", ""], correctAnswer: "" },
      ],
    }));
  const removeQuestion = (qIndex) =>
    setForm((prev) => ({
      ...prev,
      quiz: prev.quiz.filter((_, index) => index !== qIndex),
    }));
  const handleQuestionChange = (e, qIndex) => {
    const { value } = e.target;
    setForm((prev) => {
      const newQuiz = JSON.parse(JSON.stringify(prev.quiz));
      newQuiz[qIndex].question = value;
      return { ...prev, quiz: newQuiz };
    });
  };
  const addOption = (qIndex) => {
    setForm((prev) => {
      const newQuiz = JSON.parse(JSON.stringify(prev.quiz));
      newQuiz[qIndex].options.push("");
      return { ...prev, quiz: newQuiz };
    });
  };
  const removeOption = (qIndex, oIndex) => {
    setForm((prev) => {
      const newQuiz = JSON.parse(JSON.stringify(prev.quiz));
      if (newQuiz[qIndex].correctAnswer === newQuiz[qIndex].options[oIndex]) {
        newQuiz[qIndex].correctAnswer = "";
      }
      newQuiz[qIndex].options = newQuiz[qIndex].options.filter(
        (_, index) => index !== oIndex
      );
      return { ...prev, quiz: newQuiz };
    });
  };
  const handleOptionChange = (e, qIndex, oIndex) => {
    const { value } = e.target;
    setForm((prev) => {
      const newQuiz = JSON.parse(JSON.stringify(prev.quiz));
      newQuiz[qIndex].options[oIndex] = value;
      return { ...prev, quiz: newQuiz };
    });
  };
  const handleCorrectAnswerChange = (qIndex, optionValue) => {
    setForm((prev) => {
      const newQuiz = JSON.parse(JSON.stringify(prev.quiz));
      newQuiz[qIndex].correctAnswer = optionValue;
      return { ...prev, quiz: newQuiz };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validation logic from create form can be reused here...
    setLoading(true);
    try {
      await updateTraining(id, form, token);
      setSuccess("Training updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to update training. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <EditFormSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="max-w-xl w-full text-center">
            <div className="flex flex-col bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-md">
              <span className="mx-auto text-slate-400 dark:text-slate-500">
                <SearchXIcon />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
                Training Not Found
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Sorry, we couldn't find the training module you're looking for.
                It might have been moved or deleted.
              </p>
              <Link
                to="/trainings"
                className="mt-8 inline-block bg-[#FE4982] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#E03A6D] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 focus:ring-[#FE4982]"
              >
                Back to All Trainings
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center flex-shrink">
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
                Edit Training Module
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Update the module details, quiz, and assignments.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-10"
          >
            <fieldset className="space-y-6">
              <legend className="text-xl font-semibold text-[#1D2056] dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                Module Details
              </legend>
              <div>
                {" "}
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Training Title
                </label>{" "}
                <div className="relative">
                  {" "}
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <BookOpenIcon />
                  </span>{" "}
                  <input
                    id="title"
                    value={form.title}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
              <div>
                {" "}
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Content / Instructions
                </label>{" "}
                <div className="relative">
                  {" "}
                  <span className="absolute top-4 left-3 text-slate-400">
                    <AlignLeftIcon />
                  </span>{" "}
                  <textarea
                    id="content"
                    value={form.content}
                    onChange={handleFormChange}
                    rows="5"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  ></textarea>
                </div>
              </div>
              <div>
                {" "}
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Completion Deadline
                </label>{" "}
                <div className="relative">
                  {" "}
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </span>{" "}
                  <input
                    type="date"
                    id="deadline"
                    value={form.deadline ? form.deadline.split("T")[0] : ""}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xl font-semibold text-[#1D2056] dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                Quiz Builder
              </legend>
              <div className="space-y-6">
                {form.quiz.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor={`question-${qIndex}`}
                        className="block text-md font-semibold text-slate-800 dark:text-slate-200"
                      >
                        Question {qIndex + 1}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <input
                      id={`question-${qIndex}`}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                    <div className="space-y-3 pt-3">
                      <h4 className="font-semibold text-slate-600 dark:text-slate-300">
                        Options
                      </h4>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-answer-${qIndex}`}
                            checked={q.correctAnswer === opt}
                            onChange={() =>
                              handleCorrectAnswerChange(qIndex, opt)
                            }
                            className="h-4 w-4 text-[#FE4982] focus:ring-[#E03A6D]"
                          />
                          <input
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(e, qIndex, oIndex)
                            }
                            className="flex-grow p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FE4982]"
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-slate-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm font-semibold text-[#FE4982] hover:text-[#E03A6D] flex items-center gap-1"
                      >
                        <PlusIcon />
                        Add Option
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon />
                  Add Question
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xl font-semibold text-[#1D2056] dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                Assign to Caregivers ({form.assignedTo.length} selected)
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {caregivers?.map((c) => (
                  <label
                    key={c._id}
                    htmlFor={`caregiver-${c._id}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      form.assignedTo.map((id) => id._id).includes(c._id)
                        ? "bg-pink-100 dark:bg-pink-900/40 border-pink-600 ring-2 ring-pink-500"
                        : "bg-slate-100 dark:bg-slate-700 border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`caregiver-${c._id}`}
                      value={c._id}
                      checked={form.assignedTo
                        .map((id) => id._id)
                        .includes(c._id)}
                      onChange={handleAssigneeChange}
                      className="h-4 w-4 rounded text-[#FE4982] focus:ring-[#E03A6D]"
                    />
                    <span className="ml-3 font-medium text-slate-700 dark:text-slate-200">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center font-semibold">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center font-semibold">
                  {success}
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/trainings`)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] disabled:bg-opacity-60"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon />
                      Save Changes
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
