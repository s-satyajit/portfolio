import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "hirrd-job-portal",
    title: "Hirrd - Job Portal Platform",
    summary:
      "A recruiter and candidate workflow platform with secure auth and real-time job discovery.",
    description:
      "Hirrd is a full-stack hiring platform focused on practical recruiter and candidate workflows, from listings to application flow.",
    problem:
      "Job seekers and recruiters need a clean, low-friction workflow to publish roles and process applications without chaotic interfaces.",
    solution:
      "Built a role-driven product experience with authentication, listing management, and job application flow designed around clarity.",
    features: [
      "Role-based user flows for recruiters and candidates",
      "Secure authentication and protected routes",
      "Application and listing management UX",
      "Production-style deployment on Vercel"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    architecture: [
      "Client and API separation for maintainability",
      "Auth middleware for role-level protection",
      "Stateful form flow for job posting and application processing"
    ],
    images: ["/images/projects/hirrd.png"],
    links: {
      github: "https://github.com/s-satyajit/hirrd-jobPortal",
      live: "https://job-portal-eight-delta.vercel.app/",
      caseStudy: "/case-studies/hirrd-product-architecture"
    },
    featured: true,
    hasCaseStudy: true,
    category: "full-stack",
    status: "live",
    outcomes: [
      { label: "Use Case", value: "Recruitment workflow" },
      { label: "Core Strength", value: "Auth + product UX alignment" }
    ],
    lessonsLearned: [
      "Clear user-role boundaries reduce UI and API complexity.",
      "Recruiter-focused UX decisions require strong information hierarchy."
    ]
  },
  {
    slug: "livetalk-chat-app",
    title: "LiveTalk - Multi-User Chat App",
    summary: "Realtime multi-user chat with a polished interface and responsive interactions.",
    description:
      "LiveTalk is a communication app that supports multi-user chat experiences with responsive layout and low-latency updates.",
    problem:
      "Most starter chat apps are technically functional but weak in practical user flow and real-time reliability.",
    solution:
      "Built a chat product with reusable components, message handling patterns, and deployment-ready front-end reliability.",
    features: [
      "Realtime multi-user messaging",
      "Responsive chat interface",
      "Session-aware conversational flow",
      "Deployment-ready build"
    ],
    techStack: ["React", "Node.js", "Socket.io", "Tailwind CSS"],
    architecture: [
      "Event-driven messaging pipeline",
      "Client-side state synchronization for message threads",
      "Reusable chat surface and input modules"
    ],
    images: ["/images/projects/chat-app.png"],
    links: {
      github: "https://github.com/s-satyajit/multi-user-chatApp",
      live: "https://multi-user-chat.vercel.app/",
      caseStudy: "/case-studies/livetalk-realtime-system-notes"
    },
    featured: true,
    hasCaseStudy: true,
    category: "full-stack",
    status: "live",
    outcomes: [
      { label: "Use Case", value: "Realtime communication" },
      { label: "Core Strength", value: "Event-driven interface behavior" }
    ],
    lessonsLearned: [
      "Realtime apps need explicit state recovery patterns for reliability.",
      "Latency perception can be improved with small UX feedback loops."
    ]
  },
  {
    slug: "teamzen-employee-management-system",
    title: "TeamZen - Employee Management System",
    summary: "A structured dashboard for employee data workflows and management operations.",
    description:
      "TeamZen is a React-based EMS focused on operational clarity, enabling efficient employee record handling through a dashboard-driven interface.",
    problem:
      "Internal team tools are often functional but difficult to navigate when data scales.",
    solution:
      "Designed an interface-first data management workflow with clear information hierarchy and actionable controls.",
    features: [
      "Employee record management",
      "Dashboard views for operations",
      "Responsive UI behavior",
      "Modular component structure"
    ],
    techStack: ["React", "JavaScript", "CSS"],
    architecture: [
      "Component-driven dashboard composition",
      "Unified record CRUD workflows",
      "Client-state centric interaction layer"
    ],
    images: ["/images/projects/ems.png"],
    links: {
      github: "https://github.com/s-satyajit/employee-management-system",
      live: "https://teamzen.vercel.app/",
      caseStudy: "/case-studies/teamzen-dashboard-system-design"
    },
    featured: true,
    hasCaseStudy: true,
    category: "full-stack",
    status: "live",
    outcomes: [
      { label: "Use Case", value: "Internal operations dashboard" },
      { label: "Core Strength", value: "Data workflow clarity" }
    ],
    lessonsLearned: [
      "Structured tables and filtering patterns increase operational efficiency.",
      "System-like dashboards benefit from strict component contracts."
    ]
  },
  {
    slug: "codestudio-web-editor",
    title: "CodeStudio - Web Code Editor",
    summary: "A browser code editor with live preview and syntax-oriented workflow.",
    description:
      "CodeStudio enables editing HTML/CSS/JS in-browser with instant visual feedback and developer-centric ergonomics.",
    problem: "Quick frontend experimentation often requires local setup overhead.",
    solution:
      "Built a web editor that reduces setup friction with instant render feedback for frontend iteration.",
    features: [
      "HTML/CSS/JS editing panes",
      "Live preview rendering",
      "Developer-friendly layout",
      "Lightweight in-browser coding flow"
    ],
    techStack: ["React", "JavaScript", "Tailwind CSS"],
    architecture: [
      "Split-pane editor composition",
      "Preview rendering pipeline",
      "Local state-driven source synchronization"
    ],
    images: ["/images/projects/CodeStudio.png"],
    links: {
      github: "https://github.com/s-satyajit/WebCodeEditor",
      live: "https://web-code-editor-sigma.vercel.app/"
    },
    featured: false,
    hasCaseStudy: false,
    category: "frontend",
    status: "live",
    outcomes: [{ label: "Use Case", value: "Rapid frontend prototyping" }],
    lessonsLearned: [
      "Preview rendering must be isolated carefully for predictable behavior."
    ]
  },
  {
    slug: "inventory-dashboard",
    title: "Inventory Dashboard",
    summary: "An analytics-style dashboard for interpreting inventory sheet data with clarity.",
    description:
      "The dashboard translates spreadsheet inventory data into visual reporting for fast operational understanding.",
    problem:
      "Raw spreadsheet data makes pattern detection and reporting slow for decision-making.",
    solution:
      "Created a UI that surfaces summary metrics, trend visuals, and detailed tables from spreadsheet-driven data.",
    features: [
      "Interactive chart views",
      "Data tables and report layout",
      "Excel-sheet driven analysis",
      "Dashboard summary strip"
    ],
    techStack: ["React", "JavaScript", "Charting Libraries"],
    architecture: [
      "Data ingestion from sheet source",
      "Visualization layer for trends",
      "Metric cards for operational snapshots"
    ],
    images: ["/images/projects/inventory-dashboard.png"],
    links: {
      github: "https://github.com/s-satyajit/inventory-dashboard",
      live: "https://inventory-dashboard-bice.vercel.app/"
    },
    featured: false,
    hasCaseStudy: false,
    category: "frontend",
    status: "live",
    outcomes: [{ label: "Use Case", value: "Inventory analytics reporting" }],
    lessonsLearned: [
      "Operational dashboards should prioritize scannable summaries over dense visuals."
    ]
  },
  {
    slug: "tic-tac-toe-react",
    title: "Tic Tac Toe",
    summary: "A polished game implementation with undo/redo state management.",
    description:
      "A React + Tailwind implementation of Tic Tac Toe focused on clean state transitions and interaction quality.",
    problem:
      "Simple apps are useful for testing and demonstrating predictable state behavior.",
    solution:
      "Implemented game history, reset flow, and undo/redo actions using deterministic state updates.",
    features: ["Undo/redo", "Game reset", "Responsive gameplay interface"],
    techStack: ["React", "Tailwind CSS"],
    architecture: ["State history stack", "UI-state synchronization"],
    images: ["/images/projects/tic-tac-toe.png"],
    links: {
      github: "https://github.com/s-satyajit/TicTacToe-Reactjs",
      live: "https://tic-tac-toe-reactjs-gamma.vercel.app/"
    },
    featured: false,
    hasCaseStudy: false,
    category: "frontend",
    status: "live",
    outcomes: [{ label: "Use Case", value: "State-pattern demonstration" }],
    lessonsLearned: [
      "Predictable state history improves both debugging and UX iteration."
    ]
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
