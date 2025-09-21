export interface HierarchyConfig {
  rootCategories: string[];
  categoryHierarchy: Record<string, string[]>;
  tagHierarchy: Record<string, string[]>;
}

export const hierarchyConfig: HierarchyConfig = {
  rootCategories: ["Personal", "Technology"],
  categoryHierarchy: {
    Technology: ["Frontend", "Backend", "Language", "Tools"],
    Personal: [],
  },
  tagHierarchy: {
    Frontend: ["react", "typescript", "javascript", "css"],
    Backend: ["node", "api", "database"],
    Language: ["english", "learning", "language"],
  },
};

// export const hierarchyConfig: HierarchyConfig = {
//   rootCategories: ["Technology", "Personal", "Learning"],
//   categoryHierarchy: {
//     Technology: ["Frontend", "Backend", "Language", "Tools"],
//     Personal: ["Blog Post", "Travel", "Experience"],
//     Learning: ["English", "Development", "Growth"],
//   },
//   tagHierarchy: {
//     Frontend: ["react", "typescript", "javascript", "css"],
//     Backend: ["node", "api", "database"],
//     English: ["english", "learning", "language"],
//     Travel: ["travel", "cebu", "vacation"],
//     Development: ["development", "coding", "programming"],
//     "Blog Post": ["introduction", "personal", "reflection"],
//   },
// };
