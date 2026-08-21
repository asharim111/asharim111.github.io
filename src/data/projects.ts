export type ProjectCategory =
  | "AI / ML"
  | "Full Stack"
  | "Enterprise"
  | "Automation"
  | "Analytics"
  | "Security";

export interface Project {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  dates: string;
  categories: ProjectCategory[];
  stack: string[];
  description: string;
  keyAchievement: string;
  visual: "gateway" | "analytics" | "codereview" | "catalog";
  hero?: boolean;
  detail: {
    overview: string;
    problem: string;
    solution: string;
    architecture: string[];
    results: string[];
    role: string;
    timeline: string;
  };
}

export const projects: Project[] = [
  {
    id: "ai-gateway",
    index: "01",
    name: "AI Gateway",
    subtitle: "Enterprise DLP Proxy for ChatGPT & Claude",
    dates: "Jun 2026 – Present",
    categories: ["AI / ML", "Security", "Enterprise", "Full Stack"],
    stack: [
      "FastAPI",
      "React.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Microsoft Presidio",
      "OpenAI",
      "Anthropic",
      "Groq",
      "Microsoft Entra ID",
    ],
    description:
      "Scans employee prompts and file attachments through a two-layer DLP engine before routing requests to AI providers.",
    keyAchievement: "19 Detection Categories",
    visual: "gateway",
    hero: true,
    detail: {
      overview:
        "A secure enterprise AI gateway that routes all employee ChatGPT/Claude usage through a governed pipeline with data loss prevention, identity enforcement, and full auditability.",
      problem:
        "Employees using public AI tools can unintentionally leak sensitive corporate data, with no visibility or policy control for the organization.",
      solution:
        "Every prompt and file attachment passes through a two-layer DLP engine — Microsoft Presidio plus an LLM classifier — across 19 detection categories before requests are routed to OpenAI, Anthropic, or Groq. Entra ID SSO, department-level policy controls, audit logging, and real-time admin alerts on every flagged prompt.",
      architecture: [
        "Employee",
        "Entra ID Authentication",
        "AI Gateway",
        "Layer 1 — Microsoft Presidio",
        "Layer 2 — LLM Classifier",
        "Policy Engine",
        "OpenAI / Anthropic / Groq",
      ],
      results: [
        "19 DLP detection categories across prompts and file attachments",
        "Two-layer scanning: Microsoft Presidio + LLM classifier",
        "Entra ID SSO with department-level policy controls",
        "Audit logging with real-time admin alerting on flagged prompts",
      ],
      role: "Architect & Full Stack Developer",
      timeline: "Jun 2026 – Present",
    },
  },
  {
    id: "sales-analytics",
    index: "02",
    name: "Sales Analytics Dashboard",
    subtitle: "MERN + SQL Server Business Intelligence Platform",
    dates: "Oct 2025 – Feb 2026",
    categories: ["Analytics", "Full Stack", "Enterprise"],
    stack: ["React.js", "Node.js", "Express.js", "Microsoft SQL Server"],
    description:
      "Full-stack sales analytics dashboard integrating with an ERP database to deliver real-time KPIs, salesman performance tracking, and profit margin analysis.",
    keyAchievement: "12+ Interactive Charts",
    visual: "analytics",
    detail: {
      overview:
        "A business intelligence platform surfacing live sales data from an ERP database through interactive dashboards.",
      problem:
        "Sales performance data locked inside the ERP was hard to explore, compare, and act on in real time.",
      solution:
        "A React.js front end backed by Node.js/Express.js services querying Microsoft SQL Server, delivering real-time KPIs, salesman performance tracking, and profit margin analysis through 12+ interactive charts.",
      architecture: [
        "React Dashboard",
        "Node.js / Express API",
        "Microsoft SQL Server",
        "ERP Database Integration",
      ],
      results: [
        "12+ interactive analytics charts",
        "Real-time KPIs and profit margin analysis",
        "Salesman performance tracking from live ERP data",
      ],
      role: "Full Stack Developer",
      timeline: "Oct 2025 – Feb 2026",
    },
  },
  {
    id: "ai-code-reviewer",
    index: "03",
    name: "AI Code Reviewer",
    subtitle: "MERN Application + Google Gemini",
    dates: "Dec 2024 – Feb 2025",
    categories: ["AI / ML", "Full Stack", "Automation"],
    stack: ["React", "Node.js", "Express", "MongoDB", "Google Gemini 2.0 Flash"],
    description:
      "MERN stack application integrated with Google Gemini 2.0 Flash to review source code and generate improvement suggestions.",
    keyAchievement: "Automated code quality analysis",
    visual: "codereview",
    detail: {
      overview:
        "An AI developer tool that reviews source code and generates improvement suggestions automatically.",
      problem:
        "Manual code review feedback is slow and inconsistent, especially for routine quality issues.",
      solution:
        "A MERN stack application integrated with Google Gemini 2.0 Flash that analyzes submitted source code and returns structured improvement suggestions, automating code quality analysis and development feedback.",
      architecture: ["React Editor UI", "Node.js / Express API", "MongoDB", "Google Gemini 2.0 Flash"],
      results: [
        "Automated code quality analysis and development feedback",
        "Structured AI improvement suggestions for submitted code",
      ],
      role: "Full Stack Developer",
      timeline: "Dec 2024 – Feb 2025",
    },
  },
  {
    id: "pamatec",
    index: "04",
    name: "Pamatec",
    subtitle: "React Product Showcase Platform",
    dates: "Jan 2026 – Jun 2026",
    categories: ["Full Stack"],
    stack: ["React", "React Router DOM", "Responsive UI"],
    description:
      "React-based single-page application displaying building material products and solutions with a structured, responsive user interface.",
    keyAchievement: "Structured, responsive product catalog",
    visual: "catalog",
    detail: {
      overview:
        "A React single-page application showcasing building material products and solutions.",
      problem:
        "Product and solution information needed a structured, navigable presentation for customers.",
      solution:
        "A React SPA using React Router DOM with a structured, responsive user interface for browsing building material products and solutions.",
      architecture: ["React SPA", "React Router DOM", "Responsive UI Components"],
      results: ["Structured, responsive product showcase experience"],
      role: "Full Stack Developer",
      timeline: "Jan 2026 – Jun 2026",
    },
  },
];

export const projectFilters: Array<"All" | ProjectCategory> = [
  "All",
  "AI / ML",
  "Full Stack",
  "Enterprise",
  "Automation",
  "Analytics",
  "Security",
];
