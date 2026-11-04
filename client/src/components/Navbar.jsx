import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { 
  Compass, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Target,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar, isOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/profile': return 'Step 1: Student Profile & Skills';
      case '/skill-gap': return 'Step 2: Skill-Gap Analyzer';
      case '/assessments': return 'Step 3: Skill Assessments';
      case '/resume-builder': return 'Step 4: ATS Resume Builder';
      case '/jobs': return 'Step 5: Job & Internship Matching';
      case '/applications': return 'Step 6: Application Tracker';
      case '/mentors': return 'Step 7: Alumni Mentorship';
      case '/courses': return 'Recommended Upskilling Courses';
      case '/ai-resume': return 'AI Resume ATS Analyzer';
      case '/admin': return 'Admin Management Portal';
      default: return 'Employability Platform';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: The ONLY Single Hamburger Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              title="Click the 3 lines to view all pages"
              className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label="Toggle Pages Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
              <span className="text-xs font-bold text-sky-700 hidden sm:inline">
                Menu
              </span>
            </button>

            {/* Logo */}
            <Link to={user ? "/profile" : "/"} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Skill<span className="text-sky-500">Bridge</span>
                </span>
                <span className="hidden md:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-600 rounded-full border border-sky-200">
                  Employability Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Status Indicator (Static, No duplicate button) */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-semibold text-slate-700">
                  {getPageTitle(location.pathname)}
                </span>
              </div>
            ) : null}
          </div>

          {/* Right: User Auth & Account */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-sky-400/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-bold text-slate-800 truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[11px] text-sky-600 font-semibold truncate">
                      {user.graduationYear && user.graduationYear <= 2024 
                        ? `🎓 Alumni '${String(user.graduationYear).slice(-2)}` 
                        : '🎒 Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {user.studentStatus || 'Active Student'}
                      </div>
                    </div>

                    <button
                      onClick={() => { setUserDropdownOpen(false); toggleSidebar(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 text-left"
                    >
                      <Layers className="w-4 h-4 text-sky-600" />
                      View All Pages (Sidebar)
                    </button>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Student Profile
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Target className="w-4 h-4 text-slate-400" />
                      Track Applications
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm shadow-sky-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
