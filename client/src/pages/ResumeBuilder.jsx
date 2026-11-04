import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { WorkflowFooterBar } from '../components/WorkflowFooterBar';
import { 
  FileText, 
  Printer, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Download,
  AlertCircle
} from 'lucide-react';

export const ResumeBuilder = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: 'Aarav Sharma',
      email: 'student@skillbridge.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, Karnataka, India',
      linkedin: 'linkedin.com/in/aaravsharma',
      github: 'github.com/aaravsharma-dev'
    },
    summary: 'Proactive Computer Science undergraduate with hands-on experience developing responsive web applications using React, JavaScript, and MongoDB. Seeking Full Stack Developer opportunities to build high-performance distributed systems.',
    education: [
      {
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'National Institute of Engineering',
        year: '2022 - 2026',
        grade: 'CGPA: 8.7 / 10'
      }
    ],
    skills: 'React.js, JavaScript (ES6+), MongoDB, Node.js, Express, Docker, HTML5, CSS3, Tailwind CSS, Git & GitHub, REST APIs',
    projects: [
      {
        title: 'Campus Food Delivery & Pre-Order System',
        tech: 'React, Node.js, MongoDB, Tailwind CSS',
        bullet1: 'Architected a full-stack food pre-ordering portal serving 1,200+ campus students with real-time order tracking.',
        bullet2: 'Integrated JWT authentication and secured REST API endpoints with role-based access control.',
        bullet3: 'Optimized MongoDB indexing, improving query response times by 42% under concurrent load.'
      },
      {
        title: 'Interactive Code Quiz Platform',
        tech: 'React, Tailwind CSS, LocalStorage, Web APIs',
        bullet1: 'Built an automated quiz engine with randomized question pools and instant performance analytics.',
        bullet2: 'Achieved 100% responsive design across mobile and desktop devices with seamless UI transitions.'
      }
    ],
    experience: [
      {
        role: 'Web Development Intern',
        company: 'TechNovation Labs',
        duration: 'June 2025 - August 2025',
        bullet1: 'Collaborated with senior engineers to build reusable React components for the customer onboarding portal.',
        bullet2: 'Reduced initial page load time by 28% through lazy loading and image optimization techniques.'
      }
    ],
    certifications: [
      'Meta Front-End Developer Professional Certificate (Coursera)',
      'JavaScript Algorithms and Data Structures (freeCodeCamp)'
    ]
  });

  const [template, setTemplate] = useState('modern'); // 'modern', 'executive', 'classic'
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Real-time ATS Score calculation
  const calculateLiveATSScore = () => {
    let score = 20; // base
    if (resumeData.personal.fullName && resumeData.personal.email && resumeData.personal.phone) score += 15;
    if (resumeData.summary && resumeData.summary.length > 60) score += 15;
    const skillsList = resumeData.skills.split(',').filter(Boolean);
    if (skillsList.length >= 6) score += 20;
    else if (skillsList.length >= 3) score += 10;
    if (resumeData.projects && resumeData.projects.length >= 2) score += 15;
    if (resumeData.education && resumeData.education.length >= 1) score += 10;
    if (resumeData.experience && resumeData.experience.length >= 1) score += 5;
    return Math.min(score, 100);
  };

  const liveATSScore = calculateLiveATSScore();

  // Load existing resume from user profile if available
  useEffect(() => {
    if (user?.resumeData && user.resumeData.personal) {
      setResumeData({
        ...user.resumeData,
        skills: Array.isArray(user.resumeData.skills) ? user.resumeData.skills.join(', ') : (user.resumeData.skills || '')
      });
    } else if (user) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || prev.personal.fullName,
          email: user.email || prev.personal.email,
          phone: user.phone || prev.personal.phone,
          location: user.location || prev.personal.location
        }
      }));
    }
  }, [user]);

  const handleSaveToProfile = async () => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      const skillsArray = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...resumeData,
        skills: skillsArray
      };
      await api.saveResume(payload);
      await refreshUser();
      setSaveMessage({ type: 'success', text: 'Resume saved to your student profile!' });
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save resume' });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToAIAnalyzer = () => {
    const textRepresentation = `
${resumeData.personal.fullName}
${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location}
LinkedIn: ${resumeData.personal.linkedin} | GitHub: ${resumeData.personal.github}

PROFESSIONAL SUMMARY
${resumeData.summary}

EDUCATION
${resumeData.education.map(e => `${e.degree} - ${e.institution} (${e.year}) - ${e.grade}`).join('\n')}

TECHNICAL SKILLS
${resumeData.skills}

PROJECTS
${resumeData.projects.map(p => `${p.title} (${p.tech})\n• ${p.bullet1}\n• ${p.bullet2 || ''}\n• ${p.bullet3 || ''}`).join('\n\n')}

WORK EXPERIENCE
${resumeData.experience.map(e => `${e.role} at ${e.company} (${e.duration})\n• ${e.bullet1}\n• ${e.bullet2 || ''}`).join('\n\n')}

CERTIFICATIONS
${resumeData.certifications.join('\n')}
    `.trim();

    navigate('/ai-resume', { state: { resumeText: textRepresentation } });
  };

  return (
    <div>
      <WorkflowStepper currentStep={4} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            ATS-Standard Resume Architect
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive ATS Resume Builder
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build clean, single-column resumes designed specifically to score 90%+ in Applicant Tracking Systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSendToAIAnalyzer}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze in AI ATS
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>

          <button
            type="button"
            onClick={handleSaveToProfile}
            disabled={saving}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save to Profile'}
          </button>
        </div>
      </div>

      {saveMessage.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{saveMessage.text}</span>
          <button onClick={() => setSaveMessage({ type: '', text: '' })} className="underline">Dismiss</button>
        </div>
      )}

      {/* Editor (Left) & Preview (Right) Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="space-y-6">
          {/* Section 1: Personal Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs">1</span>
              Personal & Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, fullName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={resumeData.personal.phone}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, location: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={resumeData.personal.linkedin}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, linkedin: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">GitHub</label>
                <input
                  type="text"
                  value={resumeData.personal.github}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, github: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs">2</span>
              Professional Summary
            </h2>
            <textarea
              rows={3}
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              placeholder="Highlight technical specialties, internships, and graduation year..."
            />
          </div>

          {/* Section 3: Technical Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs">3</span>
              Technical Stack (Comma-separated)
            </h2>
            <textarea
              rows={2}
              value={resumeData.skills}
              onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 font-mono"
              placeholder="React, JavaScript, MongoDB, Node.js, Express, Docker..."
            />
          </div>

          {/* Section 4: Projects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs">4</span>
              Featured Technical Projects
            </h2>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => {
                    const copy = [...resumeData.projects];
                    copy[idx].title = e.target.value;
                    setResumeData({ ...resumeData, projects: copy });
                  }}
                  className="w-full p-2 bg-white border rounded-lg font-bold"
                />
                <input
                  type="text"
                  placeholder="Technologies Used"
                  value={proj.tech}
                  onChange={(e) => {
                    const copy = [...resumeData.projects];
                    copy[idx].tech = e.target.value;
                    setResumeData({ ...resumeData, projects: copy });
                  }}
                  className="w-full p-2 bg-white border rounded-lg"
                />
                <textarea
                  rows={2}
                  placeholder="Bullet point 1: Impact & metric"
                  value={proj.bullet1}
                  onChange={(e) => {
                    const copy = [...resumeData.projects];
                    copy[idx].bullet1 = e.target.value;
                    setResumeData({ ...resumeData, projects: copy });
                  }}
                  className="w-full p-2 bg-white border rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Printable ATS Document Preview */}
        <div className="sticky top-24 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Live ATS Meter */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full font-black text-xs flex items-center gap-1 ${
                liveATSScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                liveATSScore >= 60 ? 'bg-brand-50 text-brand-700 border border-brand-200' :
                'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                Live ATS Score: {liveATSScore}/100
              </span>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTemplate('modern')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                  template === 'modern' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Modern
              </button>
              <button
                type="button"
                onClick={() => setTemplate('executive')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                  template === 'executive' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Executive
              </button>
              <button
                type="button"
                onClick={() => setTemplate('classic')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                  template === 'classic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Classic
              </button>
            </div>
          </div>

          <div
            id="printable-resume"
            className={`bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border font-sans text-[11px] leading-relaxed space-y-4 max-h-[80vh] overflow-y-auto ${
              template === 'executive' ? 'border-t-4 border-t-emerald-600 border-slate-300' :
              template === 'modern' ? 'border-t-4 border-t-brand-600 border-slate-300' :
              'border-slate-300'
            }`}
          >
            {/* Header */}
            <div className={`text-center pb-3 space-y-1 ${
              template === 'executive' ? 'border-b-2 border-emerald-700' :
              template === 'modern' ? 'border-b-2 border-brand-600' :
              'border-b-2 border-slate-900'
            }`}>
              <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
                {resumeData.personal.fullName}
              </h1>
              <p className="text-[10px] text-slate-600">
                {resumeData.personal.email} • {resumeData.personal.phone} • {resumeData.personal.location}
              </p>
              <p className={`text-[10px] font-medium ${
                template === 'executive' ? 'text-emerald-700' : 'text-brand-700'
              }`}>
                {resumeData.personal.linkedin} • {resumeData.personal.github}
              </p>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-slate-700 text-justify">{resumeData.summary}</p>
              </div>
            )}

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Education
              </h2>
              {resumeData.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution} • {edu.grade}</p>
                  </div>
                  <span className="text-slate-500 font-medium">{edu.year}</span>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Skills
              </h2>
              <p className="text-slate-800 font-medium">{resumeData.skills}</p>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Projects
              </h2>
              <div className="space-y-2 mt-1">
                {resumeData.projects.map((proj, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">[{proj.tech}]</span>
                    </div>
                    <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[10.5px]">
                      {proj.bullet1 && <li>{proj.bullet1}</li>}
                      {proj.bullet2 && <li>{proj.bullet2}</li>}
                      {proj.bullet3 && <li>{proj.bullet3}</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Professional Experience
                </h2>
                <div className="space-y-2 mt-1">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.role} — {exp.company}</span>
                        <span className="text-[10px] text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[10.5px]">
                        {exp.bullet1 && <li>{exp.bullet1}</li>}
                        {exp.bullet2 && <li>{exp.bullet2}</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 4 Workflow Bottom Action */}
      <WorkflowFooterBar
        currentStep={4}
        prevLabel="⬅ Back to Step 3: Skill Assessments"
        nextLabel="Proceed to Step 5: Explore Matching Jobs ➔"
        highlightText="Step 4 Completed: ATS Resume Formatted & Live Score Tested"
      />
    </div>
  </div>
  );
};
