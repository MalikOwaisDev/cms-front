import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getInvoiceById, updateInvoice } from "../services/invoice";
import {
  PlusIcon,
  TrashIcon,
  SaveIcon,
  BackIcon,
  AlertTriangleIcon,
} from "../Icons";

const InvoiceLoader = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <Header />
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-9 w-3/5 rounded-lg bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-5 w-4/5 rounded-lg bg-slate-200 dark:bg-slate-700 mt-3"></div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-pulse">
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 w-16 rounded bg-slate-300 dark:bg-slate-600"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-slate-300 dark:bg-slate-600"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-slate-300 dark:bg-slate-600"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {/* Services Skeleton */}
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-40 rounded-lg bg-slate-300 dark:bg-slate-600 border-b border-transparent pb-2"></div>
            {/* Fake service items */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center">
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center">
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center">
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-12 w-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="h-10 w-36 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Total and Button Skeleton */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="h-10 w-48 rounded-lg bg-slate-300 dark:bg-slate-600"></div>
            <div className="h-12 w-full sm:w-40 rounded-lg bg-slate-300 dark:bg-slate-600"></div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// --- *** NEW: INVOICE NOT FOUND COMPONENT *** ---
const InvoiceNotFound = ({ invoiceId }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
    <Header />
    <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
      <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-md">
        <div className="flex justify-center mb-4">
          <AlertTriangleIcon size={48} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Invoice Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          We couldn't find any invoice with the ID{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            #{invoiceId}
          </span>
          . It might have been deleted or the link may be incorrect.
        </p>
        <Link
          to="/invoices" // Or your dashboard route
          className="mt-6 inline-block bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#E03A6D] transition-colors"
        >
          Back to All Invoices
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

// --- Main Edit Invoice Page Component ---
export default function EditInvoice() {
  const { id } = useParams();
  document.title = `Edit ${id} Invoice | Care Management System`;
  const navigate = useNavigate();

  // Form state
  const [patientId, setPatientId] = useState("");
  const [services, setServices] = useState([{ description: "", amount: "" }]);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceExists, setInvoiceExists] = useState(true); // New state to track if invoice exists

  // Helper state
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceRes = await getInvoiceById(id, token);
        if (invoiceRes && invoiceRes.data) {
          const invoice = invoiceRes.data;
          setPatientId(invoice.patient);
          setServices(invoice.services);
          setInvoiceDate(invoice.issuedDate);
          setDueDate(invoice.dueDate);
          setInvoiceNumber(invoice.invID);
          setPatients(invoiceRes.data.patient);
          setInvoiceExists(true);
        } else {
          // Handle case where invoice is not found
          setInvoiceExists(false);
        }
      } catch (err) {
        setError("Could not fetch invoice data. Please try again.");
        setInvoiceExists(false); // Assume not found on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Handlers for services (Unchanged)
  const handleAddService = () =>
    setServices([...services, { description: "", amount: "" }]);

  const handleRemoveService = (index) =>
    setServices(services.filter((_, i) => i !== index));

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  // Memoized total amount (Unchanged)
  const totalAmount = useMemo(
    () => services.reduce((total, s) => total + (Number(s.amount) || 0), 0),
    [services]
  );

  // Handle form submission (Unchanged logic, updated button render)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (services.some((s) => !s.description || !s.amount)) {
      setError("Please fill all service details.");
      return;
    }
    setSaving(true);
    try {
      const invoiceData = {
        patient: patientId,
        services: services.map((s) => ({ ...s, amount: Number(s.amount) })),
        totalAmount: totalAmount,
        issueDate: invoiceDate,
        dueDate: dueDate,
      };
      await updateInvoice(id, invoiceData, token);
      setSuccess("Invoice Updated Sucessfully");
      setTimeout(() => {
        setSuccess("");
        navigate(`/invoices/${id}`);
      }, 2000);
    } catch (err) {
      setError("Failed to update invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <InvoiceLoader />;
  }

  if (!invoiceExists) {
    return <InvoiceNotFound invoiceId={invoiceNumber} />;
  }

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/invoices");
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center ">
            <div className="mb-6">
              <button
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  <BackIcon />
                </span>
              </button>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Edit Invoice #{invoiceNumber}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Update the details below for this invoice.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm"
          >
            {/* Form fields - Unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2 relative">
                <label
                  htmlFor="patient"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Patient
                </label>
                <select
                  id="patient"
                  value={patients._id}
                  disabled
                  className="w-full p-3 appearance-none bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    Select a patient
                  </option>
                  <option value="">{patients.name}</option>
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
              <div>
                <label
                  htmlFor="invoiceDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Issue Date
                </label>
                <input
                  type="date"
                  id="invoiceDate"
                  value={invoiceDate.split("T")[0]}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate.split("T")[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                />
              </div>
            </div>

            {/* Services section - Unchanged */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Services Rendered
              </h2>
              {services.map((service, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-center"
                >
                  <input
                    type="text"
                    placeholder="Service Description"
                    value={service.description}
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={service.amount}
                    onChange={(e) =>
                      handleServiceChange(index, "amount", e.target.value)
                    }
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE4982]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-red-500 hover:text-red-700 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center gap-2 text-[#1D2056] dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <PlusIcon /> Add Service Line
              </button>
            </div>

            {/* Total and Submit Button - Updated */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-medium text-slate-600 dark:text-slate-400">
                  Total:
                </span>
                <span className="text-3xl font-bold text-[#1D2056] dark:text-slate-100">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-[#FE4982] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E03A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:ring-offset-slate-900 focus:ring-[#FE4982] transition-all disabled:bg-opacity-60 disabled:cursor-wait"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon /> Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Error/Success Messages - Unchanged */}
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center mt-4">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center mt-4">
                {success}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
