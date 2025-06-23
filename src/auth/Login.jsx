import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Icons for UI feedback
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // For entry animation

  useEffect(() => {
    // Trigger animations once the component is mounted
    setIsMounted(true);
  }, []);

  const isFormComplete = formData.email && formData.password;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      const { token, user } = res.data;

      localStorage.setItem("token", token);

      // Corrected navigation logic: redirect to a dedicated admin route
      if (user.role === "admin") {
        navigate("/admin/dashboard"); // Example admin route
      } else {
        navigate("/"); // Redirect to user dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // UI Improvement: Added a subtle gradient background for more depth
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D2056] to-[#111330] p-4 font-sans">
      {/* UI Improvement: Added entry animations for the entire form */}
      <div
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* UI Improvement: Added a subtle glow effect to the logo placeholder */}
        <div className="text-center mb-8">
          <div className="bg-white sm:w-108 w-52 px-2 h-18 sm:px-12 sm:h-24 rounded-md mx-auto flex items-center justify-center ">
            <img src="./logo2.png" alt="" />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
          {/* Responsive Improvement: Text size adjusts for smaller screens */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1D2056] mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-slate-500 mb-8">
            Sign in to continue to your dashboard.
          </p>

          {error && (
            // UI Improvement: Added an icon to the error message for clarity
            <div
              className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative mb-6 flex items-center"
              role="alert"
            >
              <FiAlertCircle className="text-red-600 mr-3 flex-shrink-0" />
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <FiMail className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982] transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982] transition-colors"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-slate-400 hover:text-[#1D2056]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
            </div>

            <div className="text-right my-6">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-slate-500 hover:text-[#FE4982] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormComplete}
              className="w-full bg-[#FE4982] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE4982] transition-all duration-300 ease-in-out disabled:bg-opacity-60 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <p className="text-sm mt-8 text-center text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#FE4982] hover:underline"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
