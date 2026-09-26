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
    subtitle: "Enterprise DLP Proxy for OpenAI, Anthropic & Groq",
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
      "Scans 700+ employee prompts and file attachments a day through a two-layer DLP engine before routing requests to OpenAI, Anthropic or Groq — governed AI access for 100+ employees across 7 departments.",
    keyAchievement: "19 Detection Categories",
    visual: "gateway",
    hero: true,
    detail: {
      overview:
        "A secure enterprise AI gateway giving 100+ employees across 7 departments governed access to OpenAI, Anthropic and Groq models — replacing unmonitored public AI usage with a pipeline of data loss prevention, identity enforcement, and full auditability.",
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
        "700+ prompts and file uploads a day pass through a two-layer DLP engine — Microsoft Presidio plus an LLM classifier — across 19 detection categories before requests are routed to OpenAI, Anthropic, or Groq. Entra ID SSO, department-level policy enforcement, RBAC, audit logging, and real-time admin alerts on flagged content.",
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
        "100+ employees across 7 departments on one auditable, policy-controlled AI channel",
        "700+ prompts and file uploads screened per day across 19 DLP detection categories",
        "Two-layer scanning: Microsoft Presidio + LLM classifier",
        "Entra ID SSO with department-level policy enforcement and RBAC",
        "Audit logging with real-time admin alerting on flagged content",
      ],
      role: "Architect & Full Stack Developer",
      timeline: "Jun 2026 – Present",
    },
  },
  {
    id: "oil-gas-platform",
    index: "02",
    name: "Oil & Gas Corporate Platform",
    subtitle: "Express + PostgreSQL Multi-Site Platform with Custom CMS",
    dates: "Apr 2026 – Present",
    aliases: [
      "oil",
      "gas",
      "cms",
      "corporate",
      "express",
      "ejs",
      "fly.io",
      "multi-site",
      "company sites",
      "sustainability",
      "db sync",
    ],
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
      "Server-rendered platform for an oil & gas group: one Express application serving the group site and six company sites, each with its own menu, carousel, catalogue and sustainability pages, all managed from one schema-driven admin CMS.",
    keyAchievement: "7 Sites from One Codebase",
    visual: "cms",
    detail: {
      overview:
        "A multi-site corporate platform for an oil and gas group. The group site and six company sites, the business streams and a shared product catalogue all run from one Express application, and an admin CMS publishes content without a deployment.",
      problem:
        "The group's web presence was a single 2,000-line static HTML page. Six companies, three streams and dozens of products were flattened into one document, product lists were duplicated across sections and drifted apart, and every copy change required a developer and a redeploy. Each company also needed a web presence of its own, and nobody wanted to maintain six more codebases.",
      constraints: [
        "A product appears on its company site and on every stream it serves. The two lists must never be able to disagree.",
        "Six company sites, each with its own menu, carousel, contact details and sustainability section, maintained as one codebase.",
        "Content changes ship without a developer and without a deployment, including new pages.",
        "Corporate marketing site: crawlable, fast on first paint, no client-side hydration budget for largely static pages.",
        "Content is edited both locally and in the live admin. Neither side may silently overwrite the other.",
        "Schema changes have to land on a database holding live content, reviewably and reversibly.",
      ],
      solution:
        "Rebuilt as an Express 5 + EJS application on PostgreSQL around a relational content model. A product is entered once and belongs to its company, and its category is linked to the streams it serves, so it surfaces on the company site and on every matching stream page and the two lists cannot drift. Each company is a route layer mounted at /<slug> that swaps in its own menu, header and footer details over the group's layouts; its products, carousel, certificates, resources and six sustainability pages come from the same tables. A schema-driven admin panel generates the list, form, validation and delete for 11 screens, plus inline repeaters that save a record and its child rows in one transaction, covering 13 content tables from a single definition file. Page layouts are composed from 17 typed section blocks stored as JSONB, so a new page needs no template and no migration. The platform also has 20 transactional SQL migrations, bcrypt session auth on a PostgreSQL-backed session store, parameterized SQL throughout, a CIDR-aware IP allowlist, image, PDF and video uploads, a read-only JSON API and a health endpoint. It ships as a multi-stage Docker image deployed to Fly.io through GitHub Actions, and a fingerprint-guarded push/pull sync keeps local and production content in step.",
      architecture: [
        "Visitor / Admin",
        "IP Allowlist — CIDR, Fly-Client-IP",
        "Express 5 Router — group + 6 company sites",
        "Session Auth — connect-pg-simple",
        "Content Service + Cached Menus",
        "PostgreSQL 18 — JSONB page blocks",
        "EJS Server-Side Rendering",
        "Docker → Fly.io CI/CD + Guarded DB Sync",
      ],
      decisions: [
        {
          choice: "Server-rendered Express 5 + EJS instead of a React SPA",
          why: "This is a content site whose job is to be found and to load instantly on a poor connection. Server rendering gives crawlable HTML on first byte and ships no framework to the client for pages that are almost entirely text and images.",
          tradeoff: "Rich client-side interaction now costs real work — there's no component runtime waiting on the page.",
        },
        {
          choice: "A relational content model in PostgreSQL, not a page-per-company",
          why: "A product is entered once and belongs to its company, and its category is linked to the streams it serves. The company site and every stream page read the same row, so duplication is impossible rather than just discouraged. Duplication is exactly how the old static page failed.",
          tradeoff: "Every new content shape is a migration, not a new file.",
        },
        {
          choice: "Company sites as a route layer over the group app, not separate deployments",
          why: "Mounted last at /<slug>, each company site swaps three values (its menu, its header and footer details, and the company record) and reuses every layout and partial. Six sites cost one codebase, one database and one deploy, and a fix to a shared partial reaches all seven at once.",
          tradeoff: "Company slugs share the group's URL space, so a reserved-slug list has to be kept current, and every site ships on the same release cycle.",
        },
        {
          choice: "One schema-driven admin panel over hand-written CRUD screens",
          why: "Thirteen content tables, each needing a list, a form, validation and delete, add up to more than fifty surfaces to keep consistent. A single resource definition generates all of them, and repeater fields edit child rows such as certificates, API cards and company resources inside the parent's form, saved in one transaction. A new content type needs no controller and no templates.",
          tradeoff: "Anything that doesn't fit the generated shape has to escape the abstraction deliberately.",
        },
        {
          choice: "Typed section blocks in JSONB for page layouts",
          why: "Thirty-six company sustainability pages and sixteen editable pages are built from 17 section types (split, cards, accordion, gallery, CTA and more), each mapped to CSS the site already had. A new page is a row, not a template, and it matches the rest of the site.",
          tradeoff: "Layouts are edited as JSON. That suits a developer but is unforgiving for an editor, so malformed input is rejected at save instead of reaching the public page.",
        },
        {
          choice: "A fingerprint-guarded push/pull sync, not a shared database",
          why: "Content is edited locally and in the live admin. Each sync records an md5 fingerprint per content table, and the next run refuses to overwrite the other side if it changed since then. It backs up first, reloads content in one transaction and verifies row counts afterwards. Production keeps its own admin accounts, enquiries and sessions.",
          tradeoff: "No merge: if both sides changed, one side's edits are redone by hand. The guard makes that visible; it doesn't solve it.",
        },
        {
          choice: "Numbered SQL migrations applied transactionally",
          why: "The database holds live published content. Migrations are reviewable in the diff, apply in order, and roll back as a unit if one fails. Retired features are parked rather than dropped, so a config change brings them back.",
          tradeoff: "More ceremony up front than letting an ORM synchronise the schema, and parked tables stay in the schema for the next developer to understand.",
        },
      ],
      results: [
        "One Express app serving the group site and 6 company sites, each with its own menu, carousel, catalogue, contact details and sustainability section",
        "46 products entered once, each surfacing on its company site and under every stream its category is linked to",
        "Schema-driven admin panel: 11 generated screens plus inline repeaters covering 13 content tables, with validation and image, PDF and video uploads",
        "36 company sustainability pages and 16 editable pages composed from 17 typed section blocks, with no template per page",
        "20-table schema evolved through 20 numbered SQL migrations applied transactionally, so schema changes ship without touching live content",
        "Guarded local ⇄ Fly.io content sync run from a pre-push hook: backs up first, blocks overwrites of the other side's edits, reloads 16 content tables in one transaction and verifies row counts",
        "Secured with bcrypt session auth (session rotation on login, timing-safe failures), a Postgres-backed session store, parameterized SQL and a CIDR-aware IP allowlist",
        "Multi-stage Docker build with a liveness endpoint, auto-deployed to Fly.io through GitHub Actions on every push",
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
    stack: ["React.js", "TypeScript", "Node.js", "Express.js", "Microsoft SQL Server"],
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
        "A React.js + TypeScript front end backed by Node.js/Express.js services querying Microsoft SQL Server, delivering real-time KPIs, salesman performance tracking, and profit margin analysis through 12+ interactive charts.",
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
