# CareerForge Frontend - Modern Full-Stack Job Portal Client

SaaS-grade, responsive user interface for **CareerForge**, built with React 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, and Axios.

---

## 🛠 Technology Stack

- **Framework**: React.js v18+, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **HTTP Client**: Axios (with JWT interceptors and error handling)
- **State & Context**: `AuthContext`, `ToastContext`

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── common/          # Reusable Navbar, Footer, Modal, Button, Badge, StatsCard, Pagination, LoadingSkeleton, EmptyState
│   │   └── jobs/            # JobCard, JobFilter, SearchBar, ApplicationModal
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication, active user state, and RBAC helpers
│   │   └── ToastContext.jsx # Toast notification alert system
│   ├── layouts/
│   │   ├── MainLayout.jsx   # Public layout with Navbar and Footer
│   │   └── DashboardLayout.jsx # Role-aware dashboard sidebar and header
│   ├── pages/
│   │   ├── auth/            # LoginPage (with 1-click Demo credentials), RegisterPage (Candidate/Employer)
│   │   ├── public/          # HomePage (Hero, categories, featured jobs), JobListingsPage (multi-filters, search, sort), JobDetailPage
│   │   ├── candidate/       # CandidateDashboard, MyApplicationsPage, SavedJobsPage, CandidateProfilePage
│   │   ├── employer/        # EmployerDashboard, ManageJobsPage, CreateJobPage, EditJobPage, JobApplicantsPage, EmployerProfilePage
│   │   └── admin/           # AdminDashboard, ManageUsersPage, ManageJobsAdminPage, ManageCategoriesPage, AuditLogsPage
│   ├── routes/
│   │   ├── AppRoutes.jsx    # Complete application route tree
│   │   └── ProtectedRoute.jsx # Role-based access barrier
│   ├── services/
│   │   └── api.js           # Axios instance configured with JWT injection
│   ├── utils/
│   │   └── formatters.js    # Date, salary, relative time, and class utilities
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
# Vite server will start on http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
# Compiles optimized HTML/CSS/JS in dist/ with zero errors
```