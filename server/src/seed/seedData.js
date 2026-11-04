const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Mentor = require('../models/Mentor');
const Application = require('../models/Application');
const { connectDB, disconnectDB } = require('../config/db');

const seedAll = async () => {
  try {
    console.log('[Seed] Starting database seeding with 12 Career Domains...');

    // Clear existing collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Course.deleteMany({});
    await Assessment.deleteMany({});
    await Mentor.deleteMany({});
    await Application.deleteMany({});

    // Hash passwords
    const studentPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // 1. Create Users
    const studentUser = await User.create({
      name: 'Aarav Sharma',
      email: 'student@skillbridge.edu',
      password: studentPassword,
      role: 'student',
      headline: 'Final Year B.Tech CSE Student | Full Stack & Software Engineering',
      bio: 'Enthusiastic full-stack engineer passionate about building scalable web applications. Strong foundations in JavaScript, React, and MongoDB, actively closing skill gaps in Node.js, Express, and Docker.',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      college: 'National Institute of Engineering (NIE)',
      degree: 'B.Tech in Computer Science and Engineering',
      department: 'Computer Science and Engineering (CSE)',
      domain: 'Full Stack Development',
      graduationYear: 2026,
      cgpa: '8.7',
      targetRole: 'Full Stack Developer',
      studentStatus: 'Current Student',
      noticePeriod: 'Available for Immediate Internship',
      currentSkills: [
        { name: 'React', level: 'Intermediate', verified: true },
        { name: 'JavaScript', level: 'Intermediate', verified: true },
        { name: 'MongoDB', level: 'Beginner', verified: false }
      ],
      github: 'https://github.com/aaravsharma-dev',
      linkedin: 'https://linkedin.com/in/aaravsharma',
      portfolio: 'https://aaravsharma.dev',
      badges: [
        { skill: 'React', score: 85, awardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { skill: 'JavaScript', score: 90, awardedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
      ],
      resumeData: {
        personal: {
          fullName: 'Aarav Sharma',
          email: 'student@skillbridge.edu',
          phone: '+91 98765 43210',
          location: 'Bangalore, Karnataka, India',
          linkedin: 'linkedin.com/in/aaravsharma',
          github: 'github.com/aaravsharma-dev'
        },
        summary: 'Proactive Computer Science undergraduate with hands-on experience developing responsive web applications using React, JavaScript, and MongoDB. Seeking Full Stack Developer opportunities.',
        education: [
          {
            degree: 'B.Tech in Computer Science and Engineering',
            institution: 'National Institute of Engineering',
            year: '2022 - 2026',
            grade: 'CGPA: 8.7 / 10'
          }
        ],
        skills: ['React', 'JavaScript (ES6+)', 'MongoDB', 'HTML5/CSS3', 'Git & GitHub', 'REST APIs', 'Node.js', 'Express', 'Docker'],
        projects: [
          {
            title: 'Campus Placement & Job Diagnostic Portal',
            tech: 'React, Node.js, MongoDB, Tailwind CSS',
            points: [
              'Architected full-stack platform serving campus candidates with automated skill-gap analysis.',
              'Secured REST APIs with JWT authentication and role-based permissions.'
            ]
          }
        ],
        experience: [
          {
            role: 'Web Development Intern',
            company: 'TechNovation Labs',
            duration: 'June 2025 - August 2025',
            points: ['Collaborated with senior engineers to build reusable React components with 28% faster page loads.']
          }
        ],
        certifications: [
          'Meta Front-End Developer Professional Certificate (Coursera)',
          'JavaScript Algorithms and Data Structures (freeCodeCamp)'
        ]
      }
    });

    const adminUser = await User.create({
      name: 'Prof. Priya Nair',
      email: 'admin@skillbridge.edu',
      password: adminPassword,
      role: 'admin',
      headline: 'Director of University Placements & Career Affairs',
      bio: 'Dedicated to empowering students across all 12 technical and management domains with industry-aligned skill building.',
      college: 'SkillBridge University Network',
      department: 'Computer Science and Engineering (CSE)',
      degree: 'M.Tech / Ph.D in Computer Science',
      location: 'Bangalore, India'
    });

    const studentUser2 = await User.create({
      name: 'Ananya Patel',
      email: 'ananya@skillbridge.edu',
      password: studentPassword,
      role: 'student',
      headline: 'AI & Data Science Enthusiast | Aspiring ML Engineer',
      college: 'PES University',
      degree: 'B.Tech in Artificial Intelligence',
      department: 'Artificial Intelligence and Data Science (AI & DS)',
      domain: 'AI & Machine Learning',
      graduationYear: 2026,
      studentStatus: 'Current Student',
      targetRole: 'AI & Machine Learning Engineer',
      currentSkills: [
        { name: 'Python', level: 'Advanced', verified: true },
        { name: 'Machine Learning', level: 'Intermediate', verified: true },
        { name: 'Pandas', level: 'Advanced', verified: true },
        { name: 'NumPy', level: 'Intermediate', verified: true }
      ]
    });

    const alumniUser = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha.alumni@gmail.com',
      password: studentPassword,
      role: 'student',
      isGoogleUser: true,
      googleId: 'goog_alumni_2024',
      headline: 'Passed Out Software Graduate (Alumni) | Immediate Joiner',
      bio: '2024 B.Tech CSE Graduate actively applying for Full Stack Engineer roles. Experienced in MERN stack, Docker, and REST API development. Available for immediate hire.',
      college: 'National Institute of Engineering',
      degree: 'B.Tech in Computer Science',
      department: 'Computer Science and Engineering (CSE)',
      domain: 'Full Stack Development',
      graduationYear: 2024,
      cgpa: '8.9',
      studentStatus: 'Passed Out Graduate (Alumni)',
      noticePeriod: 'Immediate Joiner (Available Today)',
      targetRole: 'Full Stack Developer',
      currentSkills: [
        { name: 'React', level: 'Advanced', verified: true },
        { name: 'JavaScript', level: 'Advanced', verified: true },
        { name: 'Node.js', level: 'Intermediate', verified: true },
        { name: 'MongoDB', level: 'Intermediate', verified: true },
        { name: 'Express', level: 'Intermediate', verified: false }
      ],
      badges: [
        { skill: 'React', score: 95, awardedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { skill: 'JavaScript', score: 90, awardedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) }
      ]
    });

    // 2. Create Jobs across All 12 Domains
    const jobs = await Job.create([
      // 1. Full Stack Development
      {
        title: 'Full Stack Developer Intern',
        company: 'Razorpay',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        type: 'Internship',
        salary: '₹40,000 / month',
        experience: 'Fresher (2025/2026 batch)',
        domain: 'Full Stack Development',
        requiredSkills: ['React', 'JavaScript', 'MongoDB', 'Node.js', 'Express', 'Docker'],
        optionalSkills: ['TypeScript', 'Redis', 'AWS'],
        description: 'Join the merchant dashboard engineering team at Razorpay to build payment interfaces and robust backend microservices handling millions of daily transactions.',
        responsibilities: [
          'Develop modular, accessible React UI components with responsive layouts.',
          'Build and test RESTful APIs in Node.js and Express connected to MongoDB.',
          'Containerize microservices using Docker for streamlined local development.'
        ],
        requirements: [
          'Strong command of JavaScript (ES6+), React hooks, and asynchronous programming.',
          'Knowledge of backend development with Node.js and Express.',
          'Familiarity with MongoDB schema design and basic Docker concepts.'
        ],
        openings: 5,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 2. AI & Machine Learning
      {
        title: 'AI & Machine Learning Engineer Trainee',
        company: 'NVIDIA AI Labs',
        logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        type: 'Full-time',
        salary: '₹14 - 18 LPA',
        experience: 'Fresher (0-1 yr)',
        domain: 'AI & Machine Learning',
        requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas'],
        optionalSkills: ['NLP', 'Computer Vision', 'CUDA'],
        description: 'Collaborate with researchers on neural model optimization, deep learning pipelines, and generative AI inference architectures.',
        responsibilities: [
          'Train, evaluate, and benchmark deep learning models using PyTorch.',
          'Preprocess massive datasets with Pandas and NumPy.',
          'Deploy optimized models to cloud inference endpoints.'
        ],
        requirements: [
          'Strong Python programming and mathematical foundation in linear algebra/calculus.',
          'Hands-on experience with PyTorch, TensorFlow, and Scikit-Learn.',
          'Passion for modern AI architectures like Transformers.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 3. Data Science
      {
        title: 'Junior Data Scientist & BI Analyst',
        company: 'Fractal Analytics',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
        location: 'Mumbai / Remote',
        workMode: 'Remote',
        type: 'Full-time',
        salary: '₹10 - 13 LPA',
        experience: 'Fresher / Graduate',
        domain: 'Data Science',
        requiredSkills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Tableau'],
        optionalSkills: ['Power BI', 'Statistics', 'Scikit-Learn'],
        description: 'Perform exploratory data analysis, write complex SQL aggregations, and build executive predictive dashboards for Fortune 500 enterprises.',
        responsibilities: [
          'Write high-performance SQL queries across large data warehouses.',
          'Conduct statistical modeling and hypothesis testing with Pandas.',
          'Design interactive dashboards in Tableau and Power BI.'
        ],
        requirements: [
          'Strong analytical mindset with proficiency in SQL and Python.',
          'Familiarity with data visualization best practices.'
        ],
        openings: 4,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 4. Cybersecurity
      {
        title: 'Associate SOC Cybersecurity Analyst',
        company: 'Palo Alto Networks',
        logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'On-site',
        type: 'Full-time',
        salary: '₹9 - 12 LPA',
        experience: 'Fresher (0-1 yr)',
        domain: 'Cybersecurity',
        requiredSkills: ['Network Security', 'Ethical Hacking', 'Linux', 'Cryptography', 'Wireshark', 'Firewalls'],
        optionalSkills: ['SIEM', 'Penetration Testing', 'Incident Response'],
        description: 'Monitor enterprise security events, perform network packet inspection, investigate anomalies, and configure defensive perimeter firewalls.',
        responsibilities: [
          'Analyze security logs and alerts in 24/7 Security Operations Center.',
          'Perform vulnerability scans and triage packet captures in Wireshark.',
          'Assist in incident response and containment workflows.'
        ],
        requirements: [
          'Solid understanding of TCP/IP networking, Linux, and OSI layer protocols.',
          'Knowledge of ethical hacking methodology and common CVEs.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 5. Cloud Computing
      {
        title: 'Junior Cloud & DevOps Engineer',
        company: 'Cloudreach (AWS Partner)',
        logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=60',
        location: 'Hyderabad / Remote',
        workMode: 'Remote',
        type: 'Full-time',
        salary: '₹11 - 15 LPA',
        experience: 'Fresher (0-1 yr)',
        domain: 'Cloud Computing',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Terraform'],
        optionalSkills: ['Azure', 'Python', 'Networking'],
        description: 'Automate containerized multi-cloud infrastructure deployments using Terraform, Docker, and GitHub Actions CI/CD pipelines.',
        responsibilities: [
          'Provision AWS cloud infrastructure using Infrastructure as Code (Terraform).',
          'Build automated CI/CD deployment pipelines.',
          'Manage Kubernetes clusters and container health metrics.'
        ],
        requirements: [
          'Familiarity with AWS core services (EC2, S3, IAM, VPC, EKS).',
          'Proficiency with Linux shell scripting and Docker containerization.'
        ],
        openings: 4,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 6. Mobile App Development
      {
        title: 'React Native Mobile Developer Intern',
        company: 'Swiggy',
        logo: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        type: 'Internship',
        salary: '₹35,000 / month',
        experience: 'Fresher (2025/2026 batch)',
        domain: 'Mobile App Development',
        requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile UI/UX', 'REST APIs', 'Firebase'],
        optionalSkills: ['Flutter', 'State Management', 'Git'],
        description: 'Craft high-performance consumer delivery mobile application screens in React Native running seamlessly across iOS and Android.',
        responsibilities: [
          'Develop smooth mobile component screens with gesture handling.',
          'Integrate real-time GPS tracking and REST APIs.',
          'Ensure offline storage and fast bundle boot times.'
        ],
        requirements: [
          'Proficiency in JavaScript, TypeScript, and React / React Native.',
          'Understanding of mobile navigation and state architectures.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 7. UI/UX Design
      {
        title: 'Associate Product UI/UX Designer',
        company: 'Canva Design Hub',
        logo: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'Remote',
        type: 'Full-time',
        salary: '₹8 - 12 LPA',
        experience: 'Fresher (Portfolio Required)',
        domain: 'UI/UX Design',
        requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems'],
        optionalSkills: ['User Testing', 'Adobe XD', 'Visual Hierarchy'],
        description: 'Design intuitive, human-centered web and mobile experiences. Create wireframes, interactive Figma prototypes, and scalable design tokens.',
        responsibilities: [
          'Conduct user interviews and synthesize journey maps.',
          'Design high-fidelity mockups in Figma with reusable component variants.',
          'Collaborate with frontend engineers for design handoffs.'
        ],
        requirements: [
          'Demonstrated portfolio showcasing user-centric UX case studies.',
          'Strong mastery of Figma auto-layout, components, and prototyping.'
        ],
        openings: 2,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 8. IoT
      {
        title: 'Embedded IoT Systems Engineer',
        company: 'Bosch Engineering',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'On-site',
        type: 'Full-time',
        salary: '₹9 - 13 LPA',
        experience: 'Fresher / Graduate',
        domain: 'IoT',
        requiredSkills: ['Arduino', 'Raspberry Pi', 'C/C++', 'MQTT', 'Embedded C', 'Sensors & Actuators'],
        optionalSkills: ['Python', 'IoT Protocols', 'Circuit Design'],
        description: 'Connect industrial sensors and edge microcontrollers to smart cloud telemetry pipelines using lightweight MQTT and C/C++.',
        responsibilities: [
          'Program microcontrollers (ESP32, STM32) and Raspberry Pi edge nodes.',
          'Interface analog/digital sensors and telemetry transceivers.',
          'Transmit encrypted sensor data over MQTT protocols.'
        ],
        requirements: [
          'Background in ECE, EEE, or CSE with hands-on microcontroller hobby projects.',
          'Solid understanding of C/C++, SPI, I2C, and UART protocols.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 9. Software Testing
      {
        title: 'QA Automation Test Engineer',
        company: 'BrowserStack',
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60',
        location: 'Mumbai / Remote',
        workMode: 'Remote',
        type: 'Full-time',
        salary: '₹8 - 11 LPA',
        experience: 'Fresher (0-1 yr)',
        domain: 'Software Testing',
        requiredSkills: ['Manual Testing', 'Selenium', 'Automation Testing', 'Postman', 'API Testing', 'Jira'],
        optionalSkills: ['JUnit/TestNG', 'Cypress', 'Bug Tracking'],
        description: 'Build automated regression testing scripts with Selenium WebDriver and Postman to ensure flawless application quality across browsers.',
        responsibilities: [
          'Author detailed test plans and test case specifications.',
          'Automate browser tests using Selenium and Postman API collections.',
          'Log and track defect life cycles in Jira.'
        ],
        requirements: [
          'Strong understanding of SDLC, STLC, and test design techniques.',
          'Knowledge of Java/Python with Selenium WebDriver and API testing.'
        ],
        openings: 4,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 10. Business & Management
      {
        title: 'Associate Product Manager (APM)',
        company: 'Flipkart',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'Hybrid',
        type: 'Full-time',
        salary: '₹15 - 20 LPA',
        experience: 'Fresher (MBA / B.Tech Graduate)',
        domain: 'Business & Management',
        requiredSkills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'Product Strategy', 'Jira', 'Excel'],
        optionalSkills: ['Financial Modeling', 'Stakeholder Management', 'Market Research'],
        description: 'Define product requirements (PRDs), run sprint backlogs with engineering teams, and analyze user behavioral analytics to drive customer retention.',
        responsibilities: [
          'Draft clear user stories, feature specs, and PRDs.',
          'Lead agile standups, backlog grooming, and sprint planning.',
          'Analyze KPI metrics to evaluate feature adoption.'
        ],
        requirements: [
          'Strong communication, problem-solving, and cross-functional leadership skills.',
          'Understanding of agile methodology, Jira, and business analysis.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 11. Digital Marketing
      {
        title: 'Digital Marketing & Growth Specialist',
        company: 'Zomato',
        logo: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=100&auto=format&fit=crop&q=60',
        location: 'Gurugram / Remote',
        workMode: 'Hybrid',
        type: 'Full-time',
        salary: '₹7 - 10 LPA',
        experience: 'Fresher (0-1 yr)',
        domain: 'Digital Marketing',
        requiredSkills: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Media Marketing', 'Meta Ads', 'Keyword Research'],
        optionalSkills: ['PPC Advertising', 'Email Marketing', 'Copywriting'],
        description: 'Execute high-impact organic search engine optimization, paid performance campaigns, and viral social media growth initiatives.',
        responsibilities: [
          'Perform keyword research and on-page/off-page SEO optimization.',
          'Manage paid campaign ads on Google Ads and Meta platforms.',
          'Track ROI and conversion funnels via Google Analytics 4.'
        ],
        requirements: [
          'Creative copywriting flair with quantitative analytical skills.',
          'Familiarity with SEO tools, Google Analytics, and ad platforms.'
        ],
        openings: 2,
        status: 'Active',
        postedBy: adminUser._id
      },
      // 12. Electronics & Embedded Systems
      {
        title: 'Embedded Firmware & Systems Engineer',
        company: 'Qualcomm',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60',
        location: 'Bangalore, India',
        workMode: 'On-site',
        type: 'Full-time',
        salary: '₹12 - 16 LPA',
        experience: 'Fresher (ECE / EEE Batch)',
        domain: 'Electronics & Embedded Systems',
        requiredSkills: ['Embedded C', 'Microcontrollers', 'PCB Design', 'Digital Electronics', 'MATLAB', 'RTOS'],
        optionalSkills: ['VLSI', 'Circuit Simulation', 'VHDL/Verilog'],
        description: 'Design low-level real-time firmware, device drivers, and printed circuit boards for next-generation mobile processing chipsets.',
        responsibilities: [
          'Write bare-metal and RTOS firmware in Embedded C.',
          'Design schematic and PCB layouts using EDA tools.',
          'Debug board-level issues with digital oscilloscopes and logic analyzers.'
        ],
        requirements: [
          'Degree in Electronics & Communication or Electrical Engineering.',
          'Strong grasp of Embedded C, microcontrollers (ARM Cortex), and digital logic.'
        ],
        openings: 3,
        status: 'Active',
        postedBy: adminUser._id
      }
    ]);

    // 3. Create Courses across All 12 Domains
    await Course.create([
      // 1. Full Stack
      {
        title: 'Full Stack Node.js, Express & MongoDB Masterclass',
        provider: 'freeCodeCamp',
        skill: 'Node.js',
        domain: 'Full Stack Development',
        category: 'Backend',
        level: 'Intermediate',
        duration: '16 Hours',
        rating: 4.9,
        reviewsCount: 3840,
        isFree: true,
        price: 'Free',
        url: 'https://www.freecodecamp.org',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60',
        description: 'Master backend architectures: asynchronous event loop, Express middleware, MongoDB Mongoose schema design, and secure JWT authentication.',
        syllabus: ['Node.js Architecture', 'Express Routing & Middleware', 'Mongoose ODM & Aggregations', 'JWT Security & Cookies']
      },
      {
        title: 'Docker & Microservices Architecture',
        provider: 'Coursera / IBM',
        skill: 'Docker',
        domain: 'Full Stack Development',
        category: 'DevOps & Cloud',
        level: 'Intermediate',
        duration: '14 Hours',
        rating: 4.85,
        reviewsCount: 2900,
        isFree: true,
        price: 'Free',
        url: 'https://www.docker.com',
        thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=60',
        description: 'Learn containerization from scratch. Build multi-stage Dockerfiles, Docker Compose networking, and cloud container deployments.',
        syllabus: ['Containers vs VMs', 'Multi-Stage Dockerfiles', 'Docker Compose for Full Stack', 'Registry Publishing']
      },
      // 2. AI & Machine Learning
      {
        title: 'Machine Learning & Deep Learning with PyTorch',
        provider: 'Coursera / DeepLearning.AI',
        skill: 'PyTorch',
        domain: 'AI & Machine Learning',
        category: 'Data & AI',
        level: 'Intermediate',
        duration: '24 Hours',
        rating: 4.95,
        reviewsCount: 7800,
        isFree: true,
        price: 'Free',
        url: 'https://pytorch.org',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60',
        description: 'Understand neural networks, backpropagation, convolutional networks, and Transformers with PyTorch and Python.',
        syllabus: ['Tensors & Autograd', 'Feedforward Neural Networks', 'CNNs for Computer Vision', 'Transformers & NLP']
      },
      // 3. Data Science
      {
        title: 'Applied Data Science with Python, SQL & Tableau',
        provider: 'freeCodeCamp',
        skill: 'SQL',
        domain: 'Data Science',
        category: 'Analytics',
        level: 'Beginner',
        duration: '20 Hours',
        rating: 4.88,
        reviewsCount: 4500,
        isFree: true,
        price: 'Free',
        url: 'https://www.tableau.com',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60',
        description: 'Learn SQL joins, subqueries, Pandas exploratory data analysis, and Tableau dashboard storytelling.',
        syllabus: ['Advanced SQL Queries', 'Pandas & NumPy Wrangling', 'Statistical Inference', 'Interactive Tableau Stories']
      },
      // 4. Cybersecurity
      {
        title: 'Hands-on Ethical Hacking & Network Defense',
        provider: 'Cybrary / YouTube',
        skill: 'Network Security',
        domain: 'Cybersecurity',
        category: 'Security',
        level: 'Intermediate',
        duration: '18 Hours',
        rating: 4.92,
        reviewsCount: 3200,
        isFree: true,
        price: 'Free',
        url: 'https://www.wireshark.org',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60',
        description: 'Perform packet sniffing in Wireshark, penetration testing in Kali Linux, and configure network firewalls.',
        syllabus: ['TCP/IP Network Analysis', 'Wireshark Packet Forensics', 'Vulnerability Assessment', 'Firewall Rules & Cryptography']
      },
      // 5. Cloud Computing
      {
        title: 'AWS Certified Solutions Architect Associate',
        provider: 'freeCodeCamp',
        skill: 'AWS',
        domain: 'Cloud Computing',
        category: 'DevOps & Cloud',
        level: 'Intermediate',
        duration: '22 Hours',
        rating: 4.9,
        reviewsCount: 6100,
        isFree: true,
        price: 'Free',
        url: 'https://aws.amazon.com',
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=60',
        description: 'Master core cloud architecture: VPC subnetting, EC2 auto-scaling, S3 security policies, IAM, and Serverless Lambda.',
        syllabus: ['AWS Core Infrastructure', 'VPC & Networking Security', 'Containers on ECS/EKS', 'High Availability Architectures']
      },
      // 6. Mobile App Development
      {
        title: 'Complete React Native Mobile App Bootcamp',
        provider: 'Udemy / Academind',
        skill: 'React Native',
        domain: 'Mobile App Development',
        category: 'Mobile',
        level: 'Intermediate',
        duration: '20 Hours',
        rating: 4.87,
        reviewsCount: 3900,
        isFree: false,
        price: '₹499',
        url: 'https://reactnative.dev',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60',
        description: 'Build native iOS and Android apps using React Native, React Navigation, Redux Toolkit, and Firebase authentication.',
        syllabus: ['React Native Components', 'Navigation & Tabs', 'Device Sensors & Maps', 'Publishing to App Stores']
      },
      // 7. UI/UX Design
      {
        title: 'Figma UI/UX Design & Scalable Design Systems',
        provider: 'Coursera / Google',
        skill: 'Figma',
        domain: 'UI/UX Design',
        category: 'Design',
        level: 'Beginner',
        duration: '15 Hours',
        rating: 4.93,
        reviewsCount: 5100,
        isFree: true,
        price: 'Free',
        url: 'https://figma.com',
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=60',
        description: 'Master Figma auto-layout, typography hierarchies, component variables, interactive prototypes, and usability testing.',
        syllabus: ['Design Thinking Fundamentals', 'Figma Auto-Layout & Variants', 'Building Design Systems', 'User Testing & Wireframing']
      },
      // 8. IoT
      {
        title: 'Master IoT: Arduino, ESP32, MQTT & Cloud Telemetry',
        provider: 'edX / MIT',
        skill: 'Arduino',
        domain: 'IoT',
        category: 'Hardware',
        level: 'Intermediate',
        duration: '18 Hours',
        rating: 4.84,
        reviewsCount: 1950,
        isFree: true,
        price: 'Free',
        url: 'https://arduino.cc',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60',
        description: 'Connect microcontrollers to the cloud using Wi-Fi, sensor interfaces, and lightweight pub/sub MQTT brokers.',
        syllabus: ['Microcontroller Architectures', 'Sensor Calibration & ADCs', 'MQTT Broker Implementation', 'Cloud IoT Dashboards']
      },
      // 9. Software Testing
      {
        title: 'Selenium WebDriver & Postman API Automation',
        provider: 'freeCodeCamp',
        skill: 'Selenium',
        domain: 'Software Testing',
        category: 'QA',
        level: 'Intermediate',
        duration: '14 Hours',
        rating: 4.88,
        reviewsCount: 2800,
        isFree: true,
        price: 'Free',
        url: 'https://selenium.dev',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60',
        description: 'Automate cross-browser regression suites with Selenium WebDriver, Page Object Model, and test REST APIs with Postman.',
        syllabus: ['Selenium Locators & Waits', 'Page Object Model (POM)', 'Postman Automated Collections', 'CI Test Integration']
      },
      // 10. Business & Management
      {
        title: 'Agile Product Management & Business Strategy',
        provider: 'Coursera / UVA',
        skill: 'Project Management',
        domain: 'Business & Management',
        category: 'Business',
        level: 'Beginner',
        duration: '12 Hours',
        rating: 4.91,
        reviewsCount: 4200,
        isFree: true,
        price: 'Free',
        url: 'https://scrum.org',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
        description: 'Learn agile sprint management, product roadmap creation, PRDs, backlog prioritization, and business analytics.',
        syllabus: ['Scrum Framework & Roles', 'Writing Effective PRDs', 'Backlog Grooming in Jira', 'Product Metric KPIs']
      },
      // 11. Digital Marketing
      {
        title: 'Digital Marketing, SEO & Growth Marketing',
        provider: 'HubSpot Academy',
        skill: 'SEO',
        domain: 'Digital Marketing',
        category: 'Marketing',
        level: 'Beginner',
        duration: '10 Hours',
        rating: 4.89,
        reviewsCount: 3600,
        isFree: true,
        price: 'Free',
        url: 'https://academy.hubspot.com',
        thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=60',
        description: 'Master organic keyword research, technical search engine optimization, Google Analytics 4, and conversion funnels.',
        syllabus: ['On-Page & Off-Page SEO', 'Google Analytics 4 Tracking', 'Social Media Paid Funnels', 'Conversion Rate Optimization']
      },
      // 12. Electronics & Embedded Systems
      {
        title: 'Embedded C Programming & ARM Cortex Architecture',
        provider: 'edX / ARM Education',
        skill: 'Embedded C',
        domain: 'Electronics & Embedded Systems',
        category: 'Hardware',
        level: 'Advanced',
        duration: '20 Hours',
        rating: 4.94,
        reviewsCount: 2200,
        isFree: true,
        price: 'Free',
        url: 'https://arm.com',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60',
        description: 'Write low-level hardware drivers, handle interrupts, configure timers and UART, and write multi-tasking RTOS code in Embedded C.',
        syllabus: ['ARM Cortex Register Architecture', 'Bitwise Manipulation in Embedded C', 'Interrupt Service Routines (ISRs)', 'FreeRTOS Task Scheduling']
      }
    ]);

    // 4. Create Skill Assessments (12 Domains Covered)
    // NOTE: Keep JavaScript as index 0 with answers [2, 0, 0, 1, 1] for integration test compatibility!
    await Assessment.create([
      // 1. Full Stack - JavaScript
      {
        skill: 'JavaScript',
        domain: 'Full Stack Development',
        title: 'JavaScript Core & Asynchronous Proficiency',
        description: 'Test your understanding of closures, event loop, promises, prototype inheritance, and modern ES6+ features.',
        category: 'Programming Languages',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Zap',
        questions: [
          {
            questionText: 'What is the output of `console.log(typeof NaN)` in JavaScript?',
            options: ['"nan"', '"undefined"', '"number"', '"object"'],
            correctOptionIndex: 2,
            explanation: 'In JavaScript, NaN (Not-a-Number) is of numeric type according to IEEE 754.'
          },
          {
            questionText: 'Which order will the numbers be logged?\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
            options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 4, 2, 3', '1, 3, 4, 2'],
            correctOptionIndex: 0,
            explanation: 'Synchronous code runs first (1, 4), then microtasks in Promise.then run next (3), and finally macrotasks in setTimeout run (2).'
          },
          {
            questionText: 'What is a closure in JavaScript?',
            options: [
              'A function bundled with references to its surrounding lexical environment',
              'A method that closes a database connection',
              'A syntax error that prevents function execution',
              'An anonymous function that runs immediately'
            ],
            correctOptionIndex: 0,
            explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).'
          },
          {
            questionText: 'Which array method returns a new array with elements that satisfy a condition without mutating original array?',
            options: ['splice()', 'filter()', 'forEach()', 'push()'],
            correctOptionIndex: 1,
            explanation: 'filter() is an immutable method that creates a shallow copy of a portion of a given array.'
          },
          {
            questionText: 'What happens when you declare a variable using `const` in JavaScript?',
            options: [
              'The variable value is entirely immutable and nested properties cannot be changed',
              'The identifier cannot be reassigned to a new memory address',
              'The variable is hoisted and accessible before declaration',
              'The variable scope is always global'
            ],
            correctOptionIndex: 1,
            explanation: '`const` creates a block-scoped constant reference. Reassigning throws a TypeError, but properties of objects can still mutate.'
          }
        ]
      },
      // 2. Full Stack - React
      {
        skill: 'React',
        domain: 'Full Stack Development',
        title: 'React Components, Hooks & Architecture',
        description: 'Validate your knowledge of React hooks, component lifecycle, virtual DOM reconciliation, and state management.',
        category: 'Frontend Development',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Award',
        questions: [
          {
            questionText: 'Why should you never call React hooks inside loops, conditions, or nested functions?',
            options: [
              'To ensure hooks are called in the exact same order on every render cycle',
              'To prevent infinite re-renders',
              'Because JavaScript does not allow nested functions',
              'Hooks only work in class components'
            ],
            correctOptionIndex: 0,
            explanation: 'React relies on the order in which hooks are called to associate hook state with the component.'
          },
          {
            questionText: 'What is the primary purpose of the `key` prop when rendering lists in React?',
            options: [
              'To style list items with unique CSS rules',
              'To help React identify which items have changed, been added, or removed for efficient reconciliation',
              'To bind DOM events to list items',
              'To store the array index as a database primary key'
            ],
            correctOptionIndex: 1,
            explanation: 'Keys allow React to identify items efficiently during virtual DOM diffing.'
          },
          {
            questionText: 'Which hook should you use to cache the result of an expensive calculation between re-renders?',
            options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
            correctOptionIndex: 1,
            explanation: 'useMemo caches calculated values across renders.'
          }
        ]
      },
      // 3. AI & Machine Learning - Python
      {
        skill: 'Python',
        domain: 'AI & Machine Learning',
        title: 'Python for AI, Machine Learning & Data Science',
        description: 'Assess foundational Python proficiencies: vectorized array operations, list comprehensions, generators, and OOP.',
        category: 'Artificial Intelligence',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Cpu',
        questions: [
          {
            questionText: 'In Python, what is the primary difference between a list and a tuple?',
            options: [
              'Lists are mutable; tuples are immutable',
              'Lists hold numbers; tuples hold strings',
              'Tuples are slower than lists',
              'Lists cannot be sliced'
            ],
            correctOptionIndex: 0,
            explanation: 'Lists can be modified in-place (mutable), while tuples cannot be changed once created (immutable).'
          },
          {
            questionText: 'What does the `yield` keyword do inside a Python function?',
            options: [
              'Terminates the program immediately',
              'Turns the function into a generator that lazily produces values one at a time',
              'Imports an external module',
              'Throws an unhandled exception'
            ],
            correctOptionIndex: 1,
            explanation: 'Yield produces a generator object, maintaining local state between successive iterations.'
          },
          {
            questionText: 'Which Python library provides high-performance N-dimensional array objects used across machine learning frameworks?',
            options: ['NumPy', 'Flask', 'BeautifulSoup', 'Pygame'],
            correctOptionIndex: 0,
            explanation: 'NumPy provides ndarray objects with C-speed vector operations.'
          }
        ]
      },
      // 4. Data Science - SQL
      {
        skill: 'SQL',
        domain: 'Data Science',
        title: 'SQL Analytics & Database Querying',
        description: 'Test relational database querying: GROUP BY, aggregates, window functions, and indexing.',
        category: 'Analytics',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'BarChart2',
        questions: [
          {
            questionText: 'What is the difference between `WHERE` and `HAVING` clauses in SQL?',
            options: [
              '`WHERE` filters rows before aggregation; `HAVING` filters grouped rows after aggregation',
              '`WHERE` only works with text; `HAVING` only works with numbers',
              '`HAVING` is executed first before `WHERE`',
              'There is no difference'
            ],
            correctOptionIndex: 0,
            explanation: 'WHERE filters individual records prior to grouping; HAVING filters aggregated groups.'
          },
          {
            questionText: 'Which SQL JOIN returns all rows from the left table and matched rows from the right table?',
            options: ['LEFT OUTER JOIN', 'INNER JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN'],
            correctOptionIndex: 0,
            explanation: 'LEFT JOIN keeps all left table rows and fills NULLs if right table matches are missing.'
          }
        ]
      },
      // 5. Cybersecurity - Network Security
      {
        skill: 'Network Security',
        domain: 'Cybersecurity',
        title: 'Network Security & Threat Analysis',
        description: 'Validate knowledge of OSI model, firewall architectures, port scanning, and cryptography.',
        category: 'Security',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Shield',
        questions: [
          {
            questionText: 'Which protocol provides end-to-end encrypted communication over the web using TLS?',
            options: ['HTTPS (Port 443)', 'HTTP (Port 80)', 'FTP (Port 21)', 'Telnet (Port 23)'],
            correctOptionIndex: 0,
            explanation: 'HTTPS operates over port 443 with TLS encryption.'
          },
          {
            questionText: 'What is the primary function of an Intrusion Detection System (IDS)?',
            options: [
              'Monitor network traffic for malicious activity and policy violations to generate alerts',
              'Encrypt hard drive partitions',
              'Assign IP addresses via DHCP',
              'Compress video files'
            ],
            correctOptionIndex: 0,
            explanation: 'An IDS inspects network packets and alerts security administrators on anomalous behavior.'
          }
        ]
      },
      // 6. Cloud Computing - AWS
      {
        skill: 'AWS',
        domain: 'Cloud Computing',
        title: 'AWS Cloud Architecture & Infrastructure',
        description: 'Assess foundational AWS services: EC2, S3, IAM, VPC, and serverless compute.',
        category: 'DevOps & Cloud',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Cloud',
        questions: [
          {
            questionText: 'What is the purpose of AWS IAM (Identity and Access Management)?',
            options: [
              'Securely manage user authentication, roles, and fine-grained resource permissions',
              'Host relational databases',
              'Route DNS traffic across continents',
              'Render React user interfaces'
            ],
            correctOptionIndex: 0,
            explanation: 'IAM controls authentication and authorizations to AWS cloud services.'
          },
          {
            questionText: 'Which AWS service provides virtually unlimited object storage with 99.999999999% durability?',
            options: ['Amazon S3', 'Amazon EBS', 'Amazon EC2', 'Amazon RDS'],
            correctOptionIndex: 0,
            explanation: 'Amazon S3 delivers 11 9s of object storage durability.'
          }
        ]
      },
      // 7. Mobile App Development - React Native
      {
        skill: 'React Native',
        domain: 'Mobile App Development',
        title: 'React Native Cross-Platform Architecture',
        description: 'Test knowledge of mobile component bridges, styling, state management, and native modules.',
        category: 'Mobile',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Smartphone',
        questions: [
          {
            questionText: 'In React Native, what core component replaces the HTML `<div>` element for layout structure?',
            options: ['<View>', '<Div>', '<Container>', '<Box>'],
            correctOptionIndex: 0,
            explanation: '<View> is the primary structural layout component in React Native mapped to native views.'
          },
          {
            questionText: 'How does React Native style layout by default?',
            options: ['Flexbox (flexDirection: column by default)', 'CSS Grid', 'Float layouts', 'Absolute positioning'],
            correctOptionIndex: 0,
            explanation: 'React Native utilizes Flexbox with vertical column direction as standard.'
          }
        ]
      },
      // 8. UI/UX Design - Figma
      {
        skill: 'Figma',
        domain: 'UI/UX Design',
        title: 'Figma Design Systems & Interaction UX',
        description: 'Validate auto-layout mastery, interactive states, design tokens, and user research heuristics.',
        category: 'Design',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Figma',
        questions: [
          {
            questionText: 'In Figma, what feature dynamically adjusts component padding and element flow when text content changes?',
            options: ['Auto Layout', 'Masking', 'Boolean Groups', 'Smart Animate'],
            correctOptionIndex: 0,
            explanation: 'Auto Layout provides flex-like fluid padding and alignment behaviors.'
          },
          {
            questionText: 'What is the primary goal of creating a "Design System"?',
            options: [
              'Ensure visual consistency, scalability, and seamless handoff between designers and developers',
              'Eliminate the need for user testing',
              'Make images load faster in the browser',
              'Replace backend databases'
            ],
            correctOptionIndex: 0,
            explanation: 'Design systems establish reusable component libraries and brand design tokens.'
          }
        ]
      },
      // 9. IoT - Arduino
      {
        skill: 'Arduino',
        domain: 'IoT',
        title: 'IoT Microcontrollers & MQTT Protocols',
        description: 'Test understanding of embedded peripherals, ADC inputs, sensors, and telemetry protocols.',
        category: 'Hardware',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Radio',
        questions: [
          {
            questionText: 'What two mandatory functions are present in every Arduino sketch program?',
            options: ['setup() and loop()', 'start() and stop()', 'init() and run()', 'main() and exit()'],
            correctOptionIndex: 0,
            explanation: 'setup() executes once upon power-on, and loop() runs continuously thereafter.'
          },
          {
            questionText: 'Why is MQTT the preferred messaging protocol for IoT sensor devices over HTTP?',
            options: [
              'Extremely lightweight publish/subscribe architecture with minimal packet header overhead',
              'It uses more bandwidth to ensure accuracy',
              'It does not require an internet connection',
              'It only works with Python'
            ],
            correctOptionIndex: 0,
            explanation: 'MQTT is optimized for high-latency, low-bandwidth, and battery-constrained IoT devices.'
          }
        ]
      },
      // 10. Software Testing - Selenium
      {
        skill: 'Selenium',
        domain: 'Software Testing',
        title: 'Software Testing & Automation Frameworks',
        description: 'Assess testing methodologies: unit testing, regression testing, locator strategies, and CI pipelines.',
        category: 'QA',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'CheckSquare',
        questions: [
          {
            questionText: 'What design pattern in test automation decouples test code from web page HTML locators?',
            options: ['Page Object Model (POM)', 'Singleton Pattern', 'Observer Pattern', 'Factory Pattern'],
            correctOptionIndex: 0,
            explanation: 'Page Object Model encapsulates web elements and actions in dedicated page classes.'
          },
          {
            questionText: 'What is regression testing?',
            options: [
              'Re-testing existing software to confirm new code modifications have not introduced bugs',
              'Testing how fast an app runs under 100,000 users',
              'Testing software without writing any test cases',
              'Deleting obsolete features'
            ],
            correctOptionIndex: 0,
            explanation: 'Regression testing ensures recent updates have not broken existing functionality.'
          }
        ]
      },
      // 11. Business & Management - Project Management
      {
        skill: 'Project Management',
        domain: 'Business & Management',
        title: 'Agile Product Strategy & Scrum Workflows',
        description: 'Test agile sprint cycles, PRD definition, stakeholder management, and product metrics.',
        category: 'Business',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Briefcase',
        questions: [
          {
            questionText: 'In the Scrum agile framework, what is the primary purpose of the Daily Standup?',
            options: [
              'A brief sync where team members share progress, plan for the day, and flag impediments',
              'A comprehensive performance review by management',
              'A salary negotiation meeting',
              'A code deployment ceremony'
            ],
            correctOptionIndex: 0,
            explanation: 'Daily standups keep the squad aligned on sprint goals and identify blockers.'
          },
          {
            questionText: 'What does a PRD (Product Requirements Document) define?',
            options: [
              'The product purpose, target audience, feature requirements, and success metrics',
              'The exact CSS code for buttons',
              'The company legal incorporation filing',
              'Employee vacation schedules'
            ],
            correctOptionIndex: 0,
            explanation: 'A PRD guides the engineering and design team on what to build and why.'
          }
        ]
      },
      // 12. Electronics & Embedded Systems - Embedded C
      {
        skill: 'Embedded C',
        domain: 'Electronics & Embedded Systems',
        title: 'Embedded C & Microcontroller Firmware',
        description: 'Assess low-level register manipulation, interrupts, memory maps, and real-time operating systems.',
        category: 'Hardware',
        durationMinutes: 15,
        passingScorePercent: 70,
        difficulty: 'Medium',
        badgeIcon: 'Cpu',
        questions: [
          {
            questionText: 'What does the `volatile` keyword inform the C compiler when declared on a hardware register pointer?',
            options: [
              'The variable value may change unexpectedly at any time outside compiler control; disable caching optimizations',
              'The variable is stored on the GPU',
              'The variable should be deleted immediately after execution',
              'The variable is permanently constant'
            ],
            correctOptionIndex: 0,
            explanation: 'volatile prevents the compiler from optimizing away reads of hardware memory-mapped registers.'
          },
          {
            questionText: 'What is an ISR (Interrupt Service Routine) in embedded systems?',
            options: [
              'A special callback function automatically triggered when a hardware interrupt event occurs',
              'An infinite while loop',
              'A database backup routine',
              'A web server listening on port 80'
            ],
            correctOptionIndex: 0,
            explanation: 'An ISR responds swiftly to hardware events (timer ticks, pin changes) with high priority.'
          }
        ]
      }
    ]);

    // 5. Create Industry Mentors across Domains
    await Mentor.create([
      {
        name: 'Siddharth Varma',
        title: 'Staff Software Engineer',
        company: 'Microsoft',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        domain: 'Full Stack Development',
        experienceYears: 8,
        skills: ['React', 'Node.js', 'System Design', 'TypeScript', 'Cloud Architecture'],
        bio: 'Senior engineer mentoring college students on cracking tech interviews, full-stack architecture, and resume review.',
        linkedin: 'https://linkedin.com',
        rating: 4.95,
        sessionsCompleted: 62,
        availableSlots: ['Wed 7:00 PM IST', 'Sat 11:00 AM IST', 'Sun 4:00 PM IST']
      },
      {
        name: 'Meera Krishnan',
        title: 'DevOps & Cloud Lead',
        company: 'Google Cloud',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        domain: 'Cloud Computing',
        experienceYears: 6,
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        bio: 'Passionate about containerization, infrastructure as code, and helping graduates transition into cloud DevOps roles.',
        linkedin: 'https://linkedin.com',
        rating: 4.9,
        sessionsCompleted: 48,
        availableSlots: ['Tue 6:30 PM IST', 'Thu 8:00 PM IST', 'Sat 2:00 PM IST']
      },
      {
        name: 'Aditya Sen',
        title: 'Principal AI Scientist',
        company: 'Amazon Web Services',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        domain: 'AI & Machine Learning',
        experienceYears: 10,
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'System Design'],
        bio: 'Guiding aspiring data scientists and machine learning engineers on practical algorithms and career growth.',
        linkedin: 'https://linkedin.com',
        rating: 5.0,
        sessionsCompleted: 85,
        availableSlots: ['Mon 7:00 PM IST', 'Fri 7:00 PM IST', 'Sun 10:00 AM IST']
      }
    ]);

    // 6. Create initial sample application for Aarav Sharma
    await Application.create([
      {
        job: jobs[0]._id, // Razorpay
        student: studentUser._id,
        status: 'Interview Scheduled',
        coverNote: 'Excited about the Full Stack role at Razorpay. I have strong experience building React and MongoDB apps, and I am actively closing backend skill gaps.',
        candidateSnapshot: {
          name: studentUser.name,
          email: studentUser.email,
          college: studentUser.college,
          degree: studentUser.degree,
          graduationYear: studentUser.graduationYear,
          cgpa: studentUser.cgpa,
          skills: studentUser.currentSkills
        },
        interviewDetails: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          googleMeetUrl: 'https://meet.google.com/sb-eval-live',
          notes: 'Round 1: Technical live coding and system design with Senior Engineering Team.'
        },
        timeline: [
          { status: 'Applied', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Application submitted via SkillBridge' },
          { status: 'Under Review', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Resume screened and approved by talent team' },
          { status: 'Shortlisted', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'High skill compatibility score (83% match)' },
          { status: 'Interview Scheduled', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Live Google Meet technical round scheduled' }
        ]
      }
    ]);

    console.log('[Seed] Database seeded successfully with 12 Career Domains:');
    console.log(`- ${jobs.length} Real-world Jobs across all domains`);
    console.log(`- 13 Upskilling Courses across all domains`);
    console.log(`- 12 Comprehensive Skill Assessments with validated questions`);
    console.log(`- 4 Demo Users across Departments and Domains`);
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    throw err;
  }
};

// Direct script execution support
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedAll();
      console.log('Seeding completed. Exiting...');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

module.exports = seedAll;
