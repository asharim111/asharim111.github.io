export interface SkillGroup {
  id: string;
  name: string;
  accent: string;
  skills: Array<{ name: string; context: string }>;
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    name: "Frontend",
    accent: "var(--color-cyan)",
    skills: [
      { name: "React.js", context: "Primary UI library across enterprise apps and dashboards" },
      { name: "React Router", context: "SPA routing (Pamatec, dashboards)" },
      { name: "TypeScript", context: "Typed JavaScript for maintainable front ends" },
      { name: "Bootstrap", context: "Responsive layout and component styling" },
      { name: "jQuery", context: "Legacy platform interactivity" },
      { name: "HTML / CSS", context: "Semantic, responsive web development" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    accent: "var(--color-blue)",
    skills: [
      { name: "Node.js", context: "API services; cut response times ~50% (160ms → 80ms)" },
      { name: "Express.js", context: "REST API layer in MERN systems" },
      { name: "EJS", context: "Server-rendered group + 6 company sites for the oil & gas platform" },
      { name: "FastAPI", context: "Python services powering the AI Gateway" },
      { name: "PHP", context: "7 years across enterprise platforms" },
      { name: "Laravel", context: "PHP application framework" },
      { name: "CakePHP", context: "ERP-style logistics software" },
      { name: "CodeIgniter", context: "Market research platform (myMRPlace)" },
      { name: "REST APIs", context: "Design and integration of carrier, marketplace, and internal APIs" },
    ],
  },
  {
    id: "ai-security",
    name: "AI & Security",
    accent: "var(--color-violet)",
    skills: [
      { name: "OpenAI API", context: "LLM integration in the AI Gateway" },
      { name: "Anthropic API", context: "Claude routing through governed DLP pipeline" },
      { name: "Groq API", context: "Alternate high-speed LLM provider" },
      { name: "Google Gemini", context: "AI Code Reviewer (Gemini 2.0 Flash)" },
      { name: "Microsoft Presidio", context: "Layer-1 PII/DLP detection engine" },
      { name: "Microsoft Entra ID", context: "SSO (Azure AD) for enterprise apps" },
      { name: "OAuth 2.0", context: "Authentication and authorization flows" },
      { name: "RBAC", context: "Role-based access control" },
      { name: "OWASP Top 10", context: "Secure development practices" },
      { name: "Audit Logging", context: "Compliance and traceability" },
    ],
  },
  {
    id: "database",
    name: "Databases",
    accent: "var(--color-mint)",
    skills: [
      { name: "MongoDB", context: "Document store in MERN and ERP systems" },
      { name: "MySQL", context: "Query optimization and data modeling" },
      { name: "PostgreSQL", context: "AI Gateway and oil & gas platform: JSONB page blocks, 20 transactional migrations" },
      { name: "SQL Server", context: "ERP-integrated analytics platform" },
      { name: "Redis", context: "Caching and fast state for the AI Gateway" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    accent: "var(--color-warn)",
    skills: [
      { name: "AWS EC2", context: "Compute hosting" },
      { name: "AWS S3", context: "Object storage" },
      { name: "AWS SQS", context: "Message queues" },
      { name: "AWS SES", context: "Transactional email" },
      { name: "Docker", context: "Containerized deployments" },
      { name: "Fly.io", context: "Container hosting and guarded Postgres sync for the oil & gas platform" },
      { name: "GitHub Actions", context: "CI/CD pipelines for containerized deploys" },
      { name: "Linux Server", context: "Server administration" },
      { name: "Git / Bitbucket", context: "Version control and collaboration" },
      { name: "JIRA", context: "Agile project tracking" },
      { name: "Selenium", context: "Automated testing" },
    ],
  },
  {
    id: "platforms",
    name: "Platforms",
    accent: "var(--color-pink)",
    skills: [
      { name: "Zoho Creator", context: "Enterprise workflow automation" },
      { name: "Zoho Catalyst", context: "Serverless functions" },
      { name: "Microsoft PowerApps", context: "Low-code internal tooling" },
      { name: "WordPress", context: "CMS development" },
      { name: "Joomla", context: "CMS + Joomla Component Builder" },
    ],
  },
];
