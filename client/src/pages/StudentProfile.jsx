import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { DOMAINS, DEPARTMENTS } from '../constants/domains';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Compass, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  Save, 
  Sparkles,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

export const StudentProfile = () => {
  const { user, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    college: '',
    degree: '',
    department: 'Computer Science and Engineering (CSE)',
    domain: 'Full Stack Development',
    graduationYear: 2025,
    cgpa: '',
    phone: '',
    location: '',
    targetRole: 'Full Stack Developer',
    studentStatus: 'Passed Out Graduate (Alumni)',
    noticePeriod: 'Immediate Joiner (Available Today)',
    github: '',
    linkedin: '',
    portfolio: ''
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        college: user.college || '',
        degree: user.degree || '',
        department: user.department || 'Computer Science and Engineering (CSE)',
        domain: user.domain || 'Full Stack Development',
        graduationYear: user.graduationYear || 2026,
        cgpa: user.cgpa || '',
        phone: user.phone || '',
        location: user.location || '',
        targetRole: user.targetRole || 'Full Stack Developer',
        studentStatus: user.studentStatus || 'Passed Out Graduate (Alumni)',
        noticePeriod: user.noticePeriod || 'Immediate Joiner (Available Today)',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await api.updateProfile(formData);
      await refreshUser();
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await api.addSkill({ name: newSkillName.trim(), level: newSkillLevel });
      await refreshUser();
      setNewSkillName('');
      setMessage({ type: 'success', text: `Skill "${newSkillName}" added!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to add skill' });
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      await api.removeSkill(skillName);
      await refreshUser();
      setMessage({ type: 'success', text: `Skill removed` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove skill' });
    }
  };

  return (
    <div>
      <WorkflowStepper currentStep={1} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Step 1 Guided Onboarding Banner */}
        <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400 text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-sky-300/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 7: Student Profile & Skills Setup
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Welcome to your Employability Working Flow!
            </h2>
            <p className="text-xs sm:text-sm text-sky-50 max-w-2xl font-medium">
              Verify your academic credentials, status (Current Student / Passed-Out Graduate), and current skill stack (e.g., React, JavaScript, MongoDB). Once set, proceed directly to Step 2 to detect your skill gaps.
            </p>
          </div>

          <Link
            to="/skill-gap"
            className="shrink-0 px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-600 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <span>Proceed to Step 2</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Toast Notification */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="text-xs font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-cyan-400 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-sky-300/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 capitalize">
                  {user?.role}
                </span>

                {user?.studentStatus && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    user.studentStatus.includes('Passed Out') 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {user.studentStatus}
                  </span>
                )}

                {user?.domain && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    {user.domain}
                  </span>
                )}

                {user?.department && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {user.department}
                  </span>
                )}

                {user?.isGoogleUser && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-600" /> Google Account
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">{user?.headline || 'Aspiring Software Engineer'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                <span>{user?.college || 'National Institute of Engineering'}</span>
                <span>•</span>
                <span>{user?.graduationYear ? `Pass-out Year: ${user.graduationYear}` : 'Class of 2025'}</span>
                {user?.noticePeriod && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ⚡ {user.noticePeriod}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <Link
              to="/skill-gap"
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Skill Gap</span>
            </Link>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <p className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {user.bio}
          </p>
        )}

        {/* Quick Links */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
          {user?.github && (
            <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-brand-600">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {user?.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-brand-600">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {user?.portfolio && (
            <a href={user.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-brand-600">
              <Globe className="w-3.5 h-3.5" /> Portfolio Website
            </a>
          )}
        </div>
      </div>

      {/* Edit Form Modal/Drawer if isEditing */}
      {isEditing && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-200 shadow-lg space-y-6 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Edit Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Final Year CS Undergrad | MERN Stack"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Preferred Career Domain (12 Domains)</label>
              <select
                value={formData.domain}
                onChange={(e) => {
                  const selected = DOMAINS.find(d => d.name === e.target.value) || DOMAINS[0];
                  setFormData({ 
                    ...formData, 
                    domain: selected.name,
                    targetRole: selected.primaryRole 
                  });
                }}
                className="w-full px-3 py-2 border rounded-xl text-sm font-bold text-sky-800 bg-sky-50/50"
              >
                {DOMAINS.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Branch</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-medium"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Career Role</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm font-semibold text-brand-700"
                placeholder="e.g. Full Stack Developer, AI Engineer..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Student Status</label>
              <select
                value={formData.studentStatus}
                onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm font-medium"
              >
                <option value="Passed Out Graduate (Alumni)">Passed Out Graduate (Alumni)</option>
                <option value="Current Student">Current Student (College)</option>
                <option value="Career Switcher / Job Seeker">Career Switcher / Job Seeker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pass-Out / Grad Year</label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 border rounded-xl text-sm font-medium"
              >
                <option value={2021}>2021 (Passed Out)</option>
                <option value={2022}>2022 (Passed Out)</option>
                <option value={2023}>2023 (Passed Out)</option>
                <option value={2024}>2024 (Passed Out)</option>
                <option value={2025}>2025 (Passed Out)</option>
                <option value={2026}>2026 (Final Year)</option>
                <option value={2027}>2027 (Pre-final)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notice Period / Availability</label>
              <select
                value={formData.noticePeriod}
                onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm font-medium"
              >
                <option value="Immediate Joiner (Available Today)">Immediate Joiner (Available Today)</option>
                <option value="15 Days Notice">15 Days Notice</option>
                <option value="1 Month Notice">1 Month Notice</option>
                <option value="Available after Exams">Available after Exams</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">College</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CGPA / Percentage</label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.7"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub URL</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Portfolio Website</label>
              <input
                type="text"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Bio / About Me</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              placeholder="Highlight your passion, interests, and past projects..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Skills Management & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Skills & Add Skill (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Current Technical Skills</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your registered proficiencies. Used by our algorithm to calculate skill gaps and job matches.
                </p>
              </div>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
                {user?.currentSkills?.length || 0} Skills Added
              </span>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Add New Skill
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Node.js, Express, Docker, Python..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
            </form>

            {/* Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user?.currentSkills?.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${
                      skill.level === 'Advanced' ? 'bg-emerald-500' : skill.level === 'Intermediate' ? 'bg-brand-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {skill.name}
                        {skill.verified && (
                          <span title="Verified by SkillBridge Assessment" className="inline-flex text-emerald-600">
                            <CheckCircle className="w-4 h-4 fill-emerald-100" />
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{skill.level} Proficiency</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!skill.verified && (
                      <Link
                        to="/assessments"
                        className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-md border border-brand-200 transition-opacity"
                      >
                        Verify
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Badges & Target Role Status (1 col) */}
        <div className="space-y-6">
          {/* Career Domain & Target Role Status Card */}
          <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg shadow-sky-400/25 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-100 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-200" />
                Career Domain
              </span>
              <Sparkles className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur rounded-lg text-xs font-bold text-white inline-block mb-1.5">
                {user?.domain || 'Full Stack Development'}
              </span>
              <h3 className="text-2xl font-black tracking-tight">{user?.targetRole || 'Full Stack Developer'}</h3>
            </div>
            <p className="text-xs text-sky-100 leading-relaxed font-medium">
              SkillBridge analyzes your skills against standard industry requirements for {user?.domain || 'Full Stack Development'}.
            </p>
            <Link
              to="/skill-gap"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              Run Skill-Gap Analysis
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Verified Badges */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Verified Badges
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {user?.badges?.length || 0} Earned
              </span>
            </div>

            {user?.badges && user.badges.length > 0 ? (
              <div className="space-y-3">
                {user.badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{b.skill} Certified</p>
                      <p className="text-[11px] text-amber-800">Score: {b.score}% • Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No verified badges yet.</p>
                <Link to="/assessments" className="text-xs font-bold text-brand-600 hover:underline mt-1 block">
                  Take a test to earn your first badge →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 1 Workflow Bottom Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkflowFooterBar 
          currentStep={1}
          nextLabel="Proceed to Step 2: Skill-Gap Analysis ➔"
          highlightText="Step 1 Completed: Academic Profile & Current Skills Setup"
        />
      </div>
    </div>
  </div>
  );
};
