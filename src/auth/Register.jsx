import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { register, logout } from "../services/auth";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  SunIcon,
  MoonIcon,
  KeyIcon,
} from "../Icons";

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
            src="/logo3.png"
            alt="MindfulTrust Logo"
            className="mx-auto h-16 sm:h-20 block dark:hidden"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <img
            src="/logo2.png"
            alt="MindfulTrust Logo"
            className="mx-auto h-16 sm:h-20 hidden dark:block"
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
                <AlertCircleIcon size={20} />
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
                      <UserIcon size={30} />
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
