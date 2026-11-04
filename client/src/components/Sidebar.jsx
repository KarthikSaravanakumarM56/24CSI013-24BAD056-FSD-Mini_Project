import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { 
  User, 
  Target, 
  Award, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  Users, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Compass, 
  LogOut,
  ChevronRight,
  Menu,
  GraduationCap
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isOpen, closeSidebar, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidebar]);

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  const workflowSteps = [
    {
      step: 1,
      title: 'Profile & Skills',
      subtitle: 'Education, status & skills',
      path: '/profile',
      icon: User
    },
    {
      step: 2,
      title: 'Skill-Gap Analyzer',
      subtitle: 'Target role vs acquired skills',
      path: '/skill-gap',
      icon: Target
    },
    {
      step: 3,
      title: 'Skill Assessments',
      subtitle: 'Timed quizzes & verified badges',
      path: '/assessments',
      icon: Award
    },
    {
      step: 4,
      title: 'ATS Resume Builder',
      subtitle: 'Live ATS score & templates',
      path: '/resume-builder',
      icon: FileText
    },
    {
      step: 5,
      title: 'Job & Internship Matching',
      subtitle: 'Roles matching your skills',
      path: '/jobs',
      icon: Briefcase
    },
    {
      step: 6,
      title: 'Application Tracker',
      subtitle: '5-stage interview pipeline',
      path: '/applications',
      icon: CheckSquare
    },
    {
      step: 7,
      title: 'Alumni Mentorship',
      subtitle: '1-on-1 industry guidance',
      path: '/mentors',
      icon: Users
    }
  ];

  const additionalTools = [
    {
      title: 'Recommended Courses',
      subtitle: 'Target missing skills',
      path: '/courses',
      icon: BookOpen
    },
    {
      title: 'AI Resume ATS Analyzer',
      subtitle: 'Audit keywords & scoring',
      path: '/ai-resume',
      icon: Sparkles
    },
    {
      title: 'Platform Overview & Simulator',
      subtitle: 'Problem statement & stats',
      path: '/overview',
      icon: Compass
    }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 sm:w-88 bg-white border-r border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="Pages Navigation Sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-sky-100/50 to-cyan-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Skill<span className="text-sky-500">Bridge</span>
              </span>
              <p className="text-[10px] font-bold text-sky-600 tracking-wider uppercase">
                Pages Navigation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
            title="Close sidebar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card if logged in */}
        {user && (
          <div className="p-4 bg-sky-50/70 border-b border-sky-100/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200 truncate">
                  {user.studentStatus || 'Student'}
                </span>
                {user.graduationYear && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    '{String(user.graduationYear).slice(-2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Working Flow (Steps 1 to 7) */}
          <div className="space-y-1.5">
            <div className="px-2 pb-1 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Working Flow (Steps 1–7)
              </span>
              <span className="text-[10px] font-bold text-slate-400">Sequential</span>
            </div>

            <div className="space-y-1">
              {workflowSteps.map((s) => {
                const Icon = s.icon;
                const isActive = location.pathname === s.path;

                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => handleNavClick(s.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-bold'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs transition-colors ${
                        isActive
                          ? 'bg-white text-sky-600'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-sky-200/60 group-hover:text-sky-800'
                      }`}
                    >
                      {s.step}
                    </div>

                    <div className="min-w-0 flex-1 truncate">
                      <p className={`text-xs truncate ${isActive ? 'text-white' : 'font-semibold text-slate-800'}`}>
                        {s.title}
                      </p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                        {s.subtitle}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upskilling & AI Tools */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="px-2 pb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Learning & AI Tools
              </span>
            </div>

            <div className="space-y-1">
              {additionalTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = location.pathname === tool.path;

                return (
                  <button
                    key={tool.path}
                    type="button"
                    onClick={() => handleNavClick(tool.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-bold'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                        isActive
                          ? 'bg-white text-sky-600'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-sky-200/60 group-hover:text-sky-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1 truncate">
                      <p className={`text-xs truncate ${isActive ? 'text-white' : 'font-semibold text-slate-800'}`}>
                        {tool.title}
                      </p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                        {tool.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Dashboard if admin */}
          {user?.role === 'admin' && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleNavClick('/admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Admin Dashboard</p>
                  <p className="text-[10px] opacity-80">Manage jobs, users & stats</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('/login')}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all text-center"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('/register')}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all text-center"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
