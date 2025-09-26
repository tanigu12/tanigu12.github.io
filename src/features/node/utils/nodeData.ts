import { KnowledgeNode, KnowledgeEdge } from "../types";

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
    level,
  },
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
    relationship,
  },
});
