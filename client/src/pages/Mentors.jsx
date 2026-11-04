import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { 
  Users, 
  Calendar, 
  Star, 
  Linkedin, 
  Video, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  X,
  Send
} from 'lucide-react';

export const Mentors = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [domain, setDomain] = useState('All');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [topic, setTopic] = useState('Resume Review & System Design Guidance');
  const [preferredDate, setPreferredDate] = useState('2026-11-06');
  const [preferredTime, setPreferredTime] = useState('Evening (6 PM - 8 PM IST)');
  const [message, setMessage] = useState('Hi, I would love guidance on preparing for full-stack developer technical rounds and review of my React/Node projects.');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ type: '', text: '' });

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (domain !== 'All') filters.domain = domain;

      const [mRes, reqRes] = await Promise.all([
        api.getMentors(filters),
        user ? api.getMyMentorships().catch(() => ({ requests: [] })) : Promise.resolve({ requests: [] })
      ]);

      if (mRes.success) setMentors(mRes.mentors);
      if (reqRes.success) setMyRequests(reqRes.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [domain, user]);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookingStatus({ type: '', text: '' });
  };

  const handleCloseBooking = () => {
    setSelectedMentor(null);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingStatus({ type: '', text: '' });

    try {
      const res = await api.requestMentorship(selectedMentor._id, {
        topic,
        message,
        preferredDate,
        preferredTime
      });

      if (res.success) {
        setBookingStatus({ type: 'success', text: 'Mentorship session booked! View link in My Bookings.' });
        const updated = await api.getMyMentorships();
        if (updated.success) setMyRequests(updated.requests);
        setTimeout(() => {
          handleCloseBooking();
        }, 1800);
      }
    } catch (err) {
      setBookingStatus({ type: 'error', text: err.message || 'Failed to book session' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <WorkflowStepper currentStep={7} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Industry Alumni Network
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect with Tech Mentors
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Book 1-on-1 virtual sessions with senior engineers and architects from top tech companies to review your projects and conduct mock interviews.
          </p>
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-2">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800 shadow-sm"
          >
            <option value="All">All Tech Domains</option>
            <option value="Full Stack & Web Dev">Full Stack & Web Dev</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="System Design & DSA">System Design & DSA</option>
          </select>
        </div>
      </div>

      {/* Booked Sessions Notification / List if user has any */}
      {myRequests.length > 0 && (
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Video className="w-5 h-5 text-brand-300" />
            Your Scheduled Mentorship Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRequests.map((req) => (
              <div key={req._id} className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-white">{req.mentor?.name} ({req.mentor?.company})</p>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{req.topic}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300">
                  <span>📅 {req.preferredDate} • {req.preferredTime}</span>
                  {req.meetingLink && (
                    <a
                      href={req.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-white text-brand-900 font-bold text-xs rounded-lg shadow hover:bg-slate-100 transition-colors"
                    >
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Loading industry mentors...</p>
        </div>
      ) : mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-rose-300 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={mentor.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                    <p className="text-xs font-semibold text-slate-600">{mentor.title}</p>
                    <p className="text-xs font-bold text-brand-600">{mentor.company} • {mentor.experienceYears}+ yrs exp</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold pt-1 text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {mentor.rating} ({mentor.sessionsCompleted} sessions)
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                    {mentor.domain}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.skills?.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-md border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {user ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(mentor)}
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book 1-on-1 Guidance
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => alert('Please sign in to book mentorship sessions.')}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-center"
                  >
                    Sign In to Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No mentors available in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching to 'All Tech Domains'.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={handleCloseBooking}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                1-on-1 Mentorship Booking
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Session with {selectedMentor.name}
              </h2>
              <p className="text-xs text-slate-500">{selectedMentor.title} at {selectedMentor.company}</p>
            </div>

            {bookingStatus.text && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold ${
                bookingStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {bookingStatus.text}
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Topic
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Morning (10 AM - 12 PM IST)">Morning (10 AM - 12 PM)</option>
                    <option value="Afternoon (2 PM - 4 PM IST)">Afternoon (2 PM - 4 PM)</option>
                    <option value="Evening (6 PM - 8 PM IST)">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Questions for Mentor
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {bookingLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 7 Workflow Bottom Action: Journey Complete */}
      <WorkflowFooterBar
        currentStep={7}
        prevLabel="⬅ Back to Step 6: Application Tracker"
        nextLabel="🎉 Completed Workflow! Return to Profile Summary ➔"
        highlightText="Step 7 Completed: Mentorship Session Booked & Interview Prepared"
      />
    </div>
  </div>
  );
};
