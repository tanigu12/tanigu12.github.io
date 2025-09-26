import { KnowledgeNode, KnowledgeEdge } from "@/features/node/types";
import { HierarchyNode } from "../types";
import {
  createRootNode,
  createCategoryNode,
  createTagNode,
  createPostNode,
} from "@/features/node/utils/nodeCreators";

export function createHierarchicalNodesFromData(): KnowledgeNode[] {
  try {
    const baseHierarchyDataWithPosts =
      require("../data/baseHierarchyDataWithPosts.json") as HierarchyNode[];
    return processHierarchyData(baseHierarchyDataWithPosts);
  } catch (error) {
    console.warn("Could not load posts data, using empty hierarchy:", error);
    return [];
  }
}

function processHierarchyData(hierarchyData: HierarchyNode[]): KnowledgeNode[] {
  const nodes: KnowledgeNode[] = [];
  const nodeMap = new Map<string, KnowledgeNode>();

  function processNode(
    hierarchyNode: HierarchyNode,
    level: number,
    parentId?: string,
    parentPosition?: { x: number; y: number }
  ): void {
    const hasChildren = !!(
      hierarchyNode.children && hierarchyNode.children.length > 0
    );
    let reactFlowNode: KnowledgeNode;

    // Create node based on type using utility functions
    switch (hierarchyNode.type) {
      case "root":
        const rootIndex = hierarchyData.findIndex(
          (n) => n.name === hierarchyNode.name
        );
        reactFlowNode = createRootNode(
          hierarchyNode.name,
          rootIndex,
          hasChildren
        );
        break;

      case "category":
        const categoryIndex = getNodeIndexInSiblings(
          hierarchyNode,
          hierarchyData,
          parentId!
        );
        reactFlowNode = createCategoryNode(
          hierarchyNode.name,
          parentId!,
          parentPosition!,
          categoryIndex,
          hasChildren
        );
        break;

      case "tag":
        const tagIndex = getNodeIndexInSiblings(
          hierarchyNode,
          hierarchyData,
          parentId!
        );
        reactFlowNode = createTagNode(
          hierarchyNode.name,
          parentId!,
          parentPosition!,
          tagIndex
        );
        break;

      case "post":
        const postIndex = getNodeIndexInSiblings(
          hierarchyNode,
          hierarchyData,
          parentId!
        );
        reactFlowNode = createPostNode(
          hierarchyNode,
          parentId!,
          parentPosition!,
          postIndex
        );
        break;

      default:
        return;
    }

    // Apply visibility rules for nested nodes
    if (
      level > 1 ||
      (level === 1 && parentId && !nodeMap.get(parentId)?.data.isExpanded)
    ) {
      reactFlowNode = {
        ...reactFlowNode,
        hidden: true,
      };
    }

    nodes.push(reactFlowNode);
    nodeMap.set(reactFlowNode.id, reactFlowNode);

    // Process children recursively
    if (hierarchyNode.children) {
      hierarchyNode.children.forEach((child) => {
        processNode(child, level + 1, reactFlowNode.id, reactFlowNode.position);
      });
    }
  }

  // Process all root nodes
  hierarchyData.forEach((rootNode) => {
    processNode(rootNode, 0);
  });

  return nodes;
}

function getNodeIndexInSiblings(
  node: HierarchyNode,
  hierarchyData: HierarchyNode[],
  parentId: string
): number {
  // Find parent and get index of this node among its siblings
  function findParentAndIndex(
    nodes: HierarchyNode[],
    targetNode: HierarchyNode
  ): number {
    for (const rootNode of nodes) {
      const result = findInChildren(rootNode, targetNode);
      if (result !== -1) return result;
    }
    return 0;
  }

  function findInChildren(
    parent: HierarchyNode,
    target: HierarchyNode
  ): number {
    if (!parent.children) return -1;

    const index = parent.children.findIndex((child) => child === target);
    if (index !== -1) return index;

    for (const child of parent.children) {
      const result = findInChildren(child, target);
      if (result !== -1) return result;
    }
    return -1;
  }

  return findParentAndIndex(hierarchyData, node);
}

export function createHierarchicalNodes(): KnowledgeNode[] {
  // This function is kept for backward compatibility but now uses the JSON data
  return createHierarchicalNodesFromData();
}

export function createHierarchicalEdges(
  nodes: KnowledgeNode[]
): KnowledgeEdge[] {
  const edges: KnowledgeEdge[] = [];

  nodes.forEach((node) => {
    if (node.data.parentId) {
      const parentNode = nodes.find((n) => n.id === node.data.parentId);
      if (parentNode) {
        edges.push({
          id: `edge-${node.data.parentId}-${node.id}`,
          source: node.data.parentId,
          target: node.id,
          type: "smoothstep",
          style: {
            stroke: "#94a3b8",
            strokeWidth: 2,
          },
          hidden: node.hidden || parentNode.hidden,
        });
      }
    }
  });

  return edges;
}

export function toggleNodeExpansion(
  nodes: KnowledgeNode[],
  nodeId: string
): KnowledgeNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      // Toggle the clicked node's expansion state
      return {
        ...node,
        data: {
          ...node.data,
          isExpanded: !node.data.isExpanded,
        },
      };
    } else if (node.data.parentId === nodeId) {
      // Show/hide direct children
      const parentNode = nodes.find((n) => n.id === nodeId);
      const shouldBeVisible = parentNode?.data.isExpanded === false; // Will be true after toggle

      return {
        ...node,
        hidden: !shouldBeVisible,
      };
    } else if (node.data.parentId) {
      // Update visibility for nested children
      const parentNode = nodes.find((n) => n.id === node.data.parentId);
      const grandParentNode = parentNode?.data.parentId
        ? nodes.find((n) => n.id === parentNode.data.parentId)
        : null;

      const isParentVisible =
        !parentNode?.hidden && parentNode?.data.isExpanded;
      const isGrandParentVisible =
        !grandParentNode ||
        (!grandParentNode.hidden && grandParentNode.data.isExpanded);

      return {
        ...node,
        hidden: !(isParentVisible && isGrandParentVisible),
      };
    }

    return node;
  });
}
