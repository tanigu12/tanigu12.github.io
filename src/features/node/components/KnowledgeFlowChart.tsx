'use client';

import { useEffect, useCallback } from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ExpandableNode, setGlobalToggleExpand } from '@/features/hierarchy/components/ExpandableNode';
import { NodeFeatureProps } from '../types';

const nodeTypes = {
  expandableNode: ExpandableNode,
};

interface KnowledgeFlowChartProps extends NodeFeatureProps {
  onToggleExpand: (nodeId: string) => void;
  selectedNodeId?: string | null;
  selectNode?: (nodeId: string | null) => void;
}

export function KnowledgeFlowChart({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onToggleExpand,
  selectedNodeId,
  selectNode
}: KnowledgeFlowChartProps) {
  // Set the global toggle function
  useEffect(() => {
    setGlobalToggleExpand(onToggleExpand);
  }, [onToggleExpand]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (selectNode) {
      selectNode(node.id);
    }
  }, [selectNode]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}