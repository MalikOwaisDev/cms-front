import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { register, logout } from "../services/auth";

// --- Self-contained SVG Icons ---
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
const MailIcon = () => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const LockIcon = () => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
const AlertCircleIcon = () => (
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
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);
const SunIcon = () => (
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
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);
const MoonIcon = () => (
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);
const KeyIcon = () => (
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
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

// --- Password Validator Component ---
const PasswordValidator = ({ validation }) => {
  const validationItems = [
    { rule: "length", text: "At least 8 characters" },
    { rule: "number", text: "At least one number (0-9)" },
    { rule: "symbol", text: "At least one symbol (!@#$...)" },
  ];
  return (
    <div className="space-y-2 mt-3">
      {validationItems.map((item) => (
        <p
          key={item.rule}
          className={`flex items-center text-sm transition-colors duration-300 ${
            validation[item.rule]
              ? "text-green-600 dark:text-green-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {validation[item.rule] ? (
            <span className="mr-2 flex-shrink-0">
              <CheckCircleIcon />
            </span>
          ) : (
            <span className="mr-2 flex-shrink-0">
              <XCircleIcon />
            </span>
          )}{" "}
          {item.text}
        </p>
      ))}
    </div>
  );
};

// --- Theme Toggle Button ---
const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
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

// --- Main Register Page Component ---
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "caregiver",
    otp: "",
  });
  const [avatarFile, setAvatarFile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    symbol: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const fileInputRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    return () => clearInterval(timerIntervalRef.current);
  }, []);

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
        navigate("/register");
        setIsMounted(true);
      }
    };

    reset();
  }, [navigate]);

  const startTimer = () => {
    setIsTimerActive(true);
    setTimer(60);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormComplete = formData.name && formData.email && formData.password;

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") validatePassword(value);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!isFormComplete || !isPasswordValid) {
      setError(
        "Please fill all details and ensure password is valid before sending OTP."
      );
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/send-otp`,
        {
          email: formData.email,
          name: formData.name,
        }
      );
      console.log(res);
      setOtpSent(true);
      startTimer();
    } catch (err) {
      setError("Failed to send OTP. Please try again.", err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setVerifyLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          otp: formData.otp,
          email: formData.email,
        }
      );
      console.log(res);
      setIsOtpVerified(true);
    } catch (err) {
      setError("Invalid OTP. Please try again.", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (avatarFile) data.append("avatar", avatarFile);

    try {
      const res = await register(data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      // Corrected navigation logic: redirect to a dedicated admin route
      if (user.role === "admin") {
        navigate("/"); // Example admin route
      } else {
        navigate("/"); // Redirect to user dashboard
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.errors?.map((error) => error.msg) ||
          err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans transition-colors duration-300">
      <ThemeToggle />
      <div
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-8">
          <img
            src="/logo2.png"
            alt="MindfulTrust Logo"
            className="mx-auto h-16 sm:h-20"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1D2056] dark:text-slate-100 mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            Join our community of care professionals.
          </p>

          {error && (
            <div
              className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center"
              role="alert"
            >
              <span className="mr-3 flex-shrink-0">
                <AlertCircleIcon />
              </span>
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-12 h-12 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <UserIcon />
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm font-semibold text-[#FE4982] hover:underline"
                  disabled={otpSent}
                >
                  Upload Photo
                </button>
              </div>
              <div className="relative">
                <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                  <UserIcon />
                </span>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
              </div>
              <div className="relative">
                <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
              </div>
              <div className="relative">
                <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                  <LockIcon />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
                <button
                  type="button"
                  className="absolute top-[70%] -translate-y-1/2 right-3 cursor-pointer text-slate-400 hover:text-[#1D2056] dark:hover:text-slate-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <PasswordValidator validation={passwordValidation} />
              <div className="my-4 relative">
                <select
                  name="role"
                  id="role"
                  className="w-full p-3 pr-10 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={otpSent}
                >
                  <option value="caregiver">Caregiver</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    className="w-4 h-4"
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

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !isFormComplete || !isPasswordValid}
                  className="w-full bg-slate-600 dark:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-slate-600 transition-all disabled:bg-opacity-60 disabled:cursor-not-allowed"
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </button>
              )}

              {otpSent && !isOtpVerified && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="relative">
                    <span className="absolute top-[77%] left-3 -translate-y-1/2 text-slate-400">
                      <KeyIcon />
                    </span>
                    <input
                      name="otp"
                      type="text"
                      placeholder="6-Digit OTP"
                      maxLength="6"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 tracking-[0.5em] text-center border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyLoading}
                      className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-opacity-60"
                    >
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isTimerActive}
                      className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isTimerActive ? `Resend (${timer}s)` : "Resend"}
                    </button>
                  </div>
                </div>
              )}

              {isOtpVerified && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE4982] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              )}
            </div>
          </form>

          <p className="text-sm mt-8 text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#FE4982] hover:underline"
            >
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
