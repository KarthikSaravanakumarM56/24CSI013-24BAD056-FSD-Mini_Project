import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  BookOpen,
  Award
} from 'lucide-react';

export const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.getJobById(id);
        if (res.success) {
          setJob(res.job);
          setCoverNote(`I am excited to apply for the ${res.job.title} role at ${res.job.company}. My skill set aligns well with your team.`);
        }
      } catch (err) {
        setError(err.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');

    try {
      const res = await api.applyJob({
        jobId: job._id,
        coverNote,
        resumeUrl: user?.resumeUrl || ''
      });
      if (res.success) {
        setAppliedSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-600">Job posting not found.</p>
        <Link to="/jobs" className="text-brand-600 underline text-sm mt-2 block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const match = job.match;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Back to All Jobs
      </Link>

      {/* Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=4f46e5&color=fff`}
            alt={job.company}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-2 mt-0.5">
              <span>{job.company}</span> • <span>{job.location}</span> • <span className="text-brand-600 font-bold">{job.salary}</span>
            </p>
          </div>
        </div>

        {match && (
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                Your Compatibility
              </span>
              <span className="text-2xl font-black text-brand-700">{match.score}%</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Details (Left) + Apply / Skill Gap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Job Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Required Qualifications</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar: Apply form & Match Analysis */}
        <div className="space-y-6">
          {/* Skill Match Breakdown */}
          {match && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Skill Match Audit</h3>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Matching Skills ({match.matchingSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {match.matchingSkills?.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {match.missingSkills && match.missingSkills.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Missing Competencies ({match.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.missingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded border border-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/skill-gap?jobId=${job._id}`}
                    className="text-xs text-brand-600 font-semibold hover:underline block pt-1"
                  >
                    View course pathway for these missing skills →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Apply Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Submit Application</h3>

            {appliedSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold space-y-2">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Application Sent!
                </p>
                <p>Your application is now visible in the recruitment dashboard.</p>
                <Link to="/applications" className="text-emerald-900 underline block pt-1">
                  Go to Application Tracker →
                </Link>
              </div>
            ) : user ? (
              <form onSubmit={handleApply} className="space-y-3">
                {error && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {error}
                  </p>
                )}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Cover Note to Recruiter
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {applying ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Apply for this Position
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">Sign in with your student profile to apply.</p>
                <Link
                  to="/login"
                  className="block w-full py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl shadow"
                >
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
