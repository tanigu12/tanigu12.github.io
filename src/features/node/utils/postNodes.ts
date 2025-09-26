import { KnowledgeNode } from "../types";

export function getBaseHierarchyDataWithPosts(): KnowledgeNode[] {
  try {
    // Use dynamic import to avoid TypeScript issues with JSON at compile time
    const baseHierarchyDataWithPosts = require("../data/baseHierarchyDataWithPosts.json");
    return baseHierarchyDataWithPosts.nodes as KnowledgeNode[];
  } catch (error) {
    console.warn("Could not load posts data:", error);
    return [];
  }
}
