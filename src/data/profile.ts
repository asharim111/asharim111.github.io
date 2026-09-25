export const profile = {
  name: "Sharim Ansari",
  logoShort: "SA",
  logoLong: "SHARIM // ANSARI",
  title: "Senior Full Stack Engineer",
  specialties:
    "React.js · TypeScript · Node.js · Python / FastAPI · PHP · REST API Integration · Application Security",
  positioning:
    "Building scalable enterprise applications, intelligent AI systems, workflow automation platforms, and secure digital solutions.",
  headline: "Engineering the Future of Enterprise Software.",
  subheadline:
    "Full Stack Engineer specializing in AI integration, enterprise automation, secure APIs, and scalable digital platforms.",
  yearsExperience: "7+",
  location: "Kuwait",
  email: "asharim111@gmail.com",
  phone: "+965 9897 0432",
  linkedin: "https://linkedin.com/in/sharim-ansari",
  github: "https://github.com/asharim111",
  resumeFile: `${import.meta.env.BASE_URL}Sharim-Ansari-Senior-Full-Stack-Engineer.pdf`,
  status: "Available for Opportunities",
  intro:
    "Senior Full Stack Engineer with 7 years building enterprise web platforms in React, TypeScript, Node.js, Python/FastAPI and PHP across workflow automation, procurement, and logistics — currently designing and shipping an internal AI gateway that gives 100+ employees governed access to LLMs.",
  aboutExpertise: [
    "MERN Stack",
    "PHP",
    "React.js",
    "TypeScript",
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
    { name: "English", level: "Professional working proficiency" },
    { name: "Hindi", level: "Fluent" },
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
        "Built dmstrack.com, tracking 500+ shipments a month across 3,500+ carriers, plus 20+ carrier and marketplace API integrations whose retry, rate-limit and idempotency handling cut sync run time by 25%.",
    },
    {
      metric: "19",
      label: "DLP detection categories",
      detail:
        "Architected an internal AI gateway giving 100+ employees across 7 departments governed access to OpenAI, Anthropic and Groq, with 700+ prompts and uploads a day screened by two-layer DLP — Microsoft Presidio and an LLM classifier — behind Entra ID SSO.",
    },
    {
      metric: "4",
      label: "procurement stages automated",
      detail:
        "Automated material requests, purchase orders, invoice handling and ticket closure — cutting approval cycle time from 4 days to 5 hours — and consolidated 3 request workflows into a MERN ticket platform handling 250+ tickets a month.",
    },
  ],
  strengths: [
    "MERN · TypeScript · FastAPI · PHP",
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
    value: 50,
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
  { value: 25, suffix: "%", label: "Sync Run-Time Reduction" },
  { value: 50, suffix: "%", label: "API Response-Time Reduction" },
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
    year: "2019–2022",
    phase: "SYSTEM DEVELOPMENT",
    role: "Full Stack Developer",
    org: "myMRPlace",
  },
  {
    year: "2022–2025",
    phase: "SCALE",
    role: "Web Developer (Full Stack Developer)",
    org: "Phoenix Biz Solutions",
  },
  {
    year: "2025–Present",
    phase: "ENTERPRISE AI",
    role: "Senior Full Stack Developer",
    org: "Al Rashed Holdings",
  },
];
