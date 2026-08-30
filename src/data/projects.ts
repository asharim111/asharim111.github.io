export type ProjectCategory =
  | "AI / ML"
  | "Full Stack"
  | "Enterprise"
  | "Automation"
  | "Analytics"
  | "Security";

/** One entry in a project's decision log: what was chosen, why, and what it
 *  cost. The tradeoff is the part that matters — a decision with no cost was
 *  never a decision. */
export interface Decision {
  choice: string;
  why: string;
  tradeoff: string;
}

export interface Project {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  dates: string;
  /** Short search aliases used by the terminal and the ⌘K answer engine. */
  aliases?: string[];
  categories: ProjectCategory[];
  stack: string[];
  description: string;
  keyAchievement: string;
  visual: "gateway" | "cms" | "analytics" | "codereview" | "catalog";
  hero?: boolean;
  detail: {
    overview: string;
    problem: string;
    /** The non-negotiables the design had to satisfy. */
    constraints: string[];
    solution: string;
    architecture: string[];
    /** Why it's built this way and what each choice cost. */
    decisions: Decision[];
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
    aliases: ["gateway", "dlp", "presidio", "chatgpt", "claude", "ai proxy"],
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
      constraints: [
        "Employees keep the tools they already use — a gateway nobody adopts protects nothing.",
        "Every prompt and attachment must be auditable after the fact, including the blocked ones.",
        "Identity and department policy come from the organization's existing Entra ID tenant, not a second user list.",
        "Latency has to stay inside an interactive chat budget, with DLP running on every request.",
        "No single-provider lock-in: OpenAI, Anthropic and Groq all had to be routable.",
      ],
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
      decisions: [
        {
          choice: "Proxy the AI providers instead of blocking them",
          why: "Blocking public AI tools doesn't remove the risk, it moves it to personal devices where there is no logging at all. Routing through a gateway keeps the tool employees want and adds the control the organization needs.",
          tradeoff: "The gateway is now on the critical path — its availability is the availability of AI at the company.",
        },
        {
          choice: "Two DLP layers — Microsoft Presidio, then an LLM classifier",
          why: "Pattern and NER detection reliably catches structured identifiers, but not contextual disclosure phrased in plain language. The second layer classifies intent across 19 categories and catches what the first layer cannot express as a pattern.",
          tradeoff: "Added latency and a classifier call on every prompt, including the overwhelming majority that are perfectly safe.",
        },
        {
          choice: "Entra ID SSO rather than gateway-local accounts",
          why: "Department-level policy has to follow the organization's real group membership. A second user directory would have drifted from the first within a quarter.",
          tradeoff: "Hard coupling to the tenant, and local development needs a mocked identity path.",
        },
        {
          choice: "PostgreSQL for the audit trail, Redis for hot state",
          why: "Audit records are the compliance artifact — they need durability, relational queries and retention. Session and policy lookups run on every request and had no business touching that database.",
          tradeoff: "Two data stores to operate and reason about instead of one.",
        },
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
    aliases: ["oil", "gas", "cms", "corporate", "express", "ejs", "fly.io"],
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
      constraints: [
        "A product appears on its company page and on every stream it serves — the two lists must never be able to disagree.",
        "Content changes ship without a developer and without a deployment.",
        "Corporate marketing site: crawlable, fast on first paint, no client-side hydration budget for 21 largely static routes.",
        "Schema changes have to land on a database holding live content, reviewably and reversibly.",
      ],
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
      decisions: [
        {
          choice: "Server-rendered Express 5 + EJS instead of a React SPA",
          why: "This is a content site whose job is to be found and to load instantly on a poor connection. Server rendering gives crawlable HTML on first byte and ships no framework to the client for pages that are almost entirely text and images.",
          tradeoff: "Rich client-side interaction now costs real work — there's no component runtime waiting on the page.",
        },
        {
          choice: "A relational content model in PostgreSQL, not a page-per-company",
          why: "A product is entered once and tagged to its company and its streams; the company page and every stream page read the same row. Duplication isn't discouraged, it's impossible — which is the failure mode the old static page actually had.",
          tradeoff: "Every new content shape is a migration, not a new file.",
        },
        {
          choice: "One schema-driven admin panel over ten hand-written CRUD screens",
          why: "Ten content types with a list, a form, validation and delete each is forty surfaces to keep consistent. A single resource definition generates all of them, so a new content type needs no controller and no templates.",
          tradeoff: "Anything that doesn't fit the generated shape has to escape the abstraction deliberately.",
        },
        {
          choice: "Numbered SQL migrations applied transactionally",
          why: "The database holds live published content. Migrations are reviewable in the diff, apply in order, and roll back as a unit if one fails.",
          tradeoff: "More ceremony up front than letting an ORM synchronise the schema.",
        },
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
    aliases: ["dashboard", "bi", "kpi", "erp", "sql server", "charts"],
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
      constraints: [
        "Numbers must be current — a dashboard showing yesterday's sales doesn't change today's decisions.",
        "The ERP database is production: analytics reads cannot degrade it.",
        "Salesman performance and profit margin are sensitive; access follows role.",
      ],
      solution:
        "A React.js front end backed by Node.js/Express.js services querying Microsoft SQL Server, delivering real-time KPIs, salesman performance tracking, and profit margin analysis through 12+ interactive charts.",
      architecture: [
        "React Dashboard",
        "Node.js / Express API",
        "Microsoft SQL Server",
        "ERP Database Integration",
      ],
      decisions: [
        {
          choice: "Query the ERP directly rather than build a warehouse first",
          why: "The requirement was live KPIs. A nightly ETL would have been cleaner architecture and would have answered yesterday's question — the wrong tradeoff for a sales floor.",
          tradeoff: "Read load lands on a production ERP database, so query shape and indexing are a permanent design constraint rather than an optimisation.",
        },
        {
          choice: "Aggregate on the server, send summaries to the browser",
          why: "Twelve-plus charts over ERP-scale tables. Pushing rows to the client would have made the dashboard slower the more successful the business got.",
          tradeoff: "Every new chart shape is an API endpoint, not a client-side regroup.",
        },
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
    aliases: ["gemini", "review", "code review", "mern"],
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
      constraints: [
        "Feedback has to arrive while the author is still in the code — a slow reviewer gets ignored.",
        "Output must be structured enough to scan, compare and act on, not a wall of prose.",
      ],
      solution:
        "A MERN stack application integrated with Google Gemini 2.0 Flash that analyzes submitted source code and returns structured improvement suggestions, automating code quality analysis and development feedback.",
      architecture: ["React Editor UI", "Node.js / Express API", "MongoDB", "Google Gemini 2.0 Flash"],
      decisions: [
        {
          choice: "Gemini 2.0 Flash over a larger, slower model",
          why: "For routine quality feedback, turnaround is the feature. A review that lands in seconds gets read; one that takes a minute gets skipped.",
          tradeoff: "Less depth on subtle logic errors — this reviews for quality, it doesn't replace a human on design.",
        },
        {
          choice: "Structured suggestions rather than free-form prose",
          why: "Issue, severity and recommendation as discrete fields can be sorted, filtered and rendered consistently. Prose can only be read.",
          tradeoff: "The prompt and the output contract become things that need maintaining as the model changes.",
        },
      ],
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
    aliases: ["catalog", "building materials", "spa", "showcase"],
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
      constraints: [
        "A stable catalogue with no editorial workflow behind it — content changes are rare and deliberate.",
        "Customers browse on phones as often as desktops.",
      ],
      solution:
        "A React SPA using React Router DOM with a structured, responsive user interface for browsing building material products and solutions.",
      architecture: ["React SPA", "React Router DOM", "Responsive UI Components"],
      decisions: [
        {
          choice: "A client-routed SPA rather than a CMS-backed site",
          why: "The catalogue is fixed and nobody needed an editor. A CMS would have added a database, an admin surface and a hosting bill to solve a problem this project doesn't have.",
          tradeoff: "Content changes go through a deploy — the right call here, and the wrong one for the oil & gas platform, which is why that one has a CMS.",
        },
      ],
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
