import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createPatient, getCaregivers } from "../services/patient";

import {
  UserIcon,
  ActivityIcon,
  HashIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  SaveIcon,
  BackIcon,
} from "../Icons";

const getCarers = async (token) => {
  try {
    const res = await getCaregivers(token);

    return res.data; // Return caregiver data
  } catch (error) {
    // If it's a known error (404)
    if (error.response && error.response.status === 404) {
      throw new Error("No caregivers found.");
    }

    // If it's any other error (e.g., 500, network issue)
    throw new Error("Unable to fetch caregivers. Please try again later.");
  }
};

export default function PatientForm() {
  document.title = "New Patient | Care Management System";
  const navigate = useNavigate();
  const initialFormState = {
    name: "",
    age: "",
    gender: "Other",
    phone: "",
    email: "",
    diagnosis: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
    notes: "",
    caregiver: "", // Added caregiver to initial state
  };
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [caregivers, setCaregivers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCaregivers = async () => {
      try {
        const data = await getCarers(token);
        setCaregivers(data);
        setError(""); // clear any previous errors
      } catch (err) {
        // expected error messages (from your `getCaregivers`)
        setError(err.message || "Something went wrong.");
      }
    };

    fetchCaregivers();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, address: { ...form.address, [name]: value } });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.address.street ||
      !form.address.city ||
      !form.address.country
    ) {
      setError("Name and full address fields are required.");
      return;
    }

    setLoading(true);

    try {
      await createPatient(form, token);
      setSuccess("Patient registered successfully!");
      setForm(initialFormState);
      setTimeout(() => setSuccess(""), 2000);
      navigate("/patients");
    } catch (err) {
      setError(err.message); // Show real error message from backend
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/patients");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 -mt-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-slate-600 dark:text-slate-300">
                <BackIcon />
              </span>
            </button>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Register New Patient
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Enter the patient's comprehensive details below.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
          >
            {/* Personal Information */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Personal & Contact Info
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
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
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Eleanor Vance"
                      required
                      className="w-full pl-10 pr-4 text-slate-800 dark:text-slate-200 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    Age
                  </label>
                  <div className="relative">
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      <HashIcon />
                    </span>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="e.g., 68"
                      required
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none appearance-none focus:ring-2 focus:ring-[#FE4982]"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 top-6 right-3 flex items-center text-slate-400">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      <PhoneIcon />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(+92) 300-1234567"
                      required
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="patient@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Address Information */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Address
              </legend>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                >
                  Street Address
                </label>
                <div className="relative">
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    <MapPinIcon />
                  </span>
                  <input
                    id="street"
                    name="street"
                    value={form.address.street}
                    onChange={handleAddressChange}
                    placeholder="123 Oak Lane"
                    required
                    className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={form.address.city}
                    onChange={handleAddressChange}
                    placeholder="New York"
                    required
                    className="w-full px-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    State / Province
                  </label>
                  <input
                    id="state"
                    name="state"
                    value={form.address.state}
                    onChange={handleAddressChange}
                    placeholder="California"
                    className="w-full px-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={form.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5 after:font-bold"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    value={form.address.country}
                    onChange={handleAddressChange}
                    placeholder="United States"
                    required
                    className="w-full px-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Medical Information */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Medical & Admin
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="diagnosis"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Primary Diagnosis
                  </label>
                  <div className="relative">
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      <ActivityIcon />
                    </span>
                    <input
                      id="diagnosis"
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleChange}
                      placeholder="e.g., Hypertension"
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />
                  </div>
                </div>
                {/* --- NEW CAREGIVER FIELD --- */}
                <div className="relative">
                  <label
                    htmlFor="caregiver"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Assign Caregiver
                  </label>
                  <select
                    id="caregiver"
                    name="caregiver"
                    value={form.caregiver}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none appearance-none focus:ring-2 focus:ring-[#FE4982]"
                  >
                    <option value="" disabled>
                      Select a caregiver
                    </option>
                    {caregivers.map((caregiver) => (
                      <option key={caregiver._id} value={caregiver._id}>
                        {caregiver.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 top-6 right-3 flex items-center text-slate-400">
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
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any relevant notes about the patient's condition or preferences."
                  className="w-full px-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                ></textarea>
              </div>
            </fieldset>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
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
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-2 sm:px-6 px-2  rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] disabled:bg-opacity-60"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon /> Save Patient
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
