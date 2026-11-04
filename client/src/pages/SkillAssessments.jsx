import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { DOMAINS } from '../constants/domains';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

export const SkillAssessments = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [myHistory, setMyHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedDomain !== 'All') filters.domain = selectedDomain;

      const [assRes, histRes] = await Promise.all([
        api.getAssessments(filters),
        user ? api.getMyAssessmentResults().catch(() => ({ results: [] })) : Promise.resolve({ results: [] })
      ]);

      if (assRes.success) setAssessments(assRes.assessments);
      if (histRes.success) setMyHistory(histRes.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [selectedDomain, user]);

  return (
    <div>
      <WorkflowStepper currentStep={3} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            Verified Skill Verification
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Assessments & Certification Badges
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Take timed technical quizzes to test your proficiency. Passing with 70%+ awards a verified badge to your profile that recruiters see directly.
          </p>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">Your Badges</p>
              <p className="text-[11px] text-amber-700 font-semibold">{user.badges.length} Skills Certified</p>
            </div>
          </div>
        )}
      </div>

      {/* 12 Domains Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" /> Filter by Career Domain (12 Domains):
          </span>
          {user?.domain && (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              🎯 Your Domain: {user.domain}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedDomain('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDomain === 'All' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌐 All Domains
          </button>
          {DOMAINS.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDomain(d.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedDomain === d.name
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{d.name}</span>
              {user?.domain === d.name && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" title="Your Primary Domain" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Loading skill assessments...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Assessment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((test) => {
              const isEarned = user?.badges?.some(b => b.skill.toLowerCase() === test.skill.toLowerCase());

              return (
                <div
                  key={test._id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                      </div>

                      {isEarned ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                          {test.difficulty}
                        </span>
                      )}
                    </div>

                    <div>
                      {test.domain && (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 mb-1">
                          {test.domain}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{test.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                    </div>

                    <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {test.durationMinutes} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        {test.questions?.length || 5} Questions
                      </span>
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        ≥ {test.passingScorePercent}% to Pass
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/assessments/${test._id}`}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isEarned
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    <span>{isEarned ? 'Retake Test' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Test History Table */}
          {myHistory.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Your Recent Test Attempts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Skill</th>
                      <th className="pb-3 font-semibold">Score</th>
                      <th className="pb-3 font-semibold">Correct Answers</th>
                      <th className="pb-3 font-semibold">Outcome</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myHistory.map((item) => (
                      <tr key={item._id} className="text-slate-700">
                        <td className="py-3 font-bold text-slate-900">{item.skill}</td>
                        <td className="py-3 font-bold">{item.scorePercent}%</td>
                        <td className="py-3 text-slate-500">{item.correctAnswers} / {item.totalQuestions}</td>
                        <td className="py-3">
                          {item.passed ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                              Passed ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded">
                              Needs Practice
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3 Workflow Bottom Action */}
      <WorkflowFooterBar
        currentStep={3}
        prevLabel="⬅ Back to Step 2: Skill-Gap Analyzer"
        nextLabel="Proceed to Step 4: ATS Resume Builder ➔"
        highlightText="Step 3 Completed: Skill Assessments & Upskilling Badges"
      />
    </div>
  </div>
  );
};
