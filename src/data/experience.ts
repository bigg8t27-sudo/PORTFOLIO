export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  details?: string[];
}

export const timeline: TimelineEvent[] = [
  {
    year: 2026,
    title: "Data Science & Analytics",
    description: "Ghana Communication Technology University",
    details: [
      "Pursuing degree in Data Science & Analytics",
      "Specializing in data analysis and visualization",
      "Building real-world projects with statistical methods",
    ],
  },
  {
    year: 2025,
    title: "Software Development",
    description: "Started developing software projects and learning modern web technologies",
    details: [
      "Built multiple full-stack applications",
      "Learned React, TypeScript, and Node.js",
      "Deployed projects to production",
    ],
  },
  {
    year: 2025,
    title: "Data Analytics",
    description: "Started exploring Python, statistics, data analysis and visualization",
    details: [
      "Mastered Python and Pandas for data manipulation",
      "Learned SQL for database queries",
      "Created data visualizations and insights",
    ],
  },
  {
    year: 2024,
    title: "Programming",
    description: "Started building programming fundamentals",
    details: [
      "Learned C++ and basic algorithms",
      "Built problem-solving skills",
      "Explored different programming paradigms",
    ],
  },
];
