import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Mail, Lock, Building, GraduationCap, ArrowRight, AlertCircle, Sparkles, Layers, BookOpen } from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { DOMAINS, DEPARTMENTS } from '../constants/domains';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentStatus: 'Passed Out Graduate (Alumni)',
    college: 'National Institute of Engineering',
    degree: 'B.Tech in Computer Science',
    department: 'Computer Science and Engineering (CSE)',
    domain: 'Full Stack Development',
    graduationYear: 2025,
    noticePeriod: 'Immediate Joiner (Available Today)',
    targetRole: 'Full Stack Developer',
    currentSkills: ['React', 'JavaScript', 'MongoDB']
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Selected domain object
  const currentDomainObj = DOMAINS.find(d => d.name === formData.domain) || DOMAINS[0];

  const handleDomainChange = (domainName) => {
    const selected = DOMAINS.find(d => d.name === domainName) || DOMAINS[0];
    setFormData({
      ...formData,
      domain: selected.name,
      targetRole: selected.primaryRole,
      currentSkills: [...selected.starterSkills]
    });
  };

  const handleToggleSkill = (skill) => {
    if (formData.currentSkills.includes(skill)) {
      setFormData({
        ...formData,
        currentSkills: formData.currentSkills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        currentSkills: [...formData.currentSkills, skill]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(formData);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Student Profile
          </h2>
          <p className="text-sm text-slate-500">
            Join SkillBridge to identify skill gaps and accelerate your placement journey
          </p>
        </div>

        {/* Google Registration Option */}
        <div className="space-y-3">
          <GoogleSignInButton label="Register with Google (Instant)" redirectTo="/profile" />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or register with email</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.role === 'student' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🎓 Student / Passed Out Graduate
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.role === 'admin' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🛡️ Admin / Recruiter
            </button>
          </div>

          {/* Student Status (Alumni vs Current) */}
          {formData.role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Education Status
                </label>
                <select
                  value={formData.studentStatus}
                  onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-brand-700"
                >
                  <option value="Passed Out Graduate (Alumni)">🎓 Passed Out Graduate (Alumni)</option>
                  <option value="Current Student">📚 Current Student (College)</option>
                  <option value="Career Switcher / Job Seeker">💼 Career Switcher / Job Seeker</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pass-Out / Grad Year
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value={2022}>2022 (Passed Out)</option>
                  <option value={2023}>2023 (Passed Out)</option>
                  <option value={2024}>2024 (Passed Out)</option>
                  <option value={2025}>2025 (Passed Out)</option>
                  <option value={2026}>2026 (Final Year)</option>
                  <option value={2027}>2027 (Pre-final)</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Karthik R."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. National Institute of Tech"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Department / Branch
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Career Domain Selection (12 Domains) */}
          <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                Preferred Career Domain (12 Domains)
              </label>
              <span className="text-[11px] font-semibold text-brand-600 bg-white px-2 py-0.5 rounded-md border border-brand-200">
                {currentDomainObj.tag}
              </span>
            </div>

            <select
              value={formData.domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-brand-300 rounded-xl text-sm font-bold text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            >
              {DOMAINS.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {currentDomainObj.description}
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Target Role in this Domain:
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                {currentDomainObj.popularRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Skills Selector (Dynamic to Selected Domain) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Your Current Skills in {formData.domain}
              </label>
              <span className="text-[11px] font-semibold text-brand-600">
                {formData.currentSkills.length} selected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {currentDomainObj.requiredSkills.map(skill => {
                const selected = formData.currentSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                      selected 
                        ? 'bg-brand-600 text-white shadow-sm font-semibold' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {skill} {selected && '✓'}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select what you know now. SkillBridge calculates missing skills automatically.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
