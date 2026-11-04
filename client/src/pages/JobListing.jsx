import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { DOMAINS } from '../constants/domains';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building2, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  ArrowRight,
  Sparkles,
  Send,
  Layers,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobListing = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Read optional ?domain= from URL
  const queryParams = new URLSearchParams(location.search);
  const initialDomain = queryParams.get('domain') || 'All';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [type, setType] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState('');

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appMessage, setAppMessage] = useState({ type: '', text: '' });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (selectedDomain !== 'All') filters.domain = selectedDomain;
      if (type !== 'All') filters.type = type;
      if (workMode !== 'All') filters.workMode = workMode;
      if (minMatch) filters.minMatch = minMatch;

      const data = await api.getJobs(filters);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedDomain, type, workMode, minMatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenApplyModal = (job) => {
    setApplyingJob(job);
    setCoverNote(`I am excited to apply for the ${job.title} role at ${job.company}. My skill set aligns well with your team requirements.`);
    setAppMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setApplyingJob(null);
    setCoverNote('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmittingApp(true);
    setAppMessage({ type: '', text: '' });

    try {
      const res = await api.applyJob({
        jobId: applyingJob._id,
        coverNote,
        resumeUrl: user?.resumeUrl || ''
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
        setAppMessage({ type: 'success', text: 'Application submitted successfully! Track it in your Application Tracker.' });
        setTimeout(() => {
          handleCloseModal();
        }, 1800);
      }
    } catch (err) {
      setAppMessage({ type: 'error', text: err.message || 'Failed to submit application' });
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleBookmark = async (jobId) => {
    try {
      await api.toggleBookmarkJob(jobId);
      // Toggle locally
      setJobs(jobs.map(j => {
        if (j._id === jobId) {
          const isSaved = user?.savedJobs?.includes(jobId);
          // updated
        }
        return j;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <WorkflowStepper currentStep={5} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-8 h-8 text-brand-600" />
            Job & Internship Opportunities
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse active tech openings scored in real-time against your current technical skills.
          </p>
        </div>

        {user && (
          <Link
            to="/applications"
            className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            My Application Tracker →
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or skills (e.g. React, Node.js)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Search
          </button>
        </form>

        {/* Quick Career Category Filter Pills (Passed Out vs Current) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => { setType('All'); setSearch(''); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              type === 'All' && !search.includes('Fresher') ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔥 All Opportunities
          </button>
          <button
            type="button"
            onClick={() => { setType('Full-time'); setSearch('Fresher'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              type === 'Full-time' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>🎓 Passed Out & Immediate Joiners</span>
          </button>
          <button
            type="button"
            onClick={() => { setType('Full-time'); setSearch(''); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              type === 'Full-time' && !search ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💼 Full-time Graduate Positions
          </button>
          <button
            type="button"
            onClick={() => { setType('Internship'); setSearch(''); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              type === 'Internship' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎯 Final-Year Internships
          </button>
        </div>

        {/* 12 Domains Filter Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-600" /> Filter by Career Domain (12 Domains):
            </span>
            {user?.domain && (
              <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
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
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{d.name}</span>
                {user?.domain === d.name && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Your Primary Domain" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-100">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
          </select>

          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {user && (
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(e.target.value)}
              className="px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-brand-700 font-semibold"
            >
              <option value="">Any Match %</option>
              <option value="50">Min 50% Match</option>
              <option value="75">Min 75% Match</option>
            </select>
          )}

          {(search || type !== 'All' || workMode !== 'All' || minMatch) && (
            <button
              onClick={() => {
                setSearch('');
                setType('All');
                setWorkMode('All');
                setMinMatch('');
              }}
              className="text-brand-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Loading live opportunities...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const match = job.match;
            return (
              <div
                key={job._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Bar: Company & Match Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=4f46e5&color=fff`}
                        alt={job.company}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=4f46e5&color=fff`;
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug hover:text-brand-600 transition-colors">
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{job.company}</span> • <span>{job.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Skill Match Badge */}
                    {match && (
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 ${
                        match.score >= 70 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : match.score >= 40
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        {match.score}% Match
                      </div>
                    )}
                  </div>

                  {/* Pills: Domain, Type, WorkMode, Salary */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                    {job.domain && (
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-800 font-bold rounded-lg border border-sky-200">
                        {job.domain}
                      </span>
                    )}
                    {job.isDomainMatch && (
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" /> Tailored Domain
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                      {job.type}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                      {job.workMode}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-100">
                      {job.salary}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-auto">
                      {job.experience}
                    </span>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((skill) => {
                        const isMatching = match?.matchingSkills?.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                              match
                                ? isMatching
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {match && isMatching && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl text-center transition-colors"
                  >
                    View Details
                  </Link>

                  {user ? (
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Apply Now
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm text-center"
                    >
                      Sign In to Apply
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No jobs found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search keywords or resetting filters.</p>
        </div>
      )}

      {/* Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Quick Job Application
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Apply for {applyingJob.title}
              </h2>
              <p className="text-xs text-slate-500">{applyingJob.company} • {applyingJob.location}</p>
            </div>

            {/* Live Match Preview */}
            {applyingJob.match && (
              <div className="p-3.5 bg-brand-50/70 rounded-2xl border border-brand-200 text-xs space-y-1">
                <p className="font-bold text-brand-900 flex items-center justify-between">
                  <span>Your Skill Match Score:</span>
                  <span className="text-brand-700 font-extrabold text-sm">{applyingJob.match.score}%</span>
                </p>
                <p className="text-brand-800 text-[11px]">
                  {applyingJob.match.matchingSkills?.length || 0} matching skills will be highlighted to the recruiter.
                </p>
              </div>
            )}

            {appMessage.text && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold ${
                appMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {appMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate Profile Details
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>College:</strong> {user?.college || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Note / Pitch to Recruiter
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="Explain why your technical background makes you a strong candidate..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {submittingApp ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 5 Workflow Bottom Action */}
      <WorkflowFooterBar
        currentStep={5}
        prevLabel="⬅ Back to Step 4: Resume Builder"
        nextLabel="Proceed to Step 6: Application Tracker ➔"
        highlightText="Step 5 Completed: Explored & Applied for Matching Jobs"
      />
    </div>
  </div>
  );
};
