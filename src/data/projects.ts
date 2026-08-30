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
  visual: "gateway" | "cms" | "analytics" | "codereview" | "catalog";
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
    id: "oil-gas-platform",
    index: "02",
    name: "Oil & Gas Corporate Platform",
    subtitle: "Express + PostgreSQL Multi-Company Site with Custom CMS",
    dates: "Apr 2026 – Present",
    categories: ["Full Stack", "Enterprise"],
    stack: [
      "Node.js",
      "Express.js",
      "EJS",
      "PostgreSQL",
      "Docker",
      "Fly.io",
      "GitHub Actions",
    ],
    description:
      "Server-rendered corporate platform for an oil & gas group of six companies, backed by a relational content model and a schema-driven admin CMS that generates CRUD screens for every content type.",
    keyAchievement: "10 Admin-Managed Content Types",
    visual: "cms",
    detail: {
      overview:
        "A multi-page corporate platform for an oil and gas group of six companies — six company sites, three business streams and a full product catalogue served from one Express application, with an admin CMS so content ships without a deployment.",
      problem:
        "The group's web presence was a single 2,000-line static HTML page. Six companies, three streams and dozens of products were flattened into one document, product lists were duplicated across sections and drifted apart, and every copy change required a developer and a redeploy.",
      solution:
        "Rebuilt as an Express 5 + EJS application on PostgreSQL around a relational content model: a product is entered once, tagged to its company and to the streams it serves, and surfaces automatically on the company page and on every stream page — the two lists can never drift. A schema-driven admin panel generates the list screen, form, validation and delete for all 10 content types from a single resource definition, so a new content type needs no controller and no templates. Numbered SQL migrations, PostgreSQL-backed session auth, image uploads, a read-only JSON API and a health endpoint, containerized and deployed to Fly.io through GitHub Actions.",
      architecture: [
        "Visitor / Admin",
        "Express 5 Router",
        "Session Auth — connect-pg-simple",
        "Content Service Layer",
        "PostgreSQL 18",
        "EJS Server-Side Rendering",
        "Docker → Fly.io CI/CD",
      ],
      results: [
        "6 companies, 3 business streams and 5 shared categories driving 21 public routes",
        "44 products entered once — each surfaces on its company page and every stream tagged to it",
        "Schema-driven admin panel: 10 content types with CRUD, validation and image uploads from one definition file",
        "Numbered SQL migrations applied transactionally, so schema changes ship without touching live content",
        "Containerized with a liveness endpoint and auto-deployed to Fly.io on every push",
      ],
      role: "Architect & Full Stack Developer",
      timeline: "Apr 2026 – Present",
    },
  },
  {
    id: "sales-analytics",
    index: "03",
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
    index: "04",
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
    index: "05",
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
