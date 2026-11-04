const API_BASE = '/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem('skillbridge_token');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('skillbridge_unauthorized'));
    }
  }
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
};

export const api = {
  // Auth
  register: (payload) => fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  login: (credentials) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(credentials)
  }).then(handleResponse),

  googleLogin: (payload) => fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  getMe: () => fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  // User Profile & Skills
  getDomains: () => fetch(`${API_BASE}/users/domains`, {
    headers: getHeaders(false)
  }).then(handleResponse),

  getProfile: () => fetch(`${API_BASE}/users/profile`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  updateProfile: (updates) => fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(updates)
  }).then(handleResponse),

  addSkill: (skill) => fetch(`${API_BASE}/users/skills`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(skill)
  }).then(handleResponse),

  removeSkill: (skillName) => fetch(`${API_BASE}/users/skills/${encodeURIComponent(skillName)}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  }).then(handleResponse),

  getSkillGap: (roleOrDomain, jobId) => {
    const params = new URLSearchParams();
    if (roleOrDomain) {
      params.append('domain', roleOrDomain);
      params.append('role', roleOrDomain);
    }
    if (jobId) params.append('jobId', jobId);
    return fetch(`${API_BASE}/users/skill-gap?${params.toString()}`, {
      headers: getHeaders(true)
    }).then(handleResponse);
  },

  saveResume: (resumeData) => fetch(`${API_BASE}/users/resume`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ resumeData })
  }).then(handleResponse),

  getAllStudents: (search) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetch(`${API_BASE}/users/all${params}`, {
      headers: getHeaders(true)
    }).then(handleResponse);
  },

  // Jobs
  getJobs: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/jobs?${params.toString()}`, {
      headers: getHeaders(true)
    }).then(handleResponse);
  },

  getJobById: (id) => fetch(`${API_BASE}/jobs/${id}`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  createJob: (jobData) => fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(jobData)
  }).then(handleResponse),

  updateJob: (id, jobData) => fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(jobData)
  }).then(handleResponse),

  deleteJob: (id) => fetch(`${API_BASE}/jobs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  }).then(handleResponse),

  toggleBookmarkJob: (id) => fetch(`${API_BASE}/jobs/${id}/bookmark`, {
    method: 'POST',
    headers: getHeaders(true)
  }).then(handleResponse),

  // Applications
  applyJob: (payload) => fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  getMyApplications: () => fetch(`${API_BASE}/applications/my`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  getAllApplications: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/applications/all?${params.toString()}`, {
      headers: getHeaders(true)
    }).then(handleResponse);
  },

  updateApplicationStatus: (id, payload) => fetch(`${API_BASE}/applications/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  withdrawApplication: (id) => fetch(`${API_BASE}/applications/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  }).then(handleResponse),

  // Courses
  getCourses: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/courses?${params.toString()}`, {
      headers: getHeaders(false)
    }).then(handleResponse);
  },

  getRecommendedCourses: () => fetch(`${API_BASE}/courses/recommended`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  createCourse: (payload) => fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  deleteCourse: (id) => fetch(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  }).then(handleResponse),

  // Assessments
  getAssessments: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/assessments?${params.toString()}`, {
      headers: getHeaders(false)
    }).then(handleResponse);
  },

  getAssessmentById: (id) => fetch(`${API_BASE}/assessments/${id}`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  submitAssessment: (id, answers) => fetch(`${API_BASE}/assessments/${id}/submit`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ answers })
  }).then(handleResponse),

  getMyAssessmentResults: () => fetch(`${API_BASE}/assessments/my/results`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  // Mentors
  getMentors: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/mentors?${params.toString()}`, {
      headers: getHeaders(false)
    }).then(handleResponse);
  },

  requestMentorship: (mentorId, payload) => fetch(`${API_BASE}/mentors/${mentorId}/request`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  }).then(handleResponse),

  getMyMentorships: () => fetch(`${API_BASE}/mentors/my/requests`, {
    headers: getHeaders(true)
  }).then(handleResponse),

  // AI & Analytics
  analyzeResumeAI: (resumeText, targetRole) => fetch(`${API_BASE}/ai/resume-analyze`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ resumeText, targetRole })
  }).then(handleResponse),

  getCareerRoadmap: (targetRole) => fetch(`${API_BASE}/ai/career-roadmap`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ targetRole })
  }).then(handleResponse),

  getAdminStats: () => fetch(`${API_BASE}/analytics/dashboard`, {
    headers: getHeaders(true)
  }).then(handleResponse)
};
