import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  ClipboardList, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Calendar, 
  Video, 
  Search,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);

  // Tab Data
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Modals & Actions
  const [updatingApp, setUpdatingApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [statusNote, setStatusNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('2026-11-08T15:00');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/sb-rzp-interview');

  // New Job Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    type: 'Internship',
    salary: '₹35,000 / month',
    experience: 'Fresher (0-1 yr)',
    requiredSkills: 'React, Node.js, Express, MongoDB, Docker',
    description: '',
    openings: 3
  });

  // New Course Modal
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    provider: 'Coursera',
    skill: 'Docker',
    category: 'DevOps & Cloud',
    level: 'Intermediate',
    duration: '10 Hours',
    rating: 4.8,
    isFree: true,
    price: 'Free',
    url: 'https://docker.com',
    description: 'Learn containerization and continuous integration.'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, jobsRes, coursesRes, studentsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllApplications(),
        api.getJobs({ status: '' }),
        api.getCourses(),
        api.getAllStudents(studentSearch)
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (appsRes.success) setApplications(appsRes.applications);
      if (jobsRes.success) setJobs(jobsRes.jobs);
      if (coursesRes.success) setCourses(coursesRes.courses);
      if (studentsRes.success) setStudents(studentsRes.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [studentSearch]);

  // Handle Application Status Update
  const handleUpdateAppStatus = async (e) => {
    e.preventDefault();
    if (!updatingApp) return;

    try {
      await api.updateApplicationStatus(updatingApp._id, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`,
        interviewDate: newStatus === 'Interview Scheduled' ? interviewDate : undefined,
        interviewMeetingLink: newStatus === 'Interview Scheduled' ? interviewLink : undefined
      });

      setMessage({ type: 'success', text: `Application status updated to ${newStatus}` });
      setUpdatingApp(null);
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  // Handle Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skills = newJob.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.createJob({
        ...newJob,
        requiredSkills: skills
      });
      setMessage({ type: 'success', text: 'New job posting created successfully' });
      setShowAddJobModal(false);
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create job' });
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.deleteJob(id);
      setMessage({ type: 'success', text: 'Job deleted' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // Handle Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse(newCourse);
      setMessage({ type: 'success', text: 'Course added to catalog' });
      setShowAddCourseModal(false);
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course from catalog?')) return;
    try {
      await api.deleteCourse(id);
      setMessage({ type: 'success', text: 'Course deleted' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            University Placement & Recruiter Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete CRUD operations for Job Postings, Student Applications, Courses, and Candidate Directories.
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="underline">Dismiss</button>
        </div>
      )}

      {/* Analytics KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Students</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
            <p className="text-2xl font-black text-brand-600">{stats.activeJobs}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-indigo-600">{stats.totalApplications}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Courses</p>
            <p className="text-2xl font-black text-emerald-600">{stats.totalCourses}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentors</p>
            <p className="text-2xl font-black text-rose-600">{stats.totalMentors}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tests Taken</p>
            <p className="text-2xl font-black text-amber-600">{stats.totalAssessmentsTaken}</p>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-2xl">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'applications' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Manage Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'courses' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Manage Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'students' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Student Directory ({students.length})
        </button>
      </div>

      {/* TAB 1: Applications Management */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Applicant Submissions & Scheduling</h2>
            <span className="text-xs text-slate-500 font-semibold">{applications.length} Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Role & Company</th>
                  <th className="pb-3 font-semibold">Skill Match</th>
                  <th className="pb-3 font-semibold">Current Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="text-slate-700">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900">{app.student?.name}</p>
                      <p className="text-[11px] text-slate-400">{app.student?.email} • {app.student?.college}</p>
                    </td>
                    <td className="py-3.5 font-medium">
                      <p className="font-bold text-slate-800">{app.job?.title}</p>
                      <p className="text-[11px] text-slate-500">{app.job?.company}</p>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-700 font-bold rounded">
                        {app.skillMatchPercentage}% Match
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        app.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'Shortlisted' ? 'bg-brand-100 text-brand-800' :
                        app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          setUpdatingApp(app);
                          setNewStatus(app.status);
                        }}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Jobs Management (CRUD) */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Job Postings</h2>
              <p className="text-xs text-slate-500">Create, edit, and maintain open recruitment listings</p>
            </div>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Title & Company</th>
                  <th className="pb-3 font-semibold">Type & Mode</th>
                  <th className="pb-3 font-semibold">Required Skills</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => (
                  <tr key={j._id} className="text-slate-700">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900">{j.title}</p>
                      <p className="text-slate-500">{j.company} • {j.location}</p>
                    </td>
                    <td className="py-3.5 font-medium">
                      {j.type} ({j.workMode})
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {j.requiredSkills?.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        j.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Course Catalog Management (CRUD) */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Course Catalog</h2>
              <p className="text-xs text-slate-500">Provide verified learning materials for missing skills</p>
            </div>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Course Title</th>
                  <th className="pb-3 font-semibold">Target Skill</th>
                  <th className="pb-3 font-semibold">Provider</th>
                  <th className="pb-3 font-semibold">Level</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c._id} className="text-slate-700">
                    <td className="py-3.5 font-bold text-slate-900 max-w-sm truncate">{c.title}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-700 font-bold rounded">
                        {c.skill}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">{c.provider}</td>
                    <td className="py-3.5">{c.level}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Students Directory */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registered Student Directory</h2>
              <p className="text-xs text-slate-500">Monitor candidate skill profiles, graduation years, and target roles</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student Name</th>
                  <th className="pb-3 font-semibold">College & Degree</th>
                  <th className="pb-3 font-semibold">Target Career Role</th>
                  <th className="pb-3 font-semibold">Current Skills</th>
                  <th className="pb-3 font-semibold">Verified Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="text-slate-700">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900">{st.name}</p>
                      <p className="text-[11px] text-slate-400">{st.email}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-medium text-slate-800">{st.college || 'N/A'}</p>
                      <p className="text-[11px] text-slate-500">{st.degree} (Batch {st.graduationYear})</p>
                    </td>
                    <td className="py-3.5 font-bold text-brand-700">{st.targetRole}</td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {st.currentSkills?.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-amber-700">
                        {st.badges?.length || 0} Badges
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Update Application Status */}
      {updatingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100 relative">
            <button
              onClick={() => setUpdatingApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Recruiter Decision
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Update Status for {updatingApp.student?.name}
              </h3>
              <p className="text-xs text-slate-500">{updatingApp.job?.title} at {updatingApp.job?.company}</p>
            </div>

            <form onSubmit={handleUpdateAppStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected / Offer Extended</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {newStatus === 'Interview Scheduled' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Interview Date & Time</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Google Meet / Video Link</label>
                    <input
                      type="text"
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Recruiter Note for Candidate</label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Cleared resume screening, proceeding to technical assessment."
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Job */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Post New Job / Internship</h3>
              <button onClick={() => setShowAddJobModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer Intern"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Work Mode</label>
                  <select
                    value={newJob.workMode}
                    onChange={(e) => setNewJob({ ...newJob, workMode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, Express, MongoDB, Docker"
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Overview of duties, stack, and requirements..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add Course</h3>
              <button onClick={() => setShowAddCourseModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Target Skill</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Docker, Node.js"
                    value={newCourse.skill}
                    onChange={(e) => setNewCourse({ ...newCourse, skill: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-brand-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Provider</label>
                  <input
                    type="text"
                    required
                    value={newCourse.provider}
                    onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Course URL</label>
                <input
                  type="url"
                  required
                  value={newCourse.url}
                  onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
