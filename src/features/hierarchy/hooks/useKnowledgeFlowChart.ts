import { useMemo } from "react";
import { useKnowledgeFlow } from "@/features/node/hooks/useKnowledgeFlow";
import { getBaseHierarchyDataWithPosts } from "@/features/node/utils/postNodes";
import {
  createHierarchicalNodes,
  createHierarchicalEdges,
} from "@/features/hierarchy/utils/hierarchyUtils";

export function useKnowledgeFlowChart() {
  // Create hierarchical structure
  const hierarchicalNodes = useMemo(() => createHierarchicalNodes(), []);

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
