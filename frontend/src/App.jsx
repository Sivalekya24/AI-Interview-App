import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth-context'
import ProtectedRoute from './lib/protected-route'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import LandingPage from "./pages/LandingPage";
import CandidateLayout from './components/layout/CandidateLayout'
import CandidateDashboard from './pages/candidate/Dashboard'
import ResumeUpload from './pages/candidate/ResumeUpload'
import InterviewInstructions from './pages/candidate/InterviewInstructions'
import InterviewRoom from './pages/candidate/InterviewRoom'
import InterviewComplete from './pages/candidate/InterviewComplete'
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import RecruiterLayout from './components/layout/RecruiterLayout'
import RecruiterDashboard from './pages/recruiter/Dashboard'
import LiveProctoring from './pages/recruiter/LiveProctoring'
import InterviewList from './pages/recruiter/InterviewList'
import InterviewDetail from './pages/recruiter/InterviewDetail'
import Reports from './pages/recruiter/Reports'
import Violations from './pages/recruiter/Violations'
import UserManagement from './pages/recruiter/UserManagement'
import Downloads from './pages/recruiter/Downloads'
import LiveInterview from "./pages/recruiter/LiveInterview";
import ContactMessages from "./pages/recruiter/ContactMessages";
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
      </BrowserRouter>
    </AuthProvider>
  )
}
