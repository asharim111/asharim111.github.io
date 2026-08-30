export interface ArchitectureDef {
  id: string;
  name: string;
  nodes: Array<{ label: string; sub?: string; kind: "user" | "app" | "service" | "data" | "infra" | "security" | "ai" }>;
}

export const architectures: ArchitectureDef[] = [
  {
    id: "monolith",
    name: "Monolith",
    nodes: [
      { label: "User", kind: "user" },
      { label: "React Application", kind: "app" },
      { label: "PHP / Node.js Monolith", sub: "Routing · Auth · Business Logic", kind: "service" },
      { label: "MySQL / MongoDB", kind: "data" },
      { label: "Linux Server", kind: "infra" },
    ],
  },
  {
    id: "microservices",
    name: "Microservices",
    nodes: [
      { label: "User", kind: "user" },
      { label: "React Application", kind: "app" },
      { label: "API Gateway", kind: "service" },
      { label: "Node.js / FastAPI Services", sub: "Independent deployable services", kind: "service" },
      { label: "Authentication Layer", sub: "OAuth 2.0 · RBAC", kind: "security" },
      { label: "Redis Cache", kind: "data" },
      { label: "PostgreSQL / MongoDB", kind: "data" },
      { label: "AWS / Docker Infrastructure", kind: "infra" },
    ],
  },
  {
    id: "ai-pipeline",
    name: "AI Pipeline",
    nodes: [
      { label: "User Prompt", kind: "user" },
      { label: "React Interface", kind: "app" },
      { label: "FastAPI Orchestrator", kind: "service" },
      { label: "Prompt Assembly", sub: "Context · History", kind: "ai" },
      { label: "LLM Provider", sub: "OpenAI · Anthropic · Groq", kind: "ai" },
      { label: "Response Post-processing", kind: "service" },
      { label: "PostgreSQL + Redis", sub: "History · Cache", kind: "data" },
    ],
  },
  {
    id: "dlp-pipeline",
    name: "DLP Pipeline",
    nodes: [
      { label: "Employee", kind: "user" },
      { label: "Entra ID Authentication", kind: "security" },
      { label: "AI Gateway", kind: "service" },
      { label: "Layer 1 — Microsoft Presidio", sub: "Pattern / PII detection", kind: "security" },
      { label: "Layer 2 — LLM Classifier", sub: "19 detection categories", kind: "security" },
      { label: "Policy Engine", sub: "Department-level controls", kind: "security" },
      { label: "OpenAI / Anthropic / Groq", kind: "ai" },
      { label: "Audit Log + Admin Alerts", kind: "data" },
    ],
  },
  {
    id: "server-rendered-cms",
    name: "Server-Rendered CMS",
    nodes: [
      { label: "Visitor / Admin", kind: "user" },
      { label: "Express Router", sub: "Public site · Admin · JSON API", kind: "service" },
      { label: "Session Authentication", sub: "PostgreSQL-backed sessions", kind: "security" },
      { label: "Content Service Layer", sub: "Every read query in one module", kind: "service" },
      { label: "PostgreSQL", sub: "Relational content model · migrations", kind: "data" },
      { label: "EJS Server-Side Rendering", kind: "app" },
      { label: "Docker / Fly.io", sub: "GitHub Actions CI/CD", kind: "infra" },
    ],
  },
  {
    id: "logistics",
    name: "Logistics Platform",
    nodes: [
      { label: "Marketplace Orders", sub: "Rakuten · Joom · eBay", kind: "user" },
      { label: "ERP-style Platform", sub: "CakePHP · MongoDB · MySQL", kind: "service" },
      { label: "Order Processing", kind: "service" },
      { label: "Carrier APIs", sub: "APG · CTTExpress · PosteItaliane", kind: "service" },
      { label: "Tracking Service", sub: "3,500+ global carriers", kind: "data" },
      { label: "Live Shipment Updates", kind: "app" },
    ],
  },
];
