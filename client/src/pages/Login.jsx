import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export const Login = ({ isFirstLanding = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default redirect after login is Step 1 of the employability flow: /profile
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        // Proceed to Step 1: Profile & Skills setup
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'alumni') {
      setEmail('rahul@skillbridge.edu');
      setPassword('rahul123');
    } else if (role === 'student') {
      setEmail('student@skillbridge.edu');
      setPassword('password123');
    } else {
      setEmail('admin@skillbridge.edu');
      setPassword('admin123');
    }
    setError('');
  };

  const workflowStepsPreview = [
    { num: '1', title: 'Profile & Skills', desc: 'Current skills (React, JS, Mongo) & pass-out batch' },
    { num: '2', title: 'Skill Gap Analysis', desc: 'Detect missing skills (Node, Express, Docker)' },
    { num: '3', title: 'Assessments & Badges', desc: 'Verify skills with timed quizzes' },
    { num: '4', title: 'ATS Resume Builder', desc: 'Live ATS score & export templates' },
    { num: '5', title: 'Job Matching', desc: 'Apply to matching roles with 1-click' },
    { num: '6', title: 'Application Pipeline', desc: '5-stage tracking & Google Meet' },
    { num: '7', title: 'Alumni Mentorship', desc: '1-on-1 interview prep' },
  ];

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-sky-50/80 via-white to-sky-50/50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Project Overview & Employability Working Flow (Light Blue) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-600 text-white p-7 sm:p-9 rounded-3xl shadow-xl shadow-sky-300/30 flex flex-col justify-between border border-sky-300/40 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Project Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/25 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                Sem V Full Stack Course Project
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-sky-100 text-[11px] font-semibold border border-white/15">
                Alumni & Students
              </span>
            </div>

            {/* Title & Problem Statement */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/25">
                  <Compass className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Skill<span className="text-sky-200">Bridge</span>
                  </h1>
                  <p className="text-xs text-sky-100 font-bold tracking-wider uppercase">
                    Youth Employability Platform
                  </p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs leading-relaxed space-y-1.5">
                <p className="font-bold text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Problem Statement:
                </p>
                <p className="text-white/95 font-medium">
                  Students and college graduates have qualifications but lack the industry-demanded skills required for available jobs.
                </p>
              </div>
            </div>

            {/* The 7-Step Working Flow Preview */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-sky-100 tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-white" />
                Guided Working Flow (Step-by-Step):
              </p>

              <div className="space-y-1.5 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                {workflowStepsPreview.map((step) => (
                  <div key={step.num} className="flex items-center gap-2.5 text-xs py-1 px-2 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-white text-sky-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 shadow-xs">
                      {step.num}
                    </span>
                    <span className="font-bold text-white">{step.title}:</span>
                    <span className="text-sky-100 text-[11px] truncate">{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/20 space-y-2">
            <p className="text-[11px] font-bold text-sky-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> 1-Click Fast Viva Demo Credentials:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('alumni')}
                className="py-1.5 px-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-bold text-[11px] transition-all text-center truncate shadow-xs"
              >
                🎓 Alumni (2023)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="py-1.5 px-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-bold text-[11px] transition-all text-center truncate shadow-xs"
              >
                🎒 Student (2025)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="py-1.5 px-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-bold text-[11px] transition-all text-center truncate shadow-xs"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form & Google Sign In */}
        <div className="lg:col-span-6 bg-white p-7 sm:p-9 rounded-3xl border border-sky-100 shadow-xl shadow-sky-100/50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">
                First Step: Access Portal
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign In to SkillBridge
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to begin your step-by-step employability and skill verification journey.
              </p>
            </div>

            {/* Google Sign In Component */}
            <div className="space-y-3">
              <GoogleSignInButton label="Sign in with Google" redirectTo="/profile" />

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or sign in with email
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@skillbridge.edu"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-sky-300/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In & Continue to Step 1</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Links & Register Prompt */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              New college student or passed-out graduate?{' '}
              <Link to="/register" className="font-bold text-sky-500 hover:text-sky-600 underline underline-offset-2">
                Register Student Profile
              </Link>
            </p>

            <div>
              <Link 
                to="/overview" 
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-500 font-medium transition-colors"
              >
                <span>Preview Interactive Problem Statement Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
