import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTraining, updateTraining } from "../services/training";
import { getCaregivers } from "../services/patient";
import {
  BookOpenIcon,
  AlignLeftIcon,
  CalendarIcon,
  SaveIcon,
  PlusIcon,
  TrashIcon,
  SearchXIcon,
  BackIcon,
} from "../Icons";

const getCarers = async (token) => {
  try {
    const res = await getCaregivers(token);
    return res.data; // Return caregiver data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("No caregivers found.");
    }
    throw new Error("Unable to fetch caregivers. Please try again later.");
  }
};

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
  document.title = `Edit ${id} Training | Care Management System`;
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
          getTraining(id, token),
          getCarers(token),
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
      setTimeout(() => {
        navigate("/trainings");
        setSuccess("");
      }, 2000);
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

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/trainings");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center flex-shrink">
            <button
              onClick={handleGoBack}
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
                    <BookOpenIcon size={20} />
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
                        <TrashIcon size={16} />
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
                              <TrashIcon size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm font-semibold text-[#FE4982] hover:text-[#E03A6D] flex items-center gap-1"
                      >
                        <PlusIcon size={16} />
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
                  <PlusIcon size={16} />
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
