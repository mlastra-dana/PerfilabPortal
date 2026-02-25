import { createBrowserRouter, Navigate } from "react-router-dom";
import { AccessPage, LandingPage, LoginPage, NotFoundPage, TokenAccessPage } from "@/app/pages";
import { AdminAuditPage, AdminPatientsPage, AdminUploadsPage } from "@/features/admin/pages";
import {
  PatientClinicalDocumentsPage,
  PatientMedicalResultsPage,
  PatientOrdersExamsPage,
  PatientOverviewPage,
  PatientShareResultsPage,
} from "@/features/patient/pages";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/access", element: <AccessPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/r/:token", element: <TokenAccessPage /> },
  { path: "/results", element: <Navigate to="/results/overview" replace /> },
  { path: "/results/overview", element: <PatientOverviewPage /> },
  { path: "/results/labs", element: <PatientMedicalResultsPage /> },
  { path: "/results/orders", element: <PatientOrdersExamsPage /> },
  { path: "/results/clinical-docs", element: <PatientClinicalDocumentsPage /> },
  { path: "/results/share", element: <PatientShareResultsPage /> },
  { path: "/admin", element: <Navigate to="/admin/patients" replace /> },
  { path: "/admin/patients", element: <AdminPatientsPage /> },
  { path: "/admin/uploads", element: <AdminUploadsPage /> },
  { path: "/admin/audit", element: <AdminAuditPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
