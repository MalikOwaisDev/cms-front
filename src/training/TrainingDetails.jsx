import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const submitQuizAndComplete = async (trainingId, token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/trainings/complete/${trainingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    data: { message: "Training completed successfully!", data: res.data },
  };
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
    width="24"
    height="24"
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
    {" "}
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>{" "}
    <line x1="16" y1="2" x2="16" y2="6"></line>{" "}
    <line x1="8" y1="2" x2="8" y2="6"></line>{" "}
    <line x1="3" y1="10" x2="21" y2="10"></line>{" "}
  </svg>
);
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>{" "}
    <polyline points="22 4 12 14.01 9 11.01"></polyline>{" "}
  </svg>
);
const XCircleIcon = () => (
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
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
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

// --- Skeleton Loader ---
const TrainingDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3 mb-4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3 mb-8"></div>
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mt-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TrainingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !id) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getTrainingDetails(id, token)
      .then((res) => setTraining(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token, navigate]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    training.quiz.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore((correctCount / training.quiz.length) * 100);
    setSubmitted(true);
  };

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    try {
      await submitQuizAndComplete(training._id, token);
      navigate("/trainings"); // Or wherever you list trainings
    } catch (error) {
      console.error("Failed to submit training", error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <TrainingDetailSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!training) {
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
    ); // Or a more styled 404 component
  }

  const allQuestionsAnswered =
    Object.keys(answers).length === training.quiz.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* --- Header --- */}
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
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-2">
                <CalendarIcon />
                <span>
                  Deadline:{" "}
                  {new Date(training.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {training.title}
              </h1>
            </div>
          </div>

          {/* --- Content Section --- */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold text-[#1D2056] dark:text-slate-200 flex items-center gap-3 mb-4">
              <BookOpenIcon /> Module Content
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {training.content}
            </p>
          </div>

          {/* --- Quiz Section --- */}
          {training.quiz && training.quiz.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-[#1D2056] dark:text-slate-200 mb-6">
                Quiz
              </h2>
              <div className="space-y-8">
                {training.quiz.map((q, index) => (
                  <div key={q._id}>
                    <p className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-4">
                      {index + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => {
                        const isSelected = answers[q._id] === option;
                        const isCorrect = q.correctAnswer === option;
                        let optionStyle =
                          "border-slate-300 dark:border-slate-600 hover:border-[#FE4982] dark:hover:border-[#FE4982]";
                        if (submitted) {
                          if (isCorrect)
                            optionStyle =
                              "border-green-500 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-500";
                          else if (isSelected && !isCorrect)
                            optionStyle =
                              "border-red-500 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500";
                        }

                        return (
                          <label
                            key={oIndex}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${optionStyle}`}
                          >
                            <input
                              type="radio"
                              name={q._id}
                              value={option}
                              onChange={(e) =>
                                handleAnswerChange(q._id, e.target.value)
                              }
                              disabled={submitted}
                              className="w-5 h-5 text-[#FE4982] focus:ring-[#E03A6D] disabled:opacity-50"
                            />
                            <span className="flex-grow text-slate-700 dark:text-slate-300">
                              {option}
                            </span>
                            {submitted && isCorrect && (
                              <span className="text-green-500">
                                <CheckCircleIcon />
                              </span>
                            )}
                            {submitted && isSelected && !isCorrect && (
                              <span className="text-red-500">
                                <XCircleIcon />
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!submitted ? (
                <div className="mt-8 text-right">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!allQuestionsAnswered}
                    className="bg-[#FE4982] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#E03A6D] transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <h3 className="text-2xl dark:text-slate-200 text-slate-800 font-bold">
                    Your Score:
                    <span
                      className={
                        score >= 80 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {" "}
                      {score.toFixed(0)}%
                    </span>
                  </h3>
                  {score >= 80 ? (
                    <>
                      <p className="text-green-600 dark:text-green-400 mt-2">
                        Congratulations! You have passed the quiz.
                      </p>
                      <button
                        onClick={handleMarkComplete}
                        disabled={isCompleting}
                        className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors disabled:bg-opacity-50"
                      >
                        {isCompleting
                          ? "Completing..."
                          : "Mark as Complete & Finish"}
                      </button>
                    </>
                  ) : (
                    <p className="text-red-600 dark:text-red-400 mt-2">
                      You did not pass the quiz. Please review the material and
                      try again.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
