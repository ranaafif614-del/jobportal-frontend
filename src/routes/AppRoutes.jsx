import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import JobListingsPage from '../pages/public/JobListingsPage';
import JobDetailPage from '../pages/public/JobDetailPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import MyApplicationsPage from '../pages/candidate/MyApplicationsPage';
import SavedJobsPage from '../pages/candidate/SavedJobsPage';
import CandidateProfilePage from '../pages/candidate/CandidateProfilePage';

// Employer Pages
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import ManageJobsPage from '../pages/employer/ManageJobsPage';
import CreateJobPage from '../pages/employer/CreateJobPage';
import EditJobPage from '../pages/employer/EditJobPage';
import JobApplicantsPage from '../pages/employer/JobApplicantsPage';
import EmployerProfilePage from '../pages/employer/EmployerProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageJobsAdminPage from '../pages/admin/ManageJobsAdminPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListingsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Candidate Protected Routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="profile" element={<CandidateProfilePage />} />
      </Route>

      {/* Employer Protected Routes */}
      <Route
        path="/employer"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="jobs/new" element={<CreateJobPage />} />
        <Route path="jobs/edit/:id" element={<EditJobPage />} />
        <Route path="applicants" element={<JobApplicantsPage />} />
        <Route path="profile" element={<EmployerProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="jobs" element={<ManageJobsAdminPage />} />
        <Route path="categories" element={<ManageCategoriesPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>
    </Routes>
  );
}