import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { DOMAINS } from '../constants/domains';
import { 
  Compass, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  Briefcase,
  Layers,
  ChevronRight,
  Zap,
  Star,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SkillGapAnalyzer = () => {
  const { user, refreshUser } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState(user?.domain || 'Full Stack Development');
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [gapData, setGapData] = useState(null);
  const [simulatedAdded, setSimulatedAdded] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [preferredDomainMsg, setPreferredDomainMsg] = useState('');
  const [error, setError] = useState('');

  const currentDomainObj = DOMAINS.find(d => d.name === selectedDomain) || DOMAINS[0];

  // Quick close skill in database
  const handleQuickCloseSkill = async (skillName) => {
    try {
      await api.addSkill({ name: skillName, level: 'Intermediate' });
      await refreshUser();
      setSimulatedAdded([...simulatedAdded, skillName]);
      await fetchSkillGap(selectedDomain);

      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDomainSelect = (domainName) => {
    const dom = DOMAINS.find(d => d.name === domainName) || DOMAINS[0];
    setSelectedDomain(dom.name);
    setSelectedRole(dom.primaryRole);
  };

  const handleSetPreferredDomain = async () => {
    try {
      await api.updateProfile({ 
        domain: currentDomainObj.name, 
        targetRole: currentDomainObj.primaryRole 
      });
      await refreshUser();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      setPreferredDomainMsg(`"${currentDomainObj.name}" saved as your active career domain!`);
      setTimeout(() => setPreferredDomainMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSkillGap = async (target) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getSkillGap(target);
      if (res.success) {
        setGapData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch skill gap analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(selectedRole || selectedDomain);
  }, [selectedRole, selectedDomain, user]);

  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const res = await api.getCareerRoadmap(selectedRole || selectedDomain);
      if (res.success) {
        setRoadmap(res.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const isUserActiveDomain = user?.domain === selectedDomain;

  return (
    <div>
      <WorkflowStepper currentStep={2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              Multi-Domain Diagnostic Engine
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill-Gap Analysis & Career Pathways
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Select your career domain to benchmark your acquired skills against real-world job requirements across 12 distinct industries.
            </p>
          </div>

          {/* Quick Domain Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Your Profile Domain:</span>
            <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold rounded-lg border border-sky-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {user?.domain || 'Full Stack Development'}
            </span>
          </div>
        </div>

        {preferredDomainMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{preferredDomainMsg}</span>
          </div>
        )}

        {/* 12 Domains Horizontal Selector Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-600" />
              Choose Career Domain (12 Domains):
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Scroll or click to analyze any domain
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {DOMAINS.map((dom) => {
              const isSelected = dom.name === selectedDomain;
              const isPreferred = user?.domain === dom.name;
              return (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => handleDomainSelect(dom.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{dom.name}</span>
                  {isPreferred && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" title="Your Primary Domain" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Domain Banner Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-50 via-white to-indigo-50/40 rounded-3xl border border-sky-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                {currentDomainObj.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-slate-600 border border-slate-200">
                Tag: {currentDomainObj.tag}
              </span>
              {isUserActiveDomain ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Your Active Domain
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSetPreferredDomain}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 transition-all"
                  title="Make this your active career domain in your profile"
                >
                  <Star className="w-3 h-3 text-amber-600" /> Set as My Active Domain
                </button>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {currentDomainObj.name}
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {currentDomainObj.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to={`/jobs?domain=${encodeURIComponent(currentDomainObj.name)}`}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-brand-600" />
              <span>Jobs in {currentDomainObj.name.split(' ')[0]}</span>
            </Link>

            <Link
              to={`/courses?domain=${encodeURIComponent(currentDomainObj.name)}`}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Upskill Courses</span>
            </Link>
          </div>
        </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">Calculating your skill matrix against {selectedRole}...</p>
        </div>
      ) : gapData ? (
        <div className="space-y-10">
          {/* Top Summary Banner: Compatibility Gauge */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
              {/* Col 1: Progress Circle & Score */}
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-brand-500 transition-all duration-1000 ease-out"
                      strokeDasharray={`${gapData.matchPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black">{gapData.matchPercentage}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">Match</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                    Role Readiness
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-0.5">{selectedRole}</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    You meet {gapData.acquiredSkills.length} of {gapData.totalRequired} critical competencies.
                  </p>
                </div>
              </div>

              {/* Col 2: Problem Statement Concrete Example Callout */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Acquired ({gapData.acquiredSkills.length}): {gapData.acquiredSkills.map(s => s.name).join(', ') || 'None'}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 text-xs font-semibold">
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Missing Gap ({gapData.missingSkills.length}): {gapData.missingSkills.join(', ') || 'Zero skill gap! Ready for hiring.'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 italic pt-1">
                  Example: If you have React, JavaScript, and MongoDB, closing gaps in Node.js, Express, and Docker elevates you to 100% full-stack placement readiness.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Breakdown Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box 1: Acquired Skills */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Acquired Skills</h3>
                    <p className="text-xs text-slate-500">Skills you already possess matching {selectedRole}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {gapData.acquiredSkills.length} Verified / Active
                </span>
              </div>

              {gapData.acquiredSkills.length > 0 ? (
                <div className="space-y-3">
                  {gapData.acquiredSkills.map((s, idx) => (
                    <div key={idx} className="p-3.5 bg-emerald-50/40 border border-emerald-200/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-emerald-700 font-medium">Proficiency: {s.level}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-white text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 shadow-sm">
                        ✓ Acquired
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No skills acquired yet for this target role. Add them in your profile or take assessments!
                </div>
              )}
            </div>

            {/* Box 2: Missing Skills Gap with Direct Action Links */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Missing Skills (Skill-Gap)</h3>
                    <p className="text-xs text-slate-500">Industry requirements needed to qualify for jobs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {gapData.missingSkills.length} To Learn
                </span>
              </div>

              {gapData.missingSkills.length > 0 ? (
                <div className="space-y-3">
                  {gapData.missingSkills.map((skill, idx) => (
                    <div key={idx} className="p-3.5 bg-amber-50/40 border border-amber-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{skill}</p>
                        <p className="text-xs text-amber-800 font-medium">Critical Requirement Gap</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickCloseSkill(skill)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-all"
                          title="Simulate acquiring this skill and immediately update match score"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Close Gap</span>
                        </button>
                        <Link
                          to={`/courses?skill=${encodeURIComponent(skill)}`}
                          className="px-2.5 py-1.5 bg-white text-brand-600 hover:bg-brand-50 border border-brand-200 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Learn</span>
                        </Link>
                        <Link
                          to="/assessments"
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Test</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-emerald-600 text-sm font-bold bg-emerald-50 rounded-2xl">
                  🎉 Perfect 100% Match! You have all core skills for {selectedRole}.
                </div>
              )}
            </div>
          </div>

          {/* AI Career Roadmap Generator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Personalized 8-Week Upskilling Roadmap
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Structured learning milestones to bridge your missing skills and prepare for technical interviews.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={roadmapLoading}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                {roadmapLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{roadmap ? 'Refresh Roadmap' : 'Generate Roadmap'}</span>
                  </>
                )}
              </button>
            </div>

            {roadmap && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                {roadmap.map((milestone, i) => (
                  <div key={i} className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-3">
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
                      {milestone.week}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{milestone.title}</h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {milestone.topics.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-1.5">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-purple-100/80">
                      <p className="text-[11px] font-bold text-purple-900">Deliverable Project:</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{milestone.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Step 2 Workflow Bottom Action */}
      <WorkflowFooterBar
        currentStep={2}
        prevLabel="⬅ Back to Step 1: Profile & Skills"
        nextLabel="Proceed to Step 3: Skill Assessments & Quizzes ➔"
        highlightText="Step 2 Completed: Skill Gaps Identified against Industry Target Role"
      />
    </div>
  </div>
  );
};
