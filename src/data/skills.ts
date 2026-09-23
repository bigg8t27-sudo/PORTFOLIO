export interface Skill {
  category: string;
  skills: string[];
}

export const skills: Skill[] = [
  { category: "Languages", skills: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
  { category: "Frameworks", skills: ["React", "Node.js", "Tailwind CSS", "GSAP"] },
  { category: "Data", skills: ["Pandas", "NumPy", "Matplotlib", "Statistics", "SQL"] },
  { category: "Tools", skills: ["Git", "GitHub", "VS Code", "Figma", "Linux"] },
];
