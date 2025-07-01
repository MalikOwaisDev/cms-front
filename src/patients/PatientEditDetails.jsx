import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams, NavLink } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const getPatientById = async (id, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/patients/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return { data: res.data || {} };
};

// --- DELETE PATIENT FUNCTION ---
const deletePatient = async (id, token) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/patients/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const getCaregivers = async (token) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/patients/get-carers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data; // Return caregiver data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("No caregivers found.");
    }
    throw new Error("Unable to fetch caregivers. Please try again later.");
  }
};

const updatePatientProfile = async (id, data, token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/patients/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure the correct content type for FormData
      },
    }
  );
  return res.data;
};

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
    {" "}
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>{" "}
    <circle cx="12" cy="7" r="4"></circle>{" "}
  </svg>
);
const ActivityIcon = () => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>{" "}
  </svg>
);
const HashIcon = () => (
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
    <line x1="4" y1="9" x2="20" y2="9"></line>{" "}
    <line x1="4" y1="15" x2="20" y2="15"></line>{" "}
    <line x1="10" y1="3" x2="8" y2="21"></line>{" "}
    <line x1="16" y1="3" x2="14" y2="21"></line>{" "}
  </svg>
);
const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>{" "}
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
    {" "}
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>{" "}
    <polyline points="22,6 12,13 2,6"></polyline>{" "}
  </svg>
);
const MapPinIcon = () => (
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
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />{" "}
    <circle cx="12" cy="10" r="3" />{" "}
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
    {" "}
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>{" "}
    <polyline points="17 21 17 13 7 13 7 21"></polyline>{" "}
    <polyline points="7 3 7 8 15 8"></polyline>{" "}
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
const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>{" "}
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>{" "}
  </svg>
);
const AlertTriangleIcon = () => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// --- CONFIRMATION MODAL COMPONENT ---
const ConfirmationModal = ({
  isOpen,
  modalRef,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center font-sans">
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md m-4"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="h-6 w-6 text-red-600 dark:text-red-400">
              <AlertTriangleIcon />
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {children}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Patient
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SKELETON LOADER ---
const FormSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex items-center gap-6">
      {" "}
      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700"></div>{" "}
      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>{" "}
    </div>{" "}
    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>{" "}
    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>{" "}
    <div className="flex justify-end h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg ml-auto"></div>
  </div>
);

// --- Edit Patient Page Component ---
export default function PatientEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    diagnosis: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
    notes: "",
    assignedCaregiver: null,
    invoices: [],
  });
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const token = localStorage.getItem("token");
  const modalRef = useRef(null); // Ref for modal element

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (!id || !token) {
      navigate("/login");
      return;
    }
    const fetchCaregivers = async () => {
      try {
        const data = await getCaregivers(token);
        setCaregivers(data);
        setError("");
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await getPatientById(id, token);
        const patientData = response.data;
        setFormData({
          ...patientData,
          assignedCaregiver:
            patientData.assignedCaregiver?._id ||
            patientData.assignedCaregiver ||
            "",
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
    };

    if (id && token) {
      fetchPatient();
    } else {
      navigate("/patients");
    }
    fetchUser();
    fetchCaregivers();
  }, [id, token, navigate]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddressChange = (e) =>
    setFormData({
      ...formData,
      address: { ...formData.address, [e.target.name]: e.target.value },
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const dataToUpdate = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        Object.keys(formData.address).forEach((addrKey) => {
          dataToUpdate.append(`address[${addrKey}]`, formData.address[addrKey]);
        });
      } else {
        dataToUpdate.append(key, formData[key]);
      }
    });

    try {
      await updatePatientProfile(id, dataToUpdate, token);
      setSuccess("Patient updated successfully!");
      setTimeout(() => navigate(`/patients/${id}`), 1000);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsModalOpen(false); // Close modal first
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await deletePatient(id, token);
      setSuccess("Patient deleted successfully!");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err) {
      setError("Failed to delete patient.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData.name)
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto p-8">
          <FormSkeleton />
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  <BackIcon />
                </span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Edit Patient Profile
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Update {formData.name}'s information below.
                </p>
              </div>
            </div>
            {user && user.role === "admin" && (
              <button
                onClick={() => setIsModalOpen(true)} // Open modal on click
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-opacity-60"
              >
                <TrashIcon />
                Delete
              </button>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
          >
            <div className="flex items-center gap-6">
              <span className=" flex items-center justify-center w-32 h-32 text-5xl font-bold text-white capitalize rounded-full object-cover border-4 border-white dark:border-slate-700 bg-[#E5447D] shadow-md ">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "M"}
              </span>
            </div>

            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                Personal & Contact
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Full Name{" "}
                  </label>
                  <div className="relative">
                    {" "}
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      {" "}
                      <UserIcon />{" "}
                    </span>{" "}
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />{" "}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Age{" "}
                  </label>
                  <div className="relative">
                    {" "}
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      {" "}
                      <HashIcon />{" "}
                    </span>{" "}
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />{" "}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Gender{" "}
                  </label>
                  <div className="relative">
                    {" "}
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 appearance-none bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    >
                      {" "}
                      <option>Male</option> <option>Female</option>{" "}
                      <option>Other</option>{" "}
                    </select>{" "}
                    <div className="pointer-events-none absolute inset-y-0 top-1 right-3 flex items-center text-slate-400">
                      {" "}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />{" "}
                      </svg>{" "}
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Phone{" "}
                  </label>
                  <div className="relative">
                    {" "}
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      {" "}
                      <PhoneIcon />{" "}
                    </span>{" "}
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />{" "}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Email{" "}
                  </label>
                  <div className="relative">
                    {" "}
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      {" "}
                      <MailIcon />{" "}
                    </span>{" "}
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />{" "}
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                {" "}
                Address{" "}
              </legend>
              <div>
                {" "}
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  {" "}
                  Street Address{" "}
                </label>{" "}
                <div className="relative">
                  {" "}
                  <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                    {" "}
                    <MapPinIcon />{" "}
                  </span>{" "}
                  <input
                    id="street"
                    name="street"
                    value={formData?.address?.street}
                    onChange={handleAddressChange}
                    className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />{" "}
                </div>{" "}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  {" "}
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    City{" "}
                  </label>{" "}
                  <input
                    id="city"
                    name="city"
                    value={formData?.address?.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />{" "}
                </div>
                <div>
                  {" "}
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    State / Province{" "}
                  </label>{" "}
                  <input
                    id="state"
                    name="state"
                    value={formData?.address?.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />{" "}
                </div>
                <div>
                  {" "}
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Postal Code{" "}
                  </label>{" "}
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={formData?.address?.postalCode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />{" "}
                </div>
                <div>
                  {" "}
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Country{" "}
                  </label>{" "}
                  <input
                    id="country"
                    name="country"
                    value={formData?.address?.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />{" "}
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-[#1D2056] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                {" "}
                Medical & Admin{" "}
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {" "}
                  <label
                    htmlFor="diagnosis"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Primary Diagnosis{" "}
                  </label>{" "}
                  <div className="relative">
                    {" "}
                    <span className="absolute top-[70%] left-3 -translate-y-1/2 text-slate-400">
                      {" "}
                      <ActivityIcon />{" "}
                    </span>{" "}
                    <input
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    />{" "}
                  </div>{" "}
                </div>
                <div>
                  {" "}
                  <label
                    htmlFor="assignedCaregiver"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    {" "}
                    Assigned Caregiver{" "}
                  </label>{" "}
                  <div className="relative">
                    {" "}
                    <select
                      id="assignedCaregiver"
                      name="assignedCaregiver"
                      value={formData.assignedCaregiver}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                    >
                      {" "}
                      <option value="" disabled>
                        {" "}
                        Select a caregiver{" "}
                      </option>{" "}
                      {caregivers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {" "}
                          {c.name}{" "}
                        </option>
                      ))}{" "}
                    </select>{" "}
                    <div className="pointer-events-none absolute inset-y-0 top-1 right-3 flex items-center text-slate-400">
                      {" "}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />{" "}
                      </svg>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              </div>
              <div>
                {" "}
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  {" "}
                  Additional Notes{" "}
                </label>{" "}
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any relevant notes about the patient's condition or preferences."
                  className="w-full px-4 py-3 bg-slate-100 text-slate-800 dark:text-slate-200 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                ></textarea>{" "}
              </div>
            </fieldset>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center">
                  {" "}
                  {error}{" "}
                </p>
              )}
              {success && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center">
                  {" "}
                  {success}{" "}
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/patients/${id}`)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-2 sm:px-6 px-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] disabled:bg-opacity-60"
                >
                  {" "}
                  {loading && !success ? (
                    "Saving..."
                  ) : (
                    <>
                      {" "}
                      <SaveIcon /> Save Changes{" "}
                    </>
                  )}{" "}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Patient"
        modalRef={modalRef}
      >
        <p>
          Are you sure you want to delete this patient? This action cannot be
          undone and will permanently remove their data.
        </p>
      </ConfirmationModal>
      <Footer />
    </div>
  );
}
