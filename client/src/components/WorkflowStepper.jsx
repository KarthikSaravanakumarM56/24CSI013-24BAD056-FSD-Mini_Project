import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Target, 
  Award, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  Users,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Profile & Skills',
    subtitle: 'Education, status & skills',
    path: '/profile',
    icon: User
  },
  {
    step: 2,
    title: 'Skill-Gap Analysis',
    subtitle: 'Identify missing skills',
    path: '/skill-gap',
    icon: Target
  },
  {
    step: 3,
    title: 'Assessments & Badges',
    subtitle: 'Test skills & earn badges',
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
    title: 'Job Matching',
    subtitle: 'Apply to matched jobs',
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
    subtitle: '1-on-1 interview prep',
    path: '/mentors',
    icon: Users
  }
];

export const WorkflowStepper = ({ currentStep = 1 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const progressPercent = Math.round((currentStep / WORKFLOW_STEPS.length) * 100);

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-sm mb-6 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Progress Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              Employability Flow
            </span>
            <span className="text-xs font-medium text-slate-500">
              Step <strong className="text-slate-800">{currentStep}</strong> of <strong>7</strong>:
              <span className="ml-1 text-sky-600 font-bold">{WORKFLOW_STEPS[currentStep - 1]?.title}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-44 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-sky-600 min-w-[2.5rem] text-right">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Stepper Icons & Pills (Scrollable horizontally on smaller screens) */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <ol className="flex items-center gap-2 sm:gap-2.5 min-w-[650px] lg:min-w-0 justify-between">
            {WORKFLOW_STEPS.map((s) => {
              const Icon = s.icon;
              const isCurrent = s.step === currentStep;
              const isCompleted = s.step < currentStep;

              return (
                <li key={s.step} className="flex-1">
                  <button
                    type="button"
                    onClick={() => navigate(s.path)}
                    className={`w-full group flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-left transition-all border ${
                      isCurrent
                        ? 'bg-sky-50 border-sky-300 text-sky-950 shadow-sm ring-1 ring-sky-400/40'
                        : isCompleted
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-white hover:bg-slate-50 border-slate-200/60 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                        isCurrent
                          ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30'
                          : isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <span>{s.step}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 truncate">
                      <p className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-sky-950' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                      }`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate hidden xl:block">
                        {s.subtitle}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};
