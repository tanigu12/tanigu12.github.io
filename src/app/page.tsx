'use client';

import { useMemo } from 'react';
import { KnowledgeFlowChart } from '@/features/node/components/KnowledgeFlowChart';
import { useKnowledgeFlow } from '@/features/node/hooks/useKnowledgeFlow';
import { defaultNodes, defaultEdges } from '@/features/node/utils/nodeData';
import { getPostsFromDirectory } from '@/features/node/utils/postNodes';
import { createHierarchicalNodes, createHierarchicalEdges } from '@/features/node/utils/hierarchyUtils';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const postNodes = useMemo(() => getPostsFromDirectory(), []);
  
  // Combine default nodes with post nodes for hierarchical organization
  const flatNodes = useMemo(() => [...defaultNodes, ...postNodes], [postNodes]);
  
  // Create hierarchical structure
  const hierarchicalNodes = useMemo(() => createHierarchicalNodes(flatNodes), [flatNodes]);
  const hierarchicalEdges = useMemo(() => createHierarchicalEdges(hierarchicalNodes), [hierarchicalNodes]);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onToggleExpand, selectedNodeId, selectNode } = useKnowledgeFlow(
    hierarchicalNodes,
    hierarchicalEdges
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <KnowledgeFlowChart
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onToggleExpand={onToggleExpand}
          selectedNodeId={selectedNodeId}
          selectNode={selectNode}
        />
      </main>
      <Footer />
    </div>
  );
}
