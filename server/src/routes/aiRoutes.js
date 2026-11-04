const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Comprehensive dictionary of technical skills for ATS extraction
const SKILL_DATABASE = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'html', 'css', 'sql',
  // Frontend
  'react', 'react.js', 'vue', 'vue.js', 'angular', 'next.js', 'svelte', 'redux', 'tailwind', 'tailwind css', 'bootstrap', 'sass',
  // Backend
  'node.js', 'node', 'express', 'express.js', 'django', 'fastapi', 'flask', 'spring boot', 'nest.js', 'graphql', 'rest api', 'restful',
  // Databases & Caches
  'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'firebase',
  // DevOps & Cloud
  'docker', 'kubernetes', 'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'ci/cd', 'github actions', 'jenkins', 'linux', 'terraform', 'nginx',
  // Data & AI
  'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'nlp', 'data analysis',
  // Tools & Practices
  'git', 'github', 'agile', 'scrum', 'jira', 'microservices', 'system design', 'unit testing', 'jest', 'cypress'
];

const ACTION_VERBS = [
  'developed', 'built', 'created', 'designed', 'implemented', 'architected', 'optimized',
  'engineered', 'spearheaded', 'automated', 'deployed', 'scaled', 'reduced', 'improved',
  'orchestrated', 'streamlined', 'collaborated', 'mentored', 'integrated'
];

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @route   POST /api/ai/resume-analyze
// @desc    Advanced ATS Resume Analysis & scoring engine
router.post('/resume-analyze', protect, async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the text content of the resume (at least 50 characters)'
      });
    }

    const textLower = resumeText.toLowerCase();

    // 1. Extract Skills
    const extractedSkillsSet = new Set();
    SKILL_DATABASE.forEach(skill => {
      const escaped = escapeRegex(skill);
      // For skills with non-word symbols like c++, avoid trailing \b
      const regex = new RegExp(`(^|\\s|[.,;()/])${escaped}($|\\s|[.,;()/])`, 'i');
      if (regex.test(textLower)) {
        // Format neatly
        extractedSkillsSet.add(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    const extractedSkills = Array.from(extractedSkillsSet);

    // 2. Section Checks
    const sections = {
      contact: /(email|phone|github|linkedin|contact)/i.test(textLower),
      education: /(education|bachelor|b\.tech|degree|university|college|cgpa|gpa)/i.test(textLower),
      experienceOrProjects: /(experience|internship|projects|work history)/i.test(textLower),
      skills: /(skills|technical skills|technologies|proficiencies)/i.test(textLower),
      summary: /(summary|objective|profile|about me)/i.test(textLower)
    };

    let sectionScore = 0;
    if (sections.contact) sectionScore += 20;
    if (sections.education) sectionScore += 20;
    if (sections.experienceOrProjects) sectionScore += 25;
    if (sections.skills) sectionScore += 25;
    if (sections.summary) sectionScore += 10;

    // 3. Action Verbs Check
    const foundVerbs = ACTION_VERBS.filter(verb => 
      new RegExp(`\\b${verb}\\b`, 'i').test(textLower)
    );
    const verbScore = Math.min(Math.round((foundVerbs.length / 6) * 100), 100);

    // 4. Quantifiable Impact & Numbers
    const numbersCount = (resumeText.match(/\b\d+(\.\d+)?%?\b/g) || []).length;
    const impactScore = Math.min(Math.round((numbersCount / 5) * 100), 100);

    // 5. Target Role Alignment
    const roleProfiles = {
      'Full Stack Developer': ['javascript', 'react', 'node.js', 'express', 'mongodb', 'docker', 'git', 'sql'],
      'Frontend Engineer': ['javascript', 'react', 'html', 'css', 'typescript', 'tailwind', 'redux'],
      'Backend Engineer': ['node.js', 'express', 'mongodb', 'postgresql', 'docker', 'redis', 'rest api'],
      'Cloud & DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'git'],
      'Data Scientist / AI Engineer': ['python', 'machine learning', 'pandas', 'numpy', 'sql']
    };

    const target = targetRole || req.user.targetRole || 'Full Stack Developer';
    const requiredSkillsForRole = roleProfiles[target] || roleProfiles['Full Stack Developer'];

    const matchedTargetSkills = [];
    const missingTargetSkills = [];

    requiredSkillsForRole.forEach(skill => {
      const escaped = escapeRegex(skill);
      const regex = new RegExp(`(^|\\s|[.,;()/])${escaped}($|\\s|[.,;()/])`, 'i');
      if (regex.test(textLower)) {
        matchedTargetSkills.push(skill);
      } else {
        missingTargetSkills.push(skill);
      }
    });

    const roleAlignmentScore = Math.round((matchedTargetSkills.length / requiredSkillsForRole.length) * 100);

    // Composite ATS Score (Weighted)
    // 30% Role Skills Match, 25% Section Completeness, 20% Action Verbs, 15% Impact Metrics, 10% Skill Breadth
    const breadthScore = Math.min(extractedSkills.length * 8, 100);
    const overallScore = Math.round(
      (roleAlignmentScore * 0.35) +
      (sectionScore * 0.25) +
      (verbScore * 0.15) +
      (impactScore * 0.15) +
      (breadthScore * 0.10)
    );

    // Recommendations Generator
    const suggestions = [];
    if (!sections.summary) {
      suggestions.push({
        type: 'warning',
        title: 'Missing Professional Summary',
        desc: 'Add a concise 2-3 sentence summary at the top highlighting your engineering passion and key strengths.'
      });
    }

    if (missingTargetSkills.length > 0) {
      suggestions.push({
        type: 'critical',
        title: `Add Missing Key Skills for ${target}`,
        desc: `Recruiters and ATS algorithms screen for: ${missingTargetSkills.slice(0, 4).join(', ')}. If you have experience with these, incorporate them into your project descriptions.`
      });
    }

    if (foundVerbs.length < 4) {
      suggestions.push({
        type: 'tip',
        title: 'Use Strong Action Verbs',
        desc: 'Begin bullet points with strong impact verbs like "Architected", "Engineered", "Optimized", or "Spearheaded".'
      });
    }

    if (numbersCount < 3) {
      suggestions.push({
        type: 'tip',
        title: 'Quantify Accomplishments & Impact',
        desc: 'Recruiters look for measurable metrics. E.g., "Reduced API latency by 35%", "Maintained 99.9% uptime", or "Served 500+ active users".'
      });
    }

    if (extractedSkills.length < 5) {
      suggestions.push({
        type: 'warning',
        title: 'Expand Technical Stack Section',
        desc: 'Group skills neatly into categories: Frontend, Backend, Databases, and Developer Tools.'
      });
    }

    res.json({
      success: true,
      analysis: {
        overallScore,
        targetRole: target,
        roleAlignmentScore,
        sectionScore,
        impactScore,
        verbScore,
        extractedSkills,
        matchedTargetSkills,
        missingTargetSkills,
        foundVerbs,
        sectionsFound: sections,
        suggestions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error analyzing resume', error: err.message });
  }
});

// @route   POST /api/ai/career-roadmap
// @desc    Generate personalized upskilling milestones based on current skills vs target role
router.post('/career-roadmap', protect, async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;
    const role = targetRole || req.user.targetRole || 'Full Stack Developer';

    const roadmaps = {
      'Full Stack Developer': [
        {
          week: 'Weeks 1-2',
          title: 'Advanced JavaScript & React Patterns',
          topics: ['Asynchronous JS & Event Loop', 'Custom Hooks & State Management', 'Performance Optimization (useMemo, React.memo)'],
          project: 'Interactive Dashboard with Real-time Filters'
        },
        {
          week: 'Weeks 3-4',
          title: 'Backend Mastery with Node.js & Express',
          topics: ['RESTful API Architecture', 'JWT Authentication & Security', 'Database Modeling with MongoDB/Mongoose'],
          project: 'Secure Microservices Auth & CRUD API'
        },
        {
          week: 'Weeks 5-6',
          title: 'Containers, DevOps & Deployment',
          topics: ['Dockerizing Fullstack Apps', 'CI/CD with GitHub Actions', 'Cloud Deployment on AWS/Render/Vercel'],
          project: 'Automated Containerized Production Deployment'
        },
        {
          week: 'Weeks 7-8',
          title: 'Mock Technical Interviews & System Design',
          topics: ['Data Structures & Algorithms in JS', 'System Design Fundamentals (Caching, Load Balancing)', 'Behavioral STAR Method'],
          project: 'Complete Capstone Portfolio Project'
        }
      ]
    };

    const plan = roadmaps[role] || roadmaps['Full Stack Developer'];

    res.json({
      success: true,
      targetRole: role,
      plan
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating roadmap', error: err.message });
  }
});

module.exports = router;
