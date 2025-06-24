import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- MOCK API SERVICES ---
const mockResources = [
  {
    _id: "res_1",
    title: "Heart-Healthy Eating Guide",
    category: "Nutrition",
    description:
      "A comprehensive guide to eating for a healthier heart, including recipes and meal plans.",
    link: "#",
  },
  {
    _id: "res_2",
    title: "Beginner's Guide to Mindfulness",
    category: "Mental Health",
    description:
      "Learn the basics of mindfulness meditation to reduce stress and improve focus.",
    link: "#",
  },
  {
    _id: "res_3",
    title: "Low-Impact Exercises for Seniors",
    category: "Exercise",
    description:
      "Safe and effective exercises designed to improve mobility and strength for seniors.",
    link: "#",
  },
  {
    _id: "res_4",
    title: "Understanding Your Blood Pressure",
    category: "Medical Info",
    description:
      "An article explaining what blood pressure numbers mean and how to manage them.",
    link: "#",
  },
  {
    _id: "res_5",
    title: "Sleep Hygiene Best Practices",
    category: "Wellness",
    description:
      "Tips and tricks to improve your sleep quality for better overall health.",
    link: "#",
  },
  {
    _id: "res_6",
    title: "Chair Yoga for All Ages",
    category: "Exercise",
    description:
      "A gentle yoga practice that can be done while seated, perfect for all mobility levels.",
    link: "#",
  },
];
const getResources = async (token) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { data: mockResources };
};

// --- PAGE ICONS ---
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
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
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M16 18.5a2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1 4 0Z" />
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

// --- Wellness Resources Page ---
export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getResources(token)
      .then((res) => setResources(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const CategoryBadge = ({ category }) => {
    const categoryStyles = {
      Nutrition:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      "Mental Health":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      Exercise:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
      "Medical Info":
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      Wellness:
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Wellness Resources
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            A curated library of articles, guides, and materials to support
            patient well-being.
          </p>
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
                  <div className="mb-3">
                    <CategoryBadge category={res.category} />
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
            <div className="col-span-full text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <BookHeartIcon className="mx-auto text-slate-400 dark:text-slate-500" />
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
    </div>
  );
}
