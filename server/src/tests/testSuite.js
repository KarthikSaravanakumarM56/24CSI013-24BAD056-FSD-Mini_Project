/**
 * SkillBridge Automated Integration Test Suite
 * Tests all 7 required modules and evaluation criteria:
 * 1. Authentication & Security
 * 2. Profile & Skills CRUD
 * 3. Skill-Gap Analysis
 * 4. Assessments & Badges
 * 5. Job Matching
 * 6. Application Pipeline
 * 7. AI Resume & Admin Analytics
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting SkillBridge Full Stack Integration Tests');
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      failed++;
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  const testEmail = `test.student_${Date.now()}@skillbridge.edu`;
  const testPassword = 'Password@123';
  let authToken = null;
  let testUserId = null;
  let sampleJobId = null;
  let sampleAssessmentId = null;
  let sampleApplicationId = null;

  // --- MODULE 1: AUTHENTICATION & SECURITY ---
  console.log('\n--- MODULE 1: AUTHENTICATION & VALIDATION ---');
  
  await test('1.1 Health Check Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'OK', 'Expected status: OK');
  });

  await test('1.2 Input Validation - Reject Invalid Email', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User',
        email: 'invalid-email-format',
        password: '123'
      })
    });
    assert(res.status === 400, `Expected 400 Bad Request, got ${res.status}`);
  });

  await test('1.3 Student Registration', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: testEmail,
        password: testPassword,
        role: 'student',
        studentStatus: 'Passed Out Graduate (Alumni)',
        passOutYear: 2024,
        college: 'Test Institute of Technology',
        targetRole: 'Full Stack Developer',
        skills: [
          { name: 'JavaScript', level: 'Intermediate' },
          { name: 'React', level: 'Intermediate' }
        ]
      })
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, 'Expected success: true');
    assert(data.token, 'Expected JWT token in response');
    authToken = data.token;
    testUserId = data.user.id;
  });

  await test('1.4 Student Login with Credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.token, 'Login should return JWT');
  });

  await test('1.5 Get Current User Profile via Token', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.user.email === testEmail, 'Email should match');
  });

  // --- MODULE 2: PROFILE & SKILLS CRUD ---
  console.log('\n--- MODULE 2: PROFILE & SKILLS CRUD ---');

  await test('2.1 Add New Skill (MongoDB)', async () => {
    const res = await fetch(`${BASE_URL}/users/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ name: 'MongoDB', level: 'Beginner' })
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const hasMongo = data.currentSkills.some(s => s.name.toLowerCase() === 'mongodb');
    assert(hasMongo, 'Skill MongoDB should be added');
  });

  await test('2.2 Update Profile Details', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        headline: 'Aspiring Full Stack Engineer',
        bio: 'Passed out graduate ready for immediate hire'
      })
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.user.headline === 'Aspiring Full Stack Engineer', 'Headline updated');
  });

  await test('2.3 Delete Skill', async () => {
    const res = await fetch(`${BASE_URL}/users/skills/MongoDB`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const hasMongo = data.currentSkills.some(s => s.name.toLowerCase() === 'mongodb');
    assert(!hasMongo, 'Skill MongoDB should be deleted');
  });

  // --- MODULE 3: SKILL-GAP ANALYSIS ---
  console.log('\n--- MODULE 3: SKILL-GAP ANALYSIS ---');

  await test('3.1 Calculate Skill-Gap Analysis for Role', async () => {
    const res = await fetch(`${BASE_URL}/users/skill-gap?role=Full%20Stack%20Developer`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.data.matchPercentage === 'number', 'Match percentage must be a number');
    assert(Array.isArray(data.data.missingSkills), 'missingSkills must be an array');
    assert(Array.isArray(data.data.acquiredSkills), 'acquiredSkills must be an array');
  });

  // --- MODULE 4: ASSESSMENTS & BADGES ---
  console.log('\n--- MODULE 4: ASSESSMENTS & BADGES ---');

  await test('4.1 Fetch Available Assessments', async () => {
    const res = await fetch(`${BASE_URL}/assessments`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.assessments) && data.assessments.length > 0, 'Should return assessments');
    const jsAssessment = data.assessments.find(a => a.skill === 'JavaScript') || data.assessments[0];
    sampleAssessmentId = jsAssessment._id;
  });

  await test('4.2 Submit Assessment and Earn Passing Badge', async () => {
    // JavaScript assessment correct answers: [2, 0, 0, 1, 1]
    const correctAnswers = [2, 0, 0, 1, 1];

    const res = await fetch(`${BASE_URL}/assessments/${sampleAssessmentId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ answers: correctAnswers })
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.scorePercent === 100, `Expected score 100, got ${data.scorePercent}`);
    assert(data.passed === true, 'Result should be passed');
  });

  // --- MODULE 5: JOBS & MATCHING ---
  console.log('\n--- MODULE 5: JOBS & MATCHING ---');

  await test('5.1 Fetch Job Listings with Match Scores', async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.jobs) && data.jobs.length > 0, 'Should return jobs');
    sampleJobId = data.jobs[0]._id;
    assert(data.jobs[0].match && typeof data.jobs[0].match.score === 'number', 'Job should include calculated match.score');
  });

  await test('5.2 Bookmark a Job', async () => {
    const res = await fetch(`${BASE_URL}/jobs/${sampleJobId}/bookmark`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.isBookmarked === 'boolean', 'Response should contain isBookmarked status');
  });

  // --- MODULE 6: APPLICATION PIPELINE ---
  console.log('\n--- MODULE 6: APPLICATION SYSTEM ---');

  await test('6.1 Apply for a Job', async () => {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: sampleJobId,
        coverLetter: 'I am a highly motivated passed out graduate eager to contribute.'
      })
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.application._id, 'Application created with ID');
    sampleApplicationId = data.application._id;
  });

  await test('6.2 Prevent Duplicate Job Application', async () => {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: sampleJobId,
        coverLetter: 'Duplicate application test'
      })
    });
    assert(res.status === 400, `Expected 400 for duplicate application, got ${res.status}`);
  });

  await test('6.3 Fetch Student Applications', async () => {
    const res = await fetch(`${BASE_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.applications) && data.applications.length > 0, 'Must return submitted application');
  });

  // --- MODULE 7: AI RESUME & ANALYTICS ---
  console.log('\n--- MODULE 7: AI RESUME & ANALYTICS ---');

  await test('7.1 AI Resume Analysis', async () => {
    const sampleResume = `
      John Doe - Full Stack Developer
      Email: john@example.com | Phone: 9876543210 | GitHub: github.com/john
      Summary: Passionate Full Stack Software Engineer skilled in modern web development.
      Skills: React, JavaScript, Node.js, Express, MongoDB, Git, HTML, CSS.
      Experience: Architected and built full-stack e-commerce web platform with authentication and payments. Reduced API latency by 35%.
      Education: B.Tech in Computer Science, 2024. CGPA: 8.8.
    `;
    const res = await fetch(`${BASE_URL}/ai/resume-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        resumeText: sampleResume,
        targetRole: 'Full Stack Developer'
      })
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.analysis.overallScore === 'number', 'Analysis should return numeric overallScore');
    assert(Array.isArray(data.analysis.suggestions), 'Suggestions should be an array');
  });

  await test('7.2 Security - Prevent Student Access to Admin Dashboard (403)', async () => {
    const res = await fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden for student, got ${res.status}`);
  });

  await test('7.3 Admin Analytics Dashboard with Admin Token', async () => {
    // Login as seeded admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@skillbridge.edu',
        password: 'admin123'
      })
    });
    assert(loginRes.status === 200, 'Admin login should succeed');
    const loginData = await loginRes.json();
    const adminToken = loginData.token;

    const res = await fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200, `Expected 200 for admin, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.stats.totalStudents === 'number', 'Stats must include totalStudents');
    assert(typeof data.stats.totalJobs === 'number', 'Stats must include totalJobs');
    assert(typeof data.stats.totalApplications === 'number', 'Stats must include totalApplications');
  });

  console.log('\n====================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All SkillBridge integration tests PASSED successfully!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
