import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";

// --- PAGE ICONS ---
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
const CameraIcon = () => (
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
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
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

// --- Profile Page ---
export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  const updateUserProfile = async (data) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);

    return {
      data: {
        message: "Profile updated successfully!",
        user: {
          ...user,
          name: data.get("name"),
          avatar: avatarPreview || user.avatar,
        },
      },
    };
  };

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data); // Set user
      setFormData(res.data);
      setAvatarPreview(res.data.avatar); // Set preview
    };

    getUser().catch((err) => {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load profile data.");
    });
  }, [navigate]);

  // 💡 Watch for user change and update formData
  useEffect(() => {
    if (user && user.name) {
      setFormData({ name: user.name });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
    console.log(file);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const dataToUpdate = new FormData();
    dataToUpdate.append("name", formData.name);
    if (avatarFile) {
      dataToUpdate.append("avatar", avatarFile);
    }
    console.log(avatarFile);
    for (const [key, value] of dataToUpdate.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const res = await updateUserProfile(dataToUpdate);
      setUser(res.data.user); // Update user state with new data
      setSuccess(res.data.message);
      setIsEditMode(false);
    } catch (err) {
      setError("Failed to update profile.", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      // This is the main full-screen container with theme-aware background
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Animated SVG Spinner */}
          <svg
            className="animate-spin h-10 w-10 text-[#FE4982]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          {/* Styled Loading Text */}
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
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
                My Profile
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View and manage your personal information.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                {avatarPreview && avatarPreview !== "" ? (
                  <img
                    src={avatarPreview}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md"
                  />
                ) : (
                  <span className=" flex items-center justify-center w-32 h-32 text-3xl font-bold text-white capitalize rounded-full object-cover border-4 border-white dark:border-slate-700 bg-[#E5447D] shadow-md ">
                    {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                  </span>
                )}

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 bg-white dark:bg-slate-600 p-2 rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-500 shadow-md transition-colors"
                  >
                    <CameraIcon />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Info/Form Section */}
              <div className="w-full">
                {!isEditMode ? (
                  // --- DISPLAY MODE ---
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {user.name}
                        </h2>
                        <p className="text-md text-slate-500 dark:text-slate-400">
                          {user.role}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="text-sm font-semibold text-[#FE4982] hover:underline"
                      >
                        Edit Profile
                      </button>
                    </div>
                    <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Email address
                          </dt>
                          <dd className="mt-1 text-md text-slate-900 dark:text-slate-200">
                            {user.email}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ) : (
                  // --- EDIT MODE ---
                  <form onSubmit={handleSaveChanges} className="w-full">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                          >
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                              <UserIcon />
                            </span>
                            <input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              className="w-full pl-10 pr-4 py-3 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                            />
                          </div>
                        </div>
                      </div>
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
                      <div className="flex justify-end gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#FE4982] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] transition-all disabled:bg-opacity-60"
                        >
                          {loading ? (
                            "Saving..."
                          ) : (
                            <>
                              <SaveIcon /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
