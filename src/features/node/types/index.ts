import { Node, Edge } from '@xyflow/react';

export interface KnowledgeNode extends Node {
  data: {
    label: string;
    description?: string;
    category?: string;
    url?: string;
    date?: string;
    tags?: string[];
    isExpanded?: boolean;
    hasChildren?: boolean;
    parentId?: string;
    level?: number;
  };
}

export interface KnowledgeEdge extends Edge {
  data?: {
    relationship?: string;
  };
}

export interface NodeFeatureProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
}