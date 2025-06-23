import { Routes, Route, Navigate } from "react-router-dom";

// Authentication
import Login from "./auth/Login";
import Register from "./auth/Register";

// Dashboard
import Dashboard from "./Dashboard";

// Training
import TrainingList from "./training/TrainingList";
import TrainingForm from "./training/TrainingForm";
import TrainingHistory from "./training/TrainingHistory";

// Invoicing
import InvoiceList from "./invoices/InvoiceList";
import CreateInvoice from "./invoices/CreateInvoice";
import InvoiceDetails from "./invoices/InvoiceDetails";

// Time Tracking
import LogTime from "./timeLogs/LogTime";
import TimeLogList from "./timeLogs/TimeLogList";

// Wellness
import CarePlanForm from "./wellness/CarePlanForm";
import CarePlanList from "./wellness/CarePlanList";
import ResourceList from "./wellness/ResourceList";

// Patient (optional)
import PatientList from "./patients/ListPatients";
import PatientForm from "./patients/PatientForm";

// Fallback
import NotFound from "./NotFound";
// import Loader from "./Loader";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Training */}
      <Route path="/trainings" element={<TrainingList />} />
      <Route path="/trainings/create" element={<TrainingForm />} />
      <Route path="/trainings/history" element={<TrainingHistory />} />

      {/* Invoicing */}
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/invoices/create" element={<CreateInvoice />} />
      <Route path="/invoices/:id" element={<InvoiceDetails />} />

      {/* Time Logs */}
      <Route path="/timelogs" element={<TimeLogList />} />
      <Route path="/timelogs/log" element={<LogTime />} />

      {/* Wellness */}
      <Route path="/wellness/plans" element={<CarePlanList />} />
      <Route path="/wellness/plans/create" element={<CarePlanForm />} />
      <Route path="/wellness/resources" element={<ResourceList />} />

      {/* Patients (optional admin view) */}
      <Route path="/patients" element={<PatientList />} />
      <Route path="/patients/new" element={<PatientForm />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
