export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  fundingGoal: number;
  raisedAmount: number;
  category: string;
  institution: string;
  researchers: string[];
  timeline: string;
  imageUrl: string;
}

export const researchProjects: ResearchProject[] = [
  {
    id: "1",
    title: "Novel Drug Delivery System Using Nanoparticles",
    description: "Developing a revolutionary drug delivery system using biodegradable nanoparticles that can target specific cells, reducing side effects and improving treatment efficacy for cancer patients.",
    fundingGoal: 500000,
    raisedAmount: 150000,
    category: "Medical Research",
    institution: "Stanford Medical Center",
    researchers: ["Dr. Sarah Chen", "Dr. Michael Rodriguez"],
    timeline: "2 years",
    imageUrl: "/images/projects/nanoparticles.jpg"
  },
  {
    id: "2",
    title: "Quantum Computing for Climate Modeling",
    description: "Utilizing quantum computing algorithms to create more accurate climate models that can better predict extreme weather events and long-term climate changes.",
    fundingGoal: 750000,
    raisedAmount: 300000,
    category: "Climate Science",
    institution: "MIT Climate Research Lab",
    researchers: ["Dr. James Wilson", "Dr. Emily Thompson"],
    timeline: "3 years",
    imageUrl: "/images/projects/quantum-climate.jpg"
  },
  {
    id: "3",
    title: "AI-Powered Renewable Energy Grid Optimization",
    description: "Developing AI algorithms to optimize renewable energy distribution and storage, making clean energy more reliable and efficient for urban areas.",
    fundingGoal: 400000,
    raisedAmount: 175000,
    category: "Renewable Energy",
    institution: "Berkeley Energy Institute",
    researchers: ["Dr. David Kumar", "Dr. Lisa Martinez"],
    timeline: "18 months",
    imageUrl: "/images/projects/renewable-grid.jpg"
  },
  {
    id: "4",
    title: "CRISPR-Based Treatment for Rare Genetic Disorders",
    description: "Researching novel CRISPR gene-editing techniques to develop treatments for rare genetic disorders that currently have no cure.",
    fundingGoal: 1000000,
    raisedAmount: 450000,
    category: "Genetics",
    institution: "Harvard Medical School",
    researchers: ["Dr. Robert Chang", "Dr. Amanda Foster"],
    timeline: "4 years",
    imageUrl: "/images/projects/crispr-research.jpg"
  }
];
