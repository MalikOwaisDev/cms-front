import { Routes, Route, Navigate } from "react-router-dom";

// Authentication
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import AdminProtectWrapper from "./auth/AdminProtectWrapper";

// Dashboard
import Dashboard from "./Dashboard";
import ProfilePage from "./Profile";

// Training
import TrainingList from "./training/TrainingList";
import TrainingForm from "./training/TrainingForm";
import TrainingHistory from "./training/TrainingHistory";

// Invoicing
import InvoiceList from "./invoices/InvoiceList";
import CreateInvoice from "./invoices/CreateInvoice";
import InvoiceDetails from "./invoices/InvoiceDetails";
import EditInvoice from "./invoices/EditInvoice";

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
import PatientDetails from "./patients/PatientDetails";

// Fallback
import NotFound from "./NotFound";
import PatientEditPage from "./patients/PatientEditDetails";
import TrainingDetails from "./training/TrainingDetails";
import TrainingEditDetails from "./training/TrainingEditDetails";
import TimeLogView from "./timeLogs/TimeLogView";
import TimeLogEdit from "./timeLogs/TimeLogEdit";
import EditCarePlan from "./wellness/EditCarePlan";
import CreateResource from "./wellness/CreateResource";
// import Loader from "./Loader";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Training */}
      <Route path="/trainings" element={<TrainingList />} />
      <Route
        path="/trainings/create"
        element={
          <AdminProtectWrapper>
            <TrainingForm />
          </AdminProtectWrapper>
        }
      />
      <Route path="/trainings/history" element={<TrainingHistory />} />
      <Route path="/trainings/view/:id" element={<TrainingDetails />} />
      <Route
        path="/trainings/edit/:id"
        element={
          <AdminProtectWrapper>
            <TrainingEditDetails />
          </AdminProtectWrapper>
        }
      />

      {/* Invoicing */}
      <Route
        path="/invoices"
        element={
          <AdminProtectWrapper>
            <InvoiceList />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/invoices/create"
        element={
          <AdminProtectWrapper>
            <CreateInvoice />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/invoices/:id"
        element={
          <AdminProtectWrapper>
            <InvoiceDetails />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/invoices/edit/:id"
        element={
          <AdminProtectWrapper>
            <EditInvoice />
          </AdminProtectWrapper>
        }
      />

      {/* Time Logs */}
      <Route path="/timelogs" element={<TimeLogList />} />
      <Route path="/timelogs/log" element={<LogTime />} />
      <Route path="/timelogs/:id" element={<TimeLogView />} />
      <Route path="/timelogs/edit/:id" element={<TimeLogEdit />} />

      {/* Wellness */}
      <Route path="/wellness/plans" element={<CarePlanList />} />
      <Route path="/wellness/plans/:id" element={<EditCarePlan />} />
      <Route path="/wellness/plans/create" element={<CarePlanForm />} />
      <Route path="/wellness/resources" element={<ResourceList />} />
      <Route
        path="/wellness/resource/create"
        element={
          <AdminProtectWrapper>
            <CreateResource />
          </AdminProtectWrapper>
        }
      />

      {/* Patients (optional admin view) */}
      <Route path="/patients" element={<PatientList />} />

      <Route
        path="/patients/new"
        element={
          <AdminProtectWrapper>
            <PatientForm />
          </AdminProtectWrapper>
        }
      />
      <Route path="/patients/:id" element={<PatientDetails />} />

      <Route
        path="/patients/edit/:id"
        element={
          <AdminProtectWrapper>
            <PatientEditPage />
          </AdminProtectWrapper>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
