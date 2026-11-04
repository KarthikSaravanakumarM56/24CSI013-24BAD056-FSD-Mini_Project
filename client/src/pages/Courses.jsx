import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DOMAINS } from '../constants/domains';
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Filter, 
  CheckCircle2,
  Layers,
  Tag
} from 'lucide-react';

export const Courses = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Read optional ?skill= and ?domain= from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSkill = queryParams.get('skill') || '';
  const initialDomain = queryParams.get('domain') || 'All';

  const [activeTab, setActiveTab] = useState(user ? 'recommended' : 'all');
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [missingSkillsTargeted, setMissingSkillsTargeted] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialSkill);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [isFree, setIsFree] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (selectedDomain !== 'All') filters.domain = selectedDomain;
      if (category !== 'All') filters.category = category;
      if (level !== 'All') filters.level = level;
      if (isFree !== 'All') filters.isFree = isFree;

      const res = await api.getCourses(filters);
      if (res.success) setCourses(res.courses);

      if (user) {
        const recRes = await api.getRecommendedCourses();
        if (recRes.success) {
          setRecommended(recRes.courses);
          setMissingSkillsTargeted(recRes.missingSkillsTargeted || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedDomain, category, level, isFree, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const displayedCourses = activeTab === 'recommended' && user ? recommended : courses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Curated Upskilling Pathways
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Targeted Technical Courses
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Close your employability skill gaps with verified, high-rating courses directly aligned with technical interview expectations.
          </p>
        </div>

        {/* Tab switchers */}
        {user && (
          <div className="flex bg-slate-100 p-1 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'recommended'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Recommended For Your Gap ({missingSkillsTargeted.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Courses ({courses.length})
            </button>
          </div>
        )}
      </div>

      {/* Missing Skills Targeted Notice (if on recommended tab) */}
      {activeTab === 'recommended' && user && missingSkillsTargeted.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-brand-900">
              Personalized Recommendations for {user.targetRole}:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missingSkillsTargeted.map(s => (
                <span key={s} className="px-2.5 py-0.5 bg-white text-brand-800 text-xs font-bold rounded-lg border border-brand-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs text-brand-700 font-semibold italic">
            Targeting these missing skills bridges your employability gap!
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, skill, or provider (e.g. Node.js, Docker, Coursera)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
          >
            Search
          </button>
        </form>

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

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="DevOps & Cloud">DevOps & Cloud</option>
            <option value="Database">Database</option>
            <option value="Data & AI">Data & AI</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={isFree}
            onChange={(e) => setIsFree(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Pricing</option>
            <option value="true">Free Only</option>
            <option value="false">Paid</option>
          </select>

          {(search || category !== 'All' || level !== 'All' || isFree !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setLevel('All');
                setIsFree('All');
              }}
              className="text-brand-600 hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Loading courses...</p>
        </div>
      ) : displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 hover:shadow-xl hover:shadow-slate-100 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-xs font-extrabold text-slate-800 shadow">
                    {c.price || (c.isFree ? 'Free' : 'Paid')}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold rounded">
                    {c.provider}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md font-bold bg-brand-50 text-brand-700">
                        {c.skill}
                      </span>
                      {c.domain && (
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-600">
                          {c.domain}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {c.rating} ({c.reviewsCount || 1000})
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.duration}
                    </span>
                    <span>Level: {c.level}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No courses match the criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters to explore all available skills.</p>
        </div>
      )}
    </div>
  );
};
