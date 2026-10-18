export interface ProcessStepData {
  index: string;
  title: string;
  description: string;
}

export const processStepsData: ProcessStepData[] = [
  {
    index: "01",
    title: "Discover",
    description: "Understand the business, audience, goals, and challenges.",
  },
  {
    index: "02",
    title: "Plan",
    description: "Define the scope, user experience, and priorities.",
  },
  {
    index: "03",
    title: "Create",
    description: "Design and build the solution.",
  },
  {
    index: "04",
    title: "Refine",
    description: "Review, improve, and deliver.",
  },
];
