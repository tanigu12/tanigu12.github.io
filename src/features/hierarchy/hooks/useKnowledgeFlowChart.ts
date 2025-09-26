import { useMemo } from "react";
import { useKnowledgeFlow } from "@/features/node/hooks/useKnowledgeFlow";
import { defaultNodes, defaultEdges } from "@/features/node/utils/nodeData";
import { getPostsFromDirectory } from "@/features/node/utils/postNodes";
import {
  createHierarchicalNodes,
  createHierarchicalEdges,
} from "@/features/hierarchy/utils/hierarchyUtils";

export function useKnowledgeFlowChart() {
  // Load post nodes from directory
  const postNodes = useMemo(() => getPostsFromDirectory(), []);

  // Combine default nodes with post nodes for hierarchical organization
  const flatNodes = useMemo(() => [...defaultNodes, ...postNodes], [postNodes]);

  // Create hierarchical structure
  const hierarchicalNodes = useMemo(
    () => createHierarchicalNodes(flatNodes),
    [flatNodes]
  );

  const hierarchicalEdges = useMemo(
    () => createHierarchicalEdges(hierarchicalNodes),
    [hierarchicalNodes]
  );

  // Use knowledge flow hook for interaction logic
  const knowledgeFlowProps = useKnowledgeFlow(
    hierarchicalNodes,
    hierarchicalEdges
  );

  return {
    ...knowledgeFlowProps,
  };
}
