import { KnowledgeNode, KnowledgeEdge } from '../types';

export const createKnowledgeNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  description?: string,
  category?: string,
  url?: string,
  date?: string,
  tags?: string[],
  isExpanded?: boolean,
  hasChildren?: boolean,
  parentId?: string,
  level?: number
): KnowledgeNode => ({
  id,
  position,
  data: {
    label,
    description,
    category,
    url,
    date,
    tags,
    isExpanded,
    hasChildren,
    parentId,
    level
  }
});

export const createKnowledgeEdge = (
  id: string,
  source: string,
  target: string,
  relationship?: string
): KnowledgeEdge => ({
  id,
  source,
  target,
  data: {
    relationship
  }
});

export const defaultNodes: KnowledgeNode[] = [
  createKnowledgeNode('1', 'React', { x: 100, y: 100 }, 'JavaScript library for building user interfaces', 'Frontend'),
  createKnowledgeNode('2', 'TypeScript', { x: 300, y: 100 }, 'Typed superset of JavaScript', 'Language'),
];

export const defaultEdges: KnowledgeEdge[] = [
  createKnowledgeEdge('e1-2', '1', '2', 'uses'),
];