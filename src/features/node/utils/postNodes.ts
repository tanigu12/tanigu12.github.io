import { KnowledgeNode, KnowledgeEdge } from '../types';
import postsData from './postsData.json';

export function getPostsFromDirectory(): KnowledgeNode[] {
  return postsData.nodes as KnowledgeNode[];
}

export function generatePostEdges(postNodes: KnowledgeNode[]): KnowledgeEdge[] {
  return postsData.edges as KnowledgeEdge[];
}