import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Lightbulb,
  FileCheck
} from 'lucide-react';

export const AIResumeAnalyzer = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  // Sample resume preset
  const sampleResume = `
Aarav Sharma
student@skillbridge.edu | +91 98765 43210 | Bangalore, India
LinkedIn: linkedin.com/in/aaravsharma | GitHub: github.com/aaravsharma-dev

PROFESSIONAL SUMMARY
Motivated Computer Science undergraduate with hands-on experience building web applications using React, JavaScript, and MongoDB. Eager to solve challenging problems in full-stack engineering.

EDUCATION
B.Tech in Computer Science and Engineering - National Institute of Engineering (2022 - 2026) | CGPA: 8.7/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks: React.js, Tailwind CSS
Databases: MongoDB, MySQL
Tools: Git, GitHub, VS Code, Postman

PROJECTS
Campus Pre-Ordering Web App (React, Node.js, MongoDB)
• Developed responsive ordering interface serving 1,200+ students on campus.
• Built secure REST API endpoints with JWT authentication and role-based access.
• Optimized query execution times by 40% using MongoDB compound indexes.

Online Quiz Portal (React, LocalStorage)
• Built interactive assessment tool with timer and real-time score calculation.
• Implemented responsive UI with 100% mobile accessibility.
`.trim();

  useEffect(() => {
    // If text was passed from ResumeBuilder via route state
    if (location.state?.resumeText) {
      setResumeText(location.state.resumeText);
      handleAnalyze(location.state.resumeText, targetRole);
    } else {
      setResumeText(sampleResume);
    }
  }, [location.state]);

  const handleAnalyze = async (textToAnalyze, roleToTarget) => {
    const text = textToAnalyze || resumeText;
    const role = roleToTarget || targetRole;

    if (!text || text.trim().length < 50) {
      setError('Please paste at least 50 characters of resume text to analyze.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const res = await api.analyzeResumeAI(text, role);
      if (res.success) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Resume Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ATS Resume Analyzer & Keyword Auditor
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Audit your resume against modern Applicant Tracking Systems to extract skills, detect missing keywords, evaluate action verbs, and get actionable improvement suggestions.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Auditing For:
          </label>
          <select
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              if (analysis) handleAnalyze(resumeText, e.target.value);
            }}
            className="px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800 shadow-sm"
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
            <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Text Input */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              Paste Plaintext Resume
            </h2>
            <button
              type="button"
              onClick={() => {
                setResumeText(sampleResume);
                setError('');
              }}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Load Sample Resume
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
            />

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI ATS Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="space-y-6">
          {analyzing ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <h3 className="text-base font-bold text-slate-800">Analyzing Resume Semantics...</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Extracting technical skills, parsing action verbs, auditing section health, and checking ATS compliance.
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
              {/* Overall Score Box */}
              <div className="p-6 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Overall ATS Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-black">{analysis.overallScore}</span>
                    <span className="text-xs text-purple-300">/ 100</span>
                  </div>
                  <p className="text-xs text-purple-200 mt-1">
                    {analysis.overallScore >= 80 ? '🌟 Highly Competitive ATS Profile' : analysis.overallScore >= 60 ? '👍 Good Foundation, needs optimization' : '⚠️ Requires formatting & keyword fixes'}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <FileCheck className="w-8 h-8 text-purple-300" />
                </div>
              </div>

              {/* Sub-Score Bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Role Alignment ({analysis.targetRole})</span>
                    <span>{analysis.roleAlignmentScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysis.roleAlignmentScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Section Completeness</span>
                    <span>{analysis.sectionScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analysis.sectionScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Quantifiable Metrics & Numbers</span>
                    <span>{analysis.impactScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${analysis.impactScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Strong Action Verbs</span>
                    <span>{analysis.verbScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${analysis.verbScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Keyword Audit: Matched vs Missing */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Keyword Audit
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched Keywords ({analysis.matchedTargetSkills?.length || 0}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {analysis.matchedTargetSkills?.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {analysis.missingTargetSkills && analysis.missingTargetSkills.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Missing Critical Keywords ({analysis.missingTargetSkills.length}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {analysis.missingTargetSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[11px] font-bold rounded border border-rose-200">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Improvement Tips */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Actionable Improvement Recommendations
                  </h4>
                  <div className="space-y-2">
                    {analysis.suggestions.map((sug, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-0.5">
                        <p className="font-bold text-slate-800">{sug.title}</p>
                        <p className="text-slate-600 leading-relaxed">{sug.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-10 border border-dashed border-slate-200 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Ready to audit</h3>
              <p className="text-xs text-slate-500">
                Click "Run AI ATS Analysis" to evaluate keywords, sections, and compatibility.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
