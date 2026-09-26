export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  stack: string[];
  highlights: string[];
  visual?: "gateway" | "logistics";
}

export const experience: Experience[] = [
  {
    company: "Al Rashed Holdings",
    role: "Senior Full Stack Developer",
    period: "Sep 2025 – Present",
    location: "Ardiya, Kuwait",
    stack: [
      "FastAPI",
      "React.js",
      "TypeScript",
      "Express.js",
      "EJS",
      "PostgreSQL",
      "SQL Server",
      "Redis",
      "Docker",
      "Fly.io",
      "GitHub Actions",
      "Entra ID",
      "DLP",
      "Zoho Creator",
      "Zoho Catalyst",
    ],
    highlights: [
      "Architect and build an internal AI gateway (FastAPI, React.js, PostgreSQL, Redis, Docker) giving 100+ employees across 7 departments governed access to OpenAI, Anthropic and Groq models, replacing unmonitored public AI usage with an auditable, policy-controlled channel.",
      "Engineer a two-layer DLP pipeline (Microsoft Presidio + LLM classifier) screening 700+ prompts and file uploads per day across 19 detection categories, with Entra ID SSO, department-level policy enforcement, RBAC, and real-time admin alerting on flagged content.",
      "Deliver a MERN ticket management platform across IT, business, and procurement teams, consolidating 3 previously separate request workflows and handling 250+ tickets per month for 100+ users.",
      "Automate 4 procurement stages — material requests, purchase orders, invoice handling, and ticket closure — cutting approval cycle time from 4 days to 5 hours and removing 4 manual handoffs per request.",
      "Build a sales analytics dashboard (React.js, TypeScript, Node.js, Express.js, Microsoft SQL Server) over the ERP database, delivering real-time KPIs, salesman performance tracking, and margin analysis through 12+ interactive charts.",
      "Automate build and deployment of Dockerized services to on-prem Linux servers using GitHub Actions, with pytest, Jest, and Postman collections covering unit, integration, and API regression testing.",
      "Rebuild the corporate website as a server-rendered Express/EJS/PostgreSQL platform serving the group site and 6 company sites from one codebase, with a config-driven admin CMS generating CRUD for 13 content tables and 36 sustainability pages composed from 17 typed section blocks.",
      "Evolve the 20-table schema through 20 transactional SQL migrations, and build a fingerprint-guarded local ⇄ Fly.io Postgres sync, run from a pre-push hook, that backs up first, refuses to overwrite edits made on the other side, and reloads content in a single transaction.",
      "Containerize the platform with a multi-stage Docker build and automated Fly.io deployments through GitHub Actions, securing it with bcrypt session auth, a Postgres-backed session store, parameterized SQL throughout, and a CIDR-aware IP allowlist.",
      "Build and deploy enterprise automation solutions using Zoho Creator, Zoho Catalyst, REST APIs, and serverless functions to digitize internal workflows and improve cross-department visibility.",
    ],
    visual: "gateway",
  },
  {
    company: "Phoenix Biz Solutions",
    role: "Web Developer (Full Stack Developer)",
    period: "Aug 2022 – Aug 2025",
    location: "Thane, India",
    stack: [
      "CakePHP",
      "MongoDB",
      "MySQL",
      "Node.js",
      "Carrier APIs",
      "Marketplace APIs",
    ],
    highlights: [
      "Built and maintained an ERP-style logistics and e-commerce platform (CakePHP, MongoDB, MySQL) handling marketplace product synchronization, order processing, and multi-carrier shipping for 10+ merchants and 100+ orders per day.",
      "Delivered 20+ third-party integrations spanning carrier (APG, CTTExpress, PosteItaliane) and marketplace (Rakuten, Joom, eBay) APIs, implementing retry, rate-limit, and idempotency handling that cut sync run time by 25%.",
      "Built dmstrack.com, a shipment tracking platform surfacing live status across 3,500+ carriers through aggregator integration, tracking 500+ shipments per month and reducing manual status inquiries.",
      "Cut API response times ~50% (from 160ms to 80ms) across multiple Node.js services by caching, query optimization and async processing.",
    ],
    visual: "logistics",
  },
  {
    company: "myMRPlace",
    role: "Full Stack Developer",
    period: "Sep 2019 – Jul 2022",
    location: "Thane, India",
    stack: ["CodeIgniter", "MySQL", "Scrum", "Backend Optimization", "Bitbucket CI/CD", "JIRA"],
    highlights: [
      "Built and maintained mymrplace.com (CodeIgniter, MySQL), a B2B platform connecting buyers and suppliers in the market research industry, supporting 100+ registered suppliers and international research operations.",
      "Reduced page load time 20% by refactoring MySQL queries — indexing, eliminating N+1 queries, and query restructuring — across the platform's core supplier-matching flows.",
      "Served as Scrum Master for a 7-person cross-functional team across 80+ sprints, running ceremonies, backlog prioritization, and release coordination alongside a full development workload.",
      "Built and maintained Bitbucket CI/CD pipelines to automate deployments from repository to testing and production servers, with JIRA-linked branches and tickets tracking each release.",
    ],
  },
];
