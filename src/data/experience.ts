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
    role: "Full Stack Developer",
    period: "Sep 2025 – Present",
    location: "Ardiya, Kuwait",
    stack: [
      "FastAPI",
      "React.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Entra ID",
      "DLP",
      "Zoho Creator",
      "Zoho Catalyst",
    ],
    highlights: [
      "Architect and build an internal AI gateway (FastAPI, React.js, PostgreSQL, Redis, Docker) that routes employee ChatGPT/Claude usage through a two-layer data loss prevention pipeline.",
      "Enforce Entra ID SSO, department-level policy controls, and audit logging with real-time admin alerting on every flagged prompt.",
      "Design and develop a MERN-based Ticket Management System across IT, business, and procurement modules, centralizing 3+ internal workflows for issue tracking, service requests, and approvals.",
      "Automate 4 procurement workflow stages — Material Requests, Purchase Orders, invoice handling, and ticket closure — reducing manual handoffs and improving operational turnaround.",
      "Build and deploy enterprise automation solutions using Zoho Creator, Zoho Catalyst, REST APIs, and serverless functions to digitize internal workflows and improve cross-department visibility.",
    ],
    visual: "gateway",
  },
  {
    company: "Phoenix Biz Solutions",
    role: "Web Developer",
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
      "Built and maintained business-critical, ERP-style software using CakePHP, MongoDB, and MySQL, supporting marketplace product synchronization, order processing, and multi-carrier logistics operations.",
      "Integrated carrier APIs including APG, CTTExpress, and PosteItaliane, along with marketplace APIs such as Rakuten, Joom, and eBay, improving synchronization efficiency by 25%.",
      "Built a shipment tracking platform (dmstrack.com) delivering live updates across 3,500+ global carriers, improving logistics visibility and operational tracking.",
      "Optimized backend services using Node.js, reducing API response times by 20% and improving user experience.",
    ],
    visual: "logistics",
  },
  {
    company: "myMRPlace",
    role: "Full Stack Developer",
    period: "Sep 2019 – Jul 2022",
    location: "Thane, India",
    stack: ["CodeIgniter", "MySQL", "Scrum", "Backend Optimization"],
    highlights: [
      "Built and maintained a CodeIgniter and MySQL-based platform (mymrplace.com) connecting buyers and suppliers in the market research industry, supporting international research operations and supplier collaboration.",
      "Improved website functionality and backend performance, contributing to a 20% reduction in page load time.",
      "Served as Scrum Master for Agile sprints, facilitating stand-ups, prioritization, and sprint execution.",
      "Refactored MySQL queries to improve data retrieval speed and backend efficiency.",
    ],
  },
  {
    company: "Evolution Co",
    role: "PHP Developer Intern",
    period: "Jul 2019 – Sep 2019",
    location: "Mumbai, India",
    stack: ["PHP", "Joomla", "Joomla Component Builder", "Facebook API", "Instagram API"],
    highlights: [
      "Contributed to building a dynamic website using Joomla and Joomla Component Builder (JCB).",
      "Involved in software module design, development, and support.",
      "Gained hands-on experience with Facebook and Instagram APIs.",
    ],
  },
];
