import { Node, Edge } from '@xyflow/react';

export enum ExpansionState {
  Collapsed = 'collapsed',
  Expanded = 'expanded',
  Partial = 'partial'
}

export interface KnowledgeNode extends Node {
  data: {
    label: string;
    description?: string;
    category?: string;
    url?: string;
    datetime?: string;
    tags?: string[];
    isExpanded?: ExpansionState;
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