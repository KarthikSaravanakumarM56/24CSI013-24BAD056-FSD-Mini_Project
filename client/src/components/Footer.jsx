import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Skill<span className="text-brand-400">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering college graduates and freshers to bridge qualification gaps with industry-demanded tech skills, automated gap analysis, verified assessments, and direct job pathways.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="text-xs bg-slate-800 text-brand-300 px-3 py-1 rounded-full font-mono border border-slate-700">
                Full Stack Capstone v1.0
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Core Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Job & Internship Listings
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" className="hover:text-white transition-colors">
                  Skill-Gap Visualizer
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Tailored Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/assessments" className="hover:text-white transition-colors">
                  Skill Badges & Quizzes
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-white transition-colors">
                  Industry Mentorship
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & AI */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Advanced Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/ai-resume" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  AI Resume ATS Analyzer
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="hover:text-white transition-colors">
                  Interactive Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Student Profile & Skills
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-amber-400">
                  Admin Recruitment Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Problem Statement Highlight */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              The Mission
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Students may have qualifications but lack the skills required for available jobs. SkillBridge bridges this gap with precision."
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Example Matrix:</span>
              <div className="mt-1 font-mono text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                <p className="text-emerald-400">✓ Current: React, JS, MongoDB</p>
                <p className="text-brand-400">→ Target: Node.js, Express, Docker</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillBridge Employability Platform. Designed for Full Stack Development Course.</p>
          <p className="flex items-center gap-1">
            Built with React, Express, MongoDB & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
