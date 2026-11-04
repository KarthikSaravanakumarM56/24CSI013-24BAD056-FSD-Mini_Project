import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentProfile } from './pages/StudentProfile';
import { SkillGapAnalyzer } from './pages/SkillGapAnalyzer';
import { JobListing } from './pages/JobListing';
import { JobDetail } from './pages/JobDetail';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { Courses } from './pages/Courses';
import { SkillAssessments } from './pages/SkillAssessments';
import { TakeAssessment } from './pages/TakeAssessment';
import { Mentors } from './pages/Mentors';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { AIResumeAnalyzer } from './pages/AIResumeAnalyzer';
import { AdminDashboard } from './pages/AdminDashboard';

// Landing Route: Sign In page is FIRST. If already logged in, redirect to Step 1 (/profile)
const LandingFirstRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Loading SkillBridge...</p>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  // Not logged in: Show Sign In page as the very first screen
  return <Login isFirstLanding={true} />;
};

// Login Route: If already logged in, redirect to /profile
const LoginRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/profile'} replace />;
  }
  return <Login />;
};

// Register Route: If already logged in, redirect to /profile
const RegisterRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/profile'} replace />;
  }
  return <Register />;
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50/60 via-slate-50 to-sky-50/40 text-slate-900 selection:bg-sky-500 selection:text-white">
            <Sidebar />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* First Screen: Sign In is First */}
                <Route path="/" element={<LandingFirstRoute />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/register" element={<RegisterRoute />} />

                {/* Optional Platform Overview / Problem Simulator */}
                <Route path="/overview" element={<Home />} />
                <Route path="/about" element={<Home />} />

                {/* Working Flow Steps: Step 1 to Step 7 */}

                {/* Step 1: Student Profile & Skills Setup */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Step 2: Skill-Gap Analysis */}
                <Route
                  path="/skill-gap"
                  element={
                    <ProtectedRoute>
                      <SkillGapAnalyzer />
                    </ProtectedRoute>
                  }
                />

                {/* Step 3: Skill Assessments & Quizzes / Courses */}
                <Route
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      <SkillAssessments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessments/:id"
                  element={
                    <ProtectedRoute>
                      <TakeAssessment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />

                {/* Step 4: ATS Resume Builder & AI Analyzer */}
                <Route
                  path="/resume-builder"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-resume"
                  element={
                    <ProtectedRoute>
                      <AIResumeAnalyzer />
                    </ProtectedRoute>
                  }
                />

                {/* Step 5: Job & Internship Matching */}
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <JobListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:id"
                  element={
                    <ProtectedRoute>
                      <JobDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Step 6: Application Tracker Pipeline */}
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <ApplicationTracker />
                    </ProtectedRoute>
                  }
                />

                {/* Step 7: Alumni Mentorship */}
                <Route
                  path="/mentors"
                  element={
                    <ProtectedRoute>
                      <Mentors />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Portal */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
