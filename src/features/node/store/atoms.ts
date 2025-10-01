import { atom } from "jotai";
import { KnowledgeNode, KnowledgeEdge, ExpansionState } from "../types";
import { createHierarchicalEdges } from "@/features/hierarchy/utils/hierarchyUtils";

// Base atoms for nodes and edges
const nodesAtom = atom<KnowledgeNode[]>([]);
export const edgesAtom = atom<KnowledgeEdge[]>([]);
export const selectedNodeIdAtom = atom<string | null>(null);

// Function to calculate expansion state based on children visibility
const calculateExpansionState = (
  nodeId: string,
  nodes: KnowledgeNode[]
): ExpansionState => {
  const children = nodes.filter((node) => node.data.parentId === nodeId);

  if (children.length === 0) {
    return ExpansionState.Collapsed; // No children = collapsed
  }

  const visibleChildren = children.filter((child) => !child.hidden);
  const hiddenChildren = children.filter((child) => child.hidden);

  if (visibleChildren.length === 0) {
    return ExpansionState.Collapsed; // All children hidden
  } else if (hiddenChildren.length === 0) {
    return ExpansionState.Expanded; // All children visible
  } else {
    return ExpansionState.Partial; // Some children visible, some hidden
  }
};

// Derived atom for nodes with dynamically calculated expansion states
export const nodesWithDynamicExpansionAtom = atom((get) => {
  const nodes = get(nodesAtom);

  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isExpanded: node.data.hasChildren
        ? calculateExpansionState(node.id, nodes)
        : ExpansionState.Collapsed,
    },
  }));
});

// Derived atom for visible nodes (using dynamic expansion)
export const visibleNodesAtom = atom((get) => {
  const nodes = get(nodesWithDynamicExpansionAtom);
  return nodes.filter((node) => node.hidden !== true);
});

// Write-only atom for toggling node selection
export const selectNodeAtom = atom(null, (get, set, nodeId: string | null) => {
  // Update selected node ID
  set(selectedNodeIdAtom, nodeId);

  // Update node selection state
  const currentNodes = get(nodesAtom);
  const updatedNodes = currentNodes.map((node) => ({
    ...node,
    selected: node.id === nodeId,
  }));
  set(nodesAtom, updatedNodes);
});

// Write-only atom for toggling node expansion
export const toggleNodeExpansionAtom = atom(
  null,
  (get, set, nodeId: string) => {
    const currentNodes = get(nodesAtom);
    const currentNodesWithExpansion = get(nodesWithDynamicExpansionAtom);

    // Find the node and its current expansion state
    const node = currentNodesWithExpansion.find((n) => n.id === nodeId);
    if (!node || !node.data.hasChildren) return;

    const currentExpansionState = node.data.isExpanded;
    const children = currentNodes.filter((n) => n.data.parentId === nodeId);

    let updatedNodes = [...currentNodes];

    // Toggle logic based on current state:
    // Collapsed -> Expanded (show all children)
    // Partial -> Expanded (show all children)
    // Expanded -> Collapsed (hide all children)
    if (
      currentExpansionState === ExpansionState.Collapsed ||
      currentExpansionState === ExpansionState.Partial
    ) {
      // Show all direct children
      updatedNodes = updatedNodes.map((node) => {
        if (children.some((child) => child.id === node.id)) {
          return { ...node, hidden: false };
        }
        return node;
      });
    } else if (currentExpansionState === ExpansionState.Expanded) {
      // Hide all children and their descendants
      const hideNodeAndDescendants = (nodeId: string) => {
        const directChildren = updatedNodes.filter(
          (n) => n.data.parentId === nodeId
        );
        updatedNodes = updatedNodes.map((node) => {
          if (
            node.id === nodeId ||
            directChildren.some((child) => child.id === node.id)
          ) {
            return { ...node, hidden: true };
          }
          return node;
        });
        // Recursively hide descendants
        directChildren.forEach((child) => hideNodeAndDescendants(child.id));
      };

      children.forEach((child) => hideNodeAndDescendants(child.id));
    }

    const updatedEdges = createHierarchicalEdges(updatedNodes);

    set(nodesAtom, updatedNodes);
    set(edgesAtom, updatedEdges);
  }
);

// Write-only atom for initializing nodes and edges
export const initializeNodesAndEdgesAtom = atom(
  null,
  (
    get,
    set,
    { nodes, edges }: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] }
  ) => {
    set(nodesAtom, nodes);

    // Generate hierarchical edges from nodes
    const hierarchicalEdges = createHierarchicalEdges(nodes);
    set(edgesAtom, hierarchicalEdges);
  }
);
