/**
 * SkillBridge Central Career Domains & Departments (Frontend Constants)
 * 12 Career Domains with full metadata, starter skills, and role mappings.
 */

export const DOMAINS = [
  {
    id: 'full-stack',
    name: 'Full Stack Development',
    category: 'Software Engineering',
    tag: 'Web & Microservices',
    color: 'sky',
    description: 'Build end-to-end web architectures, reactive client frontends, RESTful microservices, and databases.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Master of Computer Applications (MCA)'
    ],
    primaryRole: 'Full Stack Developer',
    popularRoles: ['Full Stack Developer', 'Frontend Engineer', 'Backend Engineer', 'MERN Stack Developer'],
    requiredSkills: [
      'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB',
      'Docker', 'Git', 'REST APIs', 'TypeScript', 'SQL'
    ],
    starterSkills: ['JavaScript', 'React', 'MongoDB', 'Node.js']
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    category: 'Artificial Intelligence',
    tag: 'Deep Learning & NLP',
    color: 'purple',
    description: 'Design deep learning architectures, train statistical models, NLP agents, and computer vision systems.',
    suggestedDepartments: [
      'Artificial Intelligence and Data Science (AI & DS)',
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)'
    ],
    primaryRole: 'AI & Machine Learning Engineer',
    popularRoles: ['Machine Learning Engineer', 'AI Research Associate', 'NLP Engineer', 'Computer Vision Developer'],
    requiredSkills: [
      'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow',
      'Scikit-Learn', 'NLP', 'Computer Vision', 'Pandas', 'NumPy'
    ],
    starterSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy']
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Analytics & Big Data',
    tag: 'BI & Predictive Analytics',
    color: 'emerald',
    description: 'Transform raw datasets into predictive insights, business intelligence, and high-impact visual stories.',
    suggestedDepartments: [
      'Artificial Intelligence and Data Science (AI & DS)',
      'Computer Science and Engineering (CSE)',
      'Commerce & Business Analytics'
    ],
    primaryRole: 'Data Scientist',
    popularRoles: ['Data Scientist', 'Data Analyst', 'BI Developer', 'Quantitative Analyst'],
    requiredSkills: [
      'Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy',
      'Data Visualization', 'Tableau', 'Power BI', 'Statistics', 'Scikit-Learn'
    ],
    starterSkills: ['Python', 'SQL', 'Data Analysis', 'Pandas']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Security & Infrastructure',
    tag: 'Ethical Hacking & SOC',
    color: 'rose',
    description: 'Defend organizational networks, conduct vulnerability assessments, ethical hacking, and incident forensics.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Cybersecurity & Forensics'
    ],
    primaryRole: 'Cybersecurity Analyst',
    popularRoles: ['Security Analyst', 'Penetration Tester', 'SOC Analyst', 'Network Security Engineer'],
    requiredSkills: [
      'Network Security', 'Ethical Hacking', 'Linux', 'Cryptography', 'SIEM',
      'Penetration Testing', 'Wireshark', 'Firewalls', 'Incident Response', 'Vulnerability Assessment'
    ],
    starterSkills: ['Network Security', 'Linux', 'Ethical Hacking', 'Wireshark']
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    category: 'DevOps & Infrastructure',
    tag: 'AWS, Azure & Kubernetes',
    color: 'blue',
    description: 'Deploy resilient multi-cloud architectures, orchestrate containers, and automate CI/CD pipelines.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Electronics and Communication Engineering (ECE)'
    ],
    primaryRole: 'Cloud & DevOps Engineer',
    popularRoles: ['Cloud Solutions Architect', 'DevOps Engineer', 'Site Reliability Engineer (SRE)', 'AWS Specialist'],
    requiredSkills: [
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux',
      'CI/CD', 'Terraform', 'Cloud Architecture', 'Networking', 'Python'
    ],
    starterSkills: ['AWS', 'Docker', 'Linux', 'Kubernetes']
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    category: 'Application Development',
    tag: 'React Native & Flutter',
    color: 'amber',
    description: 'Create responsive, native-performance iOS and Android mobile experiences with offline caching.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Master of Computer Applications (MCA)'
    ],
    primaryRole: 'Mobile App Developer',
    popularRoles: ['React Native Developer', 'Flutter Developer', 'iOS Engineer', 'Android Engineer'],
    requiredSkills: [
      'React Native', 'Flutter', 'JavaScript', 'TypeScript', 'Dart',
      'Mobile UI/UX', 'REST APIs', 'Firebase', 'State Management', 'Git'
    ],
    starterSkills: ['React Native', 'JavaScript', 'Mobile UI/UX', 'Firebase']
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    category: 'Product Design',
    tag: 'Figma & Design Systems',
    color: 'pink',
    description: 'Craft intuitive user interfaces, design systems, interactive prototypes, and behavioral user research.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Design & Fine Arts',
      'Information Technology (IT)',
      'Human-Computer Interaction'
    ],
    primaryRole: 'UI/UX Designer',
    popularRoles: ['Product Designer', 'UI/UX Designer', 'Interaction Designer', 'Design System Lead'],
    requiredSkills: [
      'Figma', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping',
      'Design Systems', 'User Testing', 'Adobe XD', 'Visual Hierarchy', 'Information Architecture'
    ],
    starterSkills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping']
  },
  {
    id: 'iot',
    name: 'IoT',
    category: 'Hardware & Edge Computing',
    tag: 'Sensors, MQTT & Arduino',
    color: 'teal',
    description: 'Bridge physical hardware with cloud intelligence via sensor nodes, embedded telemetry, and MQTT networks.',
    suggestedDepartments: [
      'Electronics and Communication Engineering (ECE)',
      'Electrical and Electronics Engineering (EEE)',
      'Computer Science and Engineering (CSE)'
    ],
    primaryRole: 'IoT Engineer',
    popularRoles: ['IoT Systems Engineer', 'Embedded IoT Developer', 'Firmware Architect', 'Smart Systems Lead'],
    requiredSkills: [
      'Arduino', 'Raspberry Pi', 'C/C++', 'MQTT', 'Embedded C',
      'Sensors & Actuators', 'Python', 'IoT Protocols', 'Wireless Networking', 'Circuit Design'
    ],
    starterSkills: ['Arduino', 'Raspberry Pi', 'C/C++', 'Sensors & Actuators']
  },
  {
    id: 'software-testing',
    name: 'Software Testing',
    category: 'Quality Assurance',
    tag: 'Selenium, QA & Postman',
    color: 'indigo',
    description: 'Ensure mission-critical reliability through automated testing frameworks, performance testing, and QA suites.',
    suggestedDepartments: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Master of Computer Applications (MCA)'
    ],
    primaryRole: 'QA Automation Engineer',
    popularRoles: ['QA Automation Tester', 'SDET (Software Dev Engineer in Test)', 'Manual QA Tester', 'Performance Test Engineer'],
    requiredSkills: [
      'Manual Testing', 'Selenium', 'Automation Testing', 'JUnit/TestNG', 'Postman',
      'API Testing', 'Cypress', 'Jira', 'Bug Tracking', 'Test Case Design'
    ],
    starterSkills: ['Manual Testing', 'Selenium', 'Postman', 'Automation Testing']
  },
  {
    id: 'business-management',
    name: 'Business & Management',
    category: 'Business & Strategy',
    tag: 'Product Strategy & Scrum',
    color: 'orange',
    description: 'Drive high-impact technical initiatives, sprint workflows, product discovery, and financial business modeling.',
    suggestedDepartments: [
      'Management Studies (MBA / BBA)',
      'Commerce & Business Analytics',
      'Computer Science and Engineering (CSE)'
    ],
    primaryRole: 'Associate Product Manager',
    popularRoles: ['Associate Product Manager', 'Business Analyst', 'Scrum Master', 'Operations Lead'],
    requiredSkills: [
      'Project Management', 'Agile/Scrum', 'Business Analysis', 'Product Strategy', 'Financial Modeling',
      'Stakeholder Management', 'Risk Management', 'Market Research', 'Jira', 'Excel'
    ],
    starterSkills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'Jira']
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'Growth & Marketing',
    tag: 'SEO, SEM & Growth Ads',
    color: 'red',
    description: 'Accelerate user acquisition via technical search optimization, paid ad campaigns, performance analytics, and branding.',
    suggestedDepartments: [
      'Management Studies (MBA / BBA)',
      'Commerce & Business Analytics',
      'Information Technology (IT)'
    ],
    primaryRole: 'Digital Marketing Strategist',
    popularRoles: ['Growth Marketer', 'SEO Specialist', 'Performance Marketer', 'Content Marketing Lead'],
    requiredSkills: [
      'SEO', 'Google Analytics', 'Content Marketing', 'Social Media Marketing', 'PPC Advertising',
      'Email Marketing', 'Copywriting', 'Conversion Optimization', 'Meta Ads', 'Keyword Research'
    ],
    starterSkills: ['SEO', 'Google Analytics', 'Content Marketing', 'Meta Ads']
  },
  {
    id: 'embedded-systems',
    name: 'Electronics & Embedded Systems',
    category: 'Hardware Engineering',
    tag: 'Microcontrollers & PCB',
    color: 'cyan',
    description: 'Architect low-level hardware controllers, custom PCB schematics, RTOS firmware, and digital signal processors.',
    suggestedDepartments: [
      'Electronics and Communication Engineering (ECE)',
      'Electrical and Electronics Engineering (EEE)',
      'Mechanical Engineering (ME)'
    ],
    primaryRole: 'Embedded Systems Engineer',
    popularRoles: ['Embedded Firmware Engineer', 'Hardware Design Engineer', 'VLSI Design Engineer', 'Robotics Specialist'],
    requiredSkills: [
      'Embedded C', 'Microcontrollers', 'PCB Design', 'VLSI', 'Digital Electronics',
      'MATLAB', 'Circuit Simulation', 'RTOS', 'VHDL/Verilog', 'Soldering & Prototyping'
    ],
    starterSkills: ['Embedded C', 'Microcontrollers', 'Digital Electronics', 'PCB Design']
  }
];

export const DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Master of Computer Applications (MCA)',
  'Management Studies (MBA / BBA)',
  'Commerce & Business Analytics',
  'Science & Humanities'
];

export const getDomainByName = (domainName) => {
  if (!domainName) return DOMAINS[0];
  const found = DOMAINS.find(d => 
    d.name.toLowerCase() === domainName.toLowerCase() ||
    d.id.toLowerCase() === domainName.toLowerCase() ||
    d.primaryRole.toLowerCase() === domainName.toLowerCase() ||
    d.popularRoles.some(r => r.toLowerCase() === domainName.toLowerCase())
  );
  return found || DOMAINS[0];
};
