import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { 
  ClipboardList, 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Trash2, 
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getMyApplications();
      if (res.success) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await api.withdrawApplication(appId);
      setApplications(applications.filter(a => a._id !== appId));
      setMessage({ type: 'success', text: 'Application withdrawn successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to withdraw application' });
    }
  };

  const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    return STAGES.indexOf(status);
  };

  return (
    <div>
      <WorkflowStepper currentStep={6} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            Live Candidate Pipeline
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time status tracking for all your job and internship submissions.
          </p>
        </div>

        <Link
          to="/jobs"
          className="self-start sm:self-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          + Explore More Jobs
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Retrieving your applications...</p>
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
              >
                {/* Top Row: Job Title, Company, Status Badge & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.job?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.job?.company || 'Company')}&background=4f46e5&color=fff`}
                      alt={app.job?.company}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        <Link to={`/jobs/${app.job?._id}`} className="hover:text-brand-600">
                          {app.job?.title}
                        </Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {app.job?.company} • {app.job?.location} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                      app.status === 'Selected' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      app.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800 border border-purple-300 animate-pulse' :
                      app.status === 'Shortlisted' ? 'bg-brand-100 text-brand-800 border border-brand-300' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleWithdraw(app._id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl transition-colors"
                      title="Withdraw application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visual Pipeline Stepper (If not rejected) */}
                {!isRejected ? (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Recruitment Pipeline Progress
                    </p>
                    <div className="grid grid-cols-5 gap-2 relative">
                      {STAGES.map((stage, idx) => {
                        const isDone = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        return (
                          <div key={stage} className="text-center space-y-1.5">
                            <div className={`h-2 rounded-full transition-all ${
                              isDone ? 'bg-brand-600' : 'bg-slate-200'
                            }`} />
                            <p className={`text-[11px] font-semibold leading-tight ${
                              isCurrent ? 'text-brand-700 font-extrabold' : isDone ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                              {stage}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
                    Position filled or candidate not shortlisted for this round. We encourage you to upskill and apply to open positions!
                  </div>
                )}

                {/* Interview Scheduled Callout */}
                {app.status === 'Interview Scheduled' && (
                  <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>Technical Interview Scheduled!</span>
                      </div>
                      <span className="text-xs text-purple-700 font-semibold">
                        {app.interviewDate ? new Date(app.interviewDate).toLocaleString() : 'Date Pending'}
                      </span>
                    </div>
                    {app.interviewMeetingLink && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-purple-800">
                          Interview Platform: Google Meet
                        </span>
                        <a
                          href={app.interviewMeetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline History */}
                {app.timeline && app.timeline.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Activity Timeline
                    </p>
                    <div className="space-y-2">
                      {app.timeline.map((entry, ti) => (
                        <div key={ti} className="flex items-start gap-2.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <span className="font-bold text-slate-800">{entry.status}:</span>{' '}
                            <span className="text-slate-600">{entry.note}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No applications yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse our curated job listings to apply and track your interview stages here.
          </p>
          <Link
            to="/jobs"
            className="inline-block mt-4 px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl shadow"
          >
            Find Jobs & Internships
          </Link>
        </div>
      )}

      {/* Step 6 Workflow Bottom Action */}
      <WorkflowFooterBar
        currentStep={6}
        prevLabel="⬅ Back to Step 5: Matching Jobs"
        nextLabel="Proceed to Step 7: Alumni Mentorship ➔"
        highlightText="Step 6 Completed: Application Pipeline & Interviews Monitored"
      />
    </div>
  </div>
  );
};
