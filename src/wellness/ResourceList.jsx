import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK API SERVICES (for demonstration) ---
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
  console.log(`Fetching resources with token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: mockResources };
};

// --- ICONS (Self-contained SVG components) ---
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

// --- Reusable Header/Footer ---
const Header = ({ user, onLogout }) => (
  <header className="bg-[#1D2056] text-white shadow-md">
    <div className="container mx-auto flex items-center justify-between p-4">
      <Link to="/" className="text-xl font-bold tracking-wider">
        CarePulse
      </Link>
      <button
        onClick={onLogout}
        className="text-sm font-semibold hover:opacity-80"
      >
        Logout
      </button>
    </div>
  </header>
);
const Footer = () => (
  <footer className="bg-slate-100 text-center p-4 mt-auto">
    <p className="text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarePulse
    </p>
  </footer>
);

// --- Loading Skeleton for Cards ---
const CardSkeleton = () => (
  <div className="animate-pulse bg-white p-6 rounded-xl shadow-sm space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 rounded"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="h-9 bg-slate-200 rounded-lg w-32 mt-2"></div>
  </div>
);

// --- Wellness Resources Page Component ---
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
    const categoryColors = {
      Nutrition: "bg-green-100 text-green-700",
      "Mental Health": "bg-blue-100 text-blue-700",
      Exercise: "bg-orange-100 text-orange-700",
      "Medical Info": "bg-purple-100 text-purple-700",
      Wellness: "bg-pink-100 text-pink-700",
      default: "bg-slate-100 text-slate-600",
    };
    const colors = categoryColors[category] || categoryColors.default;
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${colors}`}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header user={{ name: "Admin" }} onLogout={() => navigate("/login")} />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Wellness Resources
          </h1>
          <p className="text-slate-600 mt-1">
            A curated library of articles, guides, and materials to support
            patient well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
            : resources.map((res) => (
                <div
                  key={res._id}
                  className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-3">
                      <CategoryBadge category={res.category} />
                    </div>
                    <h2 className="text-lg font-bold text-[#1D2056]">
                      {res.title}
                    </h2>
                    <p className="text-slate-600 mt-2 text-sm flex-grow">
                      {res.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE4982] hover:underline"
                    >
                      Open Resource <ExternalLinkIcon />
                    </a>
                  </div>
                </div>
              ))}
          {!loading && resources.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm">
              <p className="text-slate-500">
                No wellness resources are available at the moment.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
