import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, logout } from "../services/auth";
import { Helmet } from "react-helmet";
import "./styles/login.scss";

import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  SunIcon,
  MoonIcon,
} from "../Icons";

// --- Theme Toggle Button ---
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("theme"))
      return localStorage.getItem("theme");
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

// --- Main Login Page Component ---
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const reset = async () => {
      const token = localStorage.getItem("token");

      try {
        if (token !== undefined && token !== null) {
          localStorage.removeItem("token");
          await logout(token);
        }
      } catch (error) {
        // Optional: Log error in development only
        if (import.meta.env.MODE === "development") {
          console.error("Logout error:", error.response?.data || error.message);
        }
      } finally {
        navigate("/login");
        setIsMounted(true);
      }
    };

    reset();
  }, [navigate]);

  const isFormComplete = formData.email && formData.password;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      // Corrected navigation logic: redirect to a dedicated admin route
      if (user.role === "admin") {
        navigate("/"); // Example admin route
      } else {
        navigate("/"); // Redirect to user dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.errors?.map((error) => error.msg) ||
          err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);

      // setTimeout(() => {
      //   setError("");
      // }, 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {/* // UI Improvement: Added a subtle gradient background for more depth */}
      {/* UI Improvement: Added entry animations for the entire form */}
      <div className="lgn-hero">
        {/* <ThemeToggle /> */}
        <div className="frm-cnt">
          <div className="logo-cont">
            <img
              src="/logo3.png"
              alt="MindfulTrust Logo"
              className="mn-logo logo-light"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* <img
              src="/logo2.png"
              alt="MindfulTrust Logo"
              className="mn-logo-dark"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            /> */}
          </div>

          <div className="lgn-form-dv-cnt">
            <h2 className="lgn-form-head">Sign In</h2>
            {/* <p className="lgn-form-p-des">Welcome Back User!</p> */}

            {error && (
              <>
                {error && (
                  <div
                    className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center"
                    role="alert"
                  >
                    <span className="mr-3 flex-shrink-0">
                      <AlertCircleIcon size={20} />
                    </span>
                    <span className="block sm:inline text-sm">{error}</span>
                  </div>
                )}

                <div className="auth-error-flag" role="alert">
                  <AlertCircleIcon className="mr-3 flex-shrink-0" />
                  <span className="error-flag-txt">{error}</span>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} noValidate className="frm">
              <div className="input-controller-cnt">
                <div className="inpt-cont">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="inpt-fld"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inpt-cont">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="inpt-fld"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="eye-ico"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Reveal Password"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="frgt-txt-cnt">
                <Link to="/forgot-password" className="frgt-txt">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormComplete}
                className="mn-login-btn"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                  <> Login </>
                )}
              </button>
            </form>

            <p className="dnt-text">
              Don't have an account?{" "}
              <Link to="/register" className="dnt-lnk">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
