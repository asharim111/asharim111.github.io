export const profile = {
  name: "Sharim Ansari",
  logoShort: "SA",
  logoLong: "SHARIM // ANSARI",
  title: "Senior Full Stack Developer",
  specialties:
    "MERN Stack · PHP · Python · AI Integration · Enterprise Automation · API Integrations",
  positioning:
    "Building scalable enterprise applications, intelligent AI systems, workflow automation platforms, and secure digital solutions.",
  headline: "Engineering the Future of Enterprise Software.",
  subheadline:
    "Full Stack Developer specializing in AI integration, enterprise automation, secure APIs, and scalable digital platforms.",
  yearsExperience: "7+",
  location: "Kuwait",
  email: "asharim111@gmail.com",
  phone: "+965 989-70432",
  linkedin: "https://linkedin.com/in/sharim-ansari",
  github: "https://github.com/asharim111",
  resumeFile: `${import.meta.env.BASE_URL}Sharim-Ansari-Resume.pdf`,
  status: "Available for Opportunities",
  intro:
    "Full Stack Developer with 7 years of experience building scalable web applications, enterprise workflow automation systems, procurement platforms, logistics solutions, and AI-powered applications.",
  aboutExpertise: [
    "MERN Stack",
    "PHP",
    "React.js",
    "Node.js",
    "Python",
    "REST APIs",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "AWS",
    "Docker",
    "AI Integrations",
    "Enterprise Automation",
  ],
  languages: [
    { name: "English", level: "Intermediate" },
    { name: "Hindi", level: "Advanced" },
    { name: "Arabic", level: "Basic" },
  ],
};

/**
 * The 15-second version, for the visitor who is deciding whether to spend more
 * than 15 seconds. Every number here is one that also appears — with its
 * context — somewhere in the full portfolio; this is a summary, not a second
 * set of claims.
 */
export const briefing = {
  fit: "Senior full stack engineer for teams building enterprise software with AI in it — where the AI has to pass security review, the workflows have to survive audit, and someone has to own it end to end.",
  achievements: [
    {
      metric: "3,500+",
      label: "global carriers",
      detail:
        "Built a shipment tracking platform delivering live updates across 3,500+ carriers, plus carrier and marketplace API integrations that improved synchronization efficiency by 25%.",
    },
    {
      metric: "19",
      label: "DLP detection categories",
      detail:
        "Architected an enterprise AI gateway routing all employee ChatGPT/Claude usage through two-layer data loss prevention — Microsoft Presidio and an LLM classifier — behind Entra ID SSO and full audit logging.",
    },
    {
      metric: "4",
      label: "procurement stages automated",
      detail:
        "Automated material requests, purchase orders, invoice handling and ticket closure, centralizing 3+ internal workflows across IT, business and procurement in a MERN ticket management system.",
    },
  ],
  strengths: [
    "MERN · FastAPI · PHP",
    "PostgreSQL · MongoDB · SQL Server",
    "AI integration & governance",
    "Enterprise automation",
    "AWS · Docker · CI/CD",
    "Information Security (M.Tech)",
  ],
};

export const heroMetrics = [
  { value: 7, suffix: "+", label: "Years Experience" },
  { value: 3500, suffix: "+", label: "Global Carriers Supported" },
  { value: 19, suffix: "", label: "AI/DLP Detection Categories" },
  { value: 12, suffix: "+", label: "Interactive Analytics Charts" },
  {
    value: 25,
    suffix: "%",
    label: "Peak Performance Improvement",
    prefix: "up to ",
  },
];

export const systemMetrics = [
  { value: 7, suffix: "+", label: "Years Experience" },
  { value: 3500, suffix: "+", label: "Global Carriers" },
  { value: 19, suffix: "", label: "DLP Detection Categories" },
  { value: 12, suffix: "+", label: "Analytics Charts" },
  { value: 25, suffix: "%", label: "Synchronization Efficiency Improvement" },
  { value: 20, suffix: "%", label: "API / Page Performance Improvements" },
];

export const philosophy = [
  {
    id: "01",
    title: "ARCHITECT",
    icon: "DraftingCompass",
    text: "Design scalable architectures before writing unnecessary complexity.",
  },
  {
    id: "02",
    title: "AUTOMATE",
    icon: "Workflow",
    text: "Replace repetitive workflows with reliable automation.",
  },
  {
    id: "03",
    title: "SECURE",
    icon: "ShieldCheck",
    text: "Build security into authentication, authorization, APIs, and data flows.",
  },
  {
    id: "04",
    title: "OPTIMIZE",
    icon: "Gauge",
    text: "Continuously improve performance, reliability, and developer experience.",
  },
];

export const careerTimeline = [
  {
    year: "2019",
    phase: "BOOTSTRAP",
    role: "PHP Developer Intern",
    org: "Evolution Co",
  },
  {
    year: "2019–2022",
    phase: "SYSTEM DEVELOPMENT",
    role: "Full Stack Developer",
    org: "myMRPlace",
  },
  {
    year: "2022–2025",
    phase: "SCALE",
    role: "Web Developer",
    org: "Phoenix Biz Solutions",
  },
  {
    year: "2025–Present",
    phase: "ENTERPRISE AI",
    role: "Full Stack Developer",
    org: "Al Rashed Holdings",
  },
];
