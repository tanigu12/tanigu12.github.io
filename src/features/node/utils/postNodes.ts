import { KnowledgeNode, KnowledgeEdge } from '../types';

export function getPostsFromDirectory(): KnowledgeNode[] {
  try {
    // Use dynamic import to avoid TypeScript issues with JSON at compile time
    const postsData = require('../data/postsData.json');
    return postsData.nodes as KnowledgeNode[];
  } catch (error) {
    console.warn('Could not load posts data:', error);
    return [];
  }
}

export function generatePostEdges(postNodes: KnowledgeNode[]): KnowledgeEdge[] {
  try {
    const postsData = require('../data/postsData.json');
    return postsData.edges as KnowledgeEdge[];
  } catch (error) {
    console.warn('Could not load posts edges:', error);
    return [];
  }
}