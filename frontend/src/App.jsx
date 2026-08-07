import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth-context'
import ProtectedRoute from './lib/protected-route'
const LandingPage = lazy(() => import("./pages/LandingPage"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

const CandidateLayout = lazy(() => import("./components/layout/CandidateLayout"));
const CandidateDashboard = lazy(() => import("./pages/candidate/Dashboard"));
const ResumeUpload = lazy(() => import("./pages/candidate/ResumeUpload"));
const InterviewInstructions = lazy(() => import("./pages/candidate/InterviewInstructions"));
const InterviewRoom = lazy(() => import("./pages/candidate/InterviewRoom"));
const InterviewComplete = lazy(() => import("./pages/candidate/InterviewComplete"));

const RecruiterLayout = lazy(() => import("./components/layout/RecruiterLayout"));
const RecruiterDashboard = lazy(() => import("./pages/recruiter/Dashboard"));
const LiveProctoring = lazy(() => import("./pages/recruiter/LiveProctoring"));
const LiveInterview = lazy(() => import("./pages/recruiter/LiveInterview"));
const InterviewList = lazy(() => import("./pages/recruiter/InterviewList"));
const InterviewDetail = lazy(() => import("./pages/recruiter/InterviewDetail"));
const Reports = lazy(() => import("./pages/recruiter/Reports"));
const Violations = lazy(() => import("./pages/recruiter/Violations"));
const UserManagement = lazy(() => import("./pages/recruiter/UserManagement"));
const Downloads = lazy(() => import("./pages/recruiter/Downloads"));
const ContactMessages = lazy(() => import("./pages/recruiter/ContactMessages"));
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#12161f', color: '#e7eaf0', border: '1px solid #232935', fontSize: '13px' },
          }}
        />
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/reset-password"
    element={<ResetPassword />}
/>

          {/* Candidate area — interview room/instructions/complete are full-bleed, no shared chrome */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/candidate/instructions" element={<InterviewInstructions />} />
            <Route path="/candidate/interview" element={<InterviewRoom />} />
            <Route path="/candidate/complete" element={<InterviewComplete />} />
            <Route element={<CandidateLayout />}>
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate/resume" element={<ResumeUpload />} />
            </Route>
          </Route>

          {/* Recruiter area */}
          <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
            <Route element={<RecruiterLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/live" element={<LiveProctoring />} />
              <Route path="/recruiter/live/:interviewId" element={<LiveInterview />} />
              <Route path="/recruiter/interviews" element={<InterviewList />} />
              <Route path="/recruiter/interviews/:interviewId" element={<InterviewDetail />} />
              <Route path="/recruiter/reports" element={<Reports />} />
              <Route path="/recruiter/violations" element={<Violations />} />
              <Route path="/recruiter/users" element={<UserManagement />} />
              <Route path="/recruiter/downloads" element={<Downloads />} />
              <Route path="/recruiter/contact" element={<ContactMessages/>}/>
            </Route>
          </Route>
          

          <Route
    path="*"
    element={<Navigate to="/" replace />}
/>
        </Routes>
         </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
