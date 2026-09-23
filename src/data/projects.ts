export interface Project {
  id: number;
  number: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  links: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
  featured?: boolean;
  year?: number;
}

export const projects: Project[] = [
  {
    id: 1,
    number: "01",
    title: "Student Performance Analytics",
    description: "Data-driven system analyzing student performance patterns and predicting academic outcomes.",
    longDescription: "Built a comprehensive analytics platform that processes student data to identify performance patterns, predict academic outcomes, and provide actionable insights to educators.",
    technologies: ["Python", "Pandas", "SQL", "Data Visualization", "Statistics"],
    image: "/projects/student-analytics.jpg",
    imageAlt: "Student Performance Analytics Dashboard",
    links: {
      github: "https://github.com/alfredofori/student-analytics",
      caseStudy: "#projects",
    },
    featured: true,
    year: 2025,
  },
  {
    id: 2,
    number: "02",
    title: "AI Study Assistant",
    description: "Intelligent study companion powered by AI, providing personalized learning recommendations.",
    longDescription: "An AI-powered application that helps students with personalized study recommendations, content summaries, and intelligent Q&A capabilities.",
    technologies: ["Python", "AI", "React", "APIs", "TypeScript"],
    image: "/projects/study-assistant.jpg",
    imageAlt: "AI Study Assistant Interface",
    links: {
      github: "https://github.com/alfredofori/study-assistant",
      live: "https://study-assistant.example.com",
    },
    featured: true,
    year: 2025,
  },
  {
    id: 3,
    number: "03",
    title: "Personal Finance Dashboard",
    description: "Full-stack dashboard for tracking expenses, budgets, and financial goals in real-time.",
    longDescription: "A responsive finance management application built with React and TypeScript, featuring budget tracking, expense categorization, and financial insights.",
    technologies: ["React", "TypeScript", "Node.js", "APIs", "Tailwind CSS"],
    image: "/projects/finance-dashboard.jpg",
    imageAlt: "Personal Finance Dashboard",
    links: {
      github: "https://github.com/alfredofori/finance-dashboard",
      live: "https://finance-dashboard.example.com",
    },
    featured: true,
    year: 2024,
  },
  {
    id: 4,
    number: "04",
    title: "Church Event Management System",
    description: "Complete event management solution for church activities, scheduling, and community coordination.",
    longDescription: "A full-stack web application for managing church events, member coordination, and community activities with real-time updates.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
    image: "/projects/church-events.jpg",
    imageAlt: "Church Event Management Dashboard",
    links: {
      github: "https://github.com/alfredofori/church-events",
    },
    featured: false,
    year: 2024,
  },
  {
    id: 5,
    number: "05",
    title: "Data Exploration Platform",
    description: "Interactive platform for statistical analysis and data visualization with advanced filtering.",
    longDescription: "A powerful data exploration tool built with Python, enabling interactive statistical analysis and beautiful data visualizations.",
    technologies: ["Python", "Statistics", "Data Visualization", "Pandas", "NumPy"],
    image: "/projects/data-explorer.jpg",
    imageAlt: "Data Exploration Platform",
    links: {
      github: "https://github.com/alfredofori/data-explorer",
    },
    featured: false,
    year: 2024,
  },
  {
    id: 6,
    number: "06",
    title: "Portfolio Website",
    description: "Premium, minimal portfolio website showcasing work with advanced animations and interactions.",
    longDescription: "A modern, performant portfolio website built with React, Vite, and Tailwind CSS featuring smooth animations and excellent UX.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Vite"],
    image: "/projects/portfolio.jpg",
    imageAlt: "Portfolio Website",
    links: {
      github: "https://github.com/alfredofori/portfolio",
      live: "https://alfredofori.com",
    },
    featured: false,
    year: 2026,
  },
];

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((p) => p.featured).slice(0, 4);
};

export const getProjectById = (id: number): Project | undefined => {
  return projects.find((p) => p.id === id);
};
