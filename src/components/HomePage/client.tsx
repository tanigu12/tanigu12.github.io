"use client";

import { KnowledgeFlowChart } from "@/features/hierarchy/components/KnowledgeFlowChart";
import { useKnowledgeFlowChart } from "@/features/hierarchy/hooks/useKnowledgeFlowChart";

export default function HomePageClient() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onToggleExpand,
    selectNode,
  } = useKnowledgeFlowChart();

  return (
    <KnowledgeFlowChart
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onToggleExpand={onToggleExpand}
      selectNode={selectNode}
    />
  );
}
