import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, Sparkles, GraduationCap, ArrowRight, User } from 'lucide-react';

export const GoogleSignInButton = ({ label = "Sign in with Google", onSuccess, redirectTo = "/profile" }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showChooser, setShowChooser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Custom input state if user wants to enter their own Google email
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [studentStatus, setStudentStatus] = useState('Passed Out Graduate (Alumni)');
  const [gradYear, setGradYear] = useState('2024');

  const sampleGoogleAccounts = [
    {
      name: "Karthik R.",
      email: "karthik.alumni@gmail.com",
      status: "Passed Out Graduate (Alumni)",
      year: 2024,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      targetRole: "Full Stack Developer"
    },
    {
      name: "Sneha Reddy",
      email: "sneha.graduate@gmail.com",
      status: "Passed Out Graduate (Alumni)",
      year: 2023,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      targetRole: "Frontend Engineer"
    },
    {
      name: "Aarav Sharma",
      email: "student@skillbridge.edu",
      status: "Current Student (2026 Batch)",
      year: 2026,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
      targetRole: "Full Stack Developer"
    }
  ];

  const handleSelectGoogleAccount = async (account) => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        studentStatus: account.status,
        graduationYear: account.year,
        targetRole: account.targetRole || 'Full Stack Developer',
        college: 'National Institute of Engineering',
        googleId: `goog_${Date.now()}`
      });

      setShowChooser(false);
      if (onSuccess) onSuccess();
      else navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!customEmail) return;

    setLoading(true);
    setError('');
    try {
      const generatedName = customName || customEmail.split('@')[0];
      await loginWithGoogle({
        email: customEmail,
        name: generatedName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(generatedName)}&background=4285f4&color=fff`,
        studentStatus: studentStatus,
        graduationYear: parseInt(gradYear, 10),
        targetRole: 'Full Stack Developer',
        college: 'University Institute of Technology',
        googleId: `goog_${Date.now()}`
      });

      setShowChooser(false);
      if (onSuccess) onSuccess();
      else navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Official Google Button */}
      <button
        type="button"
        onClick={() => setShowChooser(true)}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400 hover:shadow flex items-center justify-center gap-3 group"
      >
        {/* SVG Google Multi-color G */}
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{label}</span>
      </button>

      {/* Interactive Google OAuth Dialog */}
      {showChooser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6">
            <button
              onClick={() => setShowChooser(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500">
                Choose an account to continue to <strong className="text-slate-800">SkillBridge</strong>
              </p>
            </div>

            {error && (
              <p className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold border border-rose-200">
                {error}
              </p>
            )}

            {/* Quick One-Click Google Profiles (Passed Out Graduates & Students) */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Instant Google Accounts (Alumni & Graduates)
              </p>
              {sampleGoogleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700">{acc.name}</p>
                      <p className="text-[11px] text-slate-500">{acc.email}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.2 text-[9px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {acc.status}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Custom Google Account Section */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Use Another Google Account:
              </p>

              <form onSubmit={handleCustomGoogleSignIn} className="space-y-2.5 text-xs">
                <input
                  type="email"
                  required
                  placeholder="your.name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[11px]"
                  >
                    <option value="Passed Out Graduate (Alumni)">Passed Out (Alumni)</option>
                    <option value="Current Student">Current Student</option>
                    <option value="Career Switcher / Job Seeker">Career Switcher</option>
                  </select>

                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[11px]"
                  >
                    <option value="2022">Batch 2022 (Passed Out)</option>
                    <option value="2023">Batch 2023 (Passed Out)</option>
                    <option value="2024">Batch 2024 (Passed Out)</option>
                    <option value="2025">Batch 2025 (Passed Out)</option>
                    <option value="2026">Batch 2026 (Final Year)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Authenticating...' : 'Continue with this Google Email →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
