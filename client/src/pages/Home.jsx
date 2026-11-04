import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DOMAINS } from '../constants/domains';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  Award, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Target, 
  FileCheck,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  GraduationCap
} from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export const Home = () => {
  const { user } = useAuth();
  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);

  const currentDomain = DOMAINS[selectedDomainIndex] || DOMAINS[0];
  const [selectedDemoSkills, setSelectedDemoSkills] = useState(currentDomain.starterSkills);

  const handleDomainChange = (idx) => {
    setSelectedDomainIndex(idx);
    setSelectedDemoSkills(DOMAINS[idx].starterSkills);
  };

  const toggleSkill = (skill) => {
    if (selectedDemoSkills.includes(skill)) {
      setSelectedDemoSkills(selectedDemoSkills.filter(s => s !== skill));
    } else {
      setSelectedDemoSkills([...selectedDemoSkills, skill]);
    }
  };

  const targetSkills = currentDomain.requiredSkills.slice(0, 6);
  const acquired = targetSkills.filter(s => selectedDemoSkills.includes(s));
  const missing = targetSkills.filter(s => !selectedDemoSkills.includes(s));
  const demoMatchPercent = Math.round((acquired.length / targetSkills.length) * 100);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-sm">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>For College Students & Passed-Out Graduates (Alumni Batches 2021–2026)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              You have the qualification. <br />
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Now master the exact skills
              </span> to get hired.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Whether you are in college or recently passed out seeking your first technical breakthrough, SkillBridge pinpoints missing industry competencies and maps a direct pathway to placement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to={user ? "/skill-gap" : "/register"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Analyze My Skill Gap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!user && (
                <div className="w-full sm:w-auto">
                  <GoogleSignInButton label="Sign in with Google" />
                </div>
              )}

              <Link
                to="/jobs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-all hover:border-slate-300 flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span>Explore Openings</span>
              </Link>
            </div>

            {/* Quick Demo Credentials Bar for Viva / Presentation */}
            <div className="pt-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Demo Credentials:
                </span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono">
                  Student: <strong className="text-brand-600">student@skillbridge.edu</strong> / password123
                </span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono">
                  Admin: <strong className="text-purple-600">admin@skillbridge.edu</strong> / admin123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blur glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/15 blur-3xl pointer-events-none rounded-full" />
      </section>

      {/* Interactive Live Skill-Gap Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Interactive Problem Statement Demo
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              Multi-Domain Skill-Gap Engine
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Select your career domain below and toggle your current skills. See how SkillBridge computes the gap for <strong className="text-slate-900">{currentDomain.name}</strong>.
            </p>
          </div>

          {/* Domain Selector in Demo */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600" />
                Select Domain to Test:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {DOMAINS.map((d, idx) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleDomainChange(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDomainIndex === idx
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Click to toggle your skills in {currentDomain.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentDomain.requiredSkills.map(skill => {
                  const isSelected = selectedDemoSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Grid matching problem statement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              {/* Box 1: Current Skills */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-emerald-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Current Skills
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {acquired.length} Acquired
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {acquired.length > 0 ? (
                    acquired.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-white text-emerald-800 font-medium text-xs rounded-md shadow-sm border border-emerald-200">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No matching skills selected</span>
                  )}
                </div>
              </div>

              {/* Box 2: Recommended Skills (Gap) */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-amber-900 text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    Recommended Skills (Gap)
                  </h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {missing.length} Missing
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.length > 0 ? (
                    missing.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-white text-amber-800 font-medium text-xs rounded-md shadow-sm border border-amber-200">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">Zero gap! 100% Ready for hiring.</span>
                  )}
                </div>
              </div>

              {/* Box 3: Job Match Score */}
              <div className="bg-brand-50/60 p-5 rounded-2xl border border-brand-200/60 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-brand-900 text-sm flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    Target Role Match Score
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-brand-700">{demoMatchPercent}%</span>
                    <span className="text-xs text-slate-500 font-medium">compatibility</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-brand-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${demoMatchPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    to="/skill-gap"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                  >
                    View deep personalized analysis 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Campus Placements
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Everything a final-year graduate or fresher needs to become high-priority recruitment material.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Skill-Gap Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Real-time matrix evaluation comparing your acquired skills against active industry requirements like Node.js, Express, and Docker.
            </p>
            <Link to="/skill-gap" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Analyze Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Skill-Matched Jobs</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Curated full-time jobs and internships with automatic % skill compatibility scoring so you know exactly where you stand before applying.
            </p>
            <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Browse Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI ATS Resume Analysis</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Automated Applicant Tracking System scanner that calculates formatting health, missing target keywords, and action verb impact scores.
            </p>
            <Link to="/ai-resume" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Analyze Resume <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Skill Badges</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Timed technical quizzes for React, JavaScript, Node.js, and Docker. Earn verified badges attached straight to your candidate profile.
            </p>
            <Link to="/assessments" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Take Quizzes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tailored Upskilling Courses</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Direct course recommendations targeted to the specific skills you lack, ensuring you spend zero time wandering random tutorials.
            </p>
            <Link to="/courses" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1-on-1 Mentorship</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Book personalized guidance sessions with verified senior engineers and alumni working at Microsoft, Google, Amazon, and top startups.
            </p>
            <Link to="/mentors" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Find Mentors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 12 Career Domains Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Comprehensive Multi-Domain Coverage</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            12 Industry Career Domains Supported
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            SkillBridge caters to students across all engineering branches, management, and computer applications with domain-specific skills, job matching, assessments, and personalized learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {DOMAINS.map((domain) => (
            <div
              key={domain.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    {domain.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {domain.requiredSkills.length} Core Skills
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                  {domain.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {domain.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {domain.requiredSkills.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                      {s}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 font-medium self-center">
                    +{domain.requiredSkills.length - 3} more
                  </span>
                </div>

                <Link
                  to={`/skill-gap?domain=${encodeURIComponent(domain.name)}`}
                  className="pt-1 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between"
                >
                  <span>Check Domain Gap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to land your dream technical role?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create your student profile today, test your current proficiencies, and let SkillBridge bridge your path to placement.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold shadow-md transition-all"
              >
                Create Free Student Account
              </Link>
              <Link
                to="/jobs"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all"
              >
                Explore Current Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
