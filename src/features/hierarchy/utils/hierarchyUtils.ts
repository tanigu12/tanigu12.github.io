import { KnowledgeNode, KnowledgeEdge } from "@/features/node/types";
import { HierarchyNode } from "../types";
import { POSITIONS } from "../config/positions";

export function createHierarchicalNodesFromData(): KnowledgeNode[] {
  try {
    const postsData = require("../data/postsData.json") as HierarchyNode[];
    return processHierarchyData(postsData);
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
    let nodeId: string;
    let position: { x: number; y: number };
    let hasChildren = false;

    // Determine node ID and position based on type
    switch (hierarchyNode.type) {
      case "root":
        nodeId = `root-${hierarchyNode.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        const rootIndex = hierarchyData.findIndex(
          (n) => n.name === hierarchyNode.name
        );
        position = {
          x: POSITIONS.ROOT.base.x + rootIndex * POSITIONS.ROOT.offset.x,
          y: POSITIONS.ROOT.base.y + rootIndex * POSITIONS.ROOT.offset.y,
        };
        hasChildren = !!(
          hierarchyNode.children && hierarchyNode.children.length > 0
        );
        break;

      case "category":
        nodeId = `category-${hierarchyNode.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        position = {
          x: parentPosition!.x,
          y: parentPosition!.y + POSITIONS.CATEGORY.offset.y,
        };
        hasChildren = !!(
          hierarchyNode.children && hierarchyNode.children.length > 0
        );
        break;

      case "tag":
        nodeId = `tag-${hierarchyNode.name.toLowerCase().replace(/\s+/g, "-")}`;
        const tagIndex = getNodeIndexInSiblings(
          hierarchyNode,
          hierarchyData,
          parentId!
        );
        position = {
          x: parentPosition!.x + (tagIndex % 4) * POSITIONS.TAG.offset.x,
          y:
            parentPosition!.y +
            Math.floor(tagIndex / 4) * POSITIONS.TAG.offset.y,
        };
        break;

      case "post":
        nodeId = hierarchyNode.postData!.id;
        const postIndex = getNodeIndexInSiblings(
          hierarchyNode,
          hierarchyData,
          parentId!
        );
        position = {
          x: parentPosition!.x,
          y: parentPosition!.y + POSITIONS.POST.offset.y * (postIndex + 1),
        };
        break;

      default:
        return;
    }

    // Create the React Flow node
    const reactFlowNode: KnowledgeNode = {
      id: nodeId,
      position,
      data: {
        label: hierarchyNode.name,
        category:
          hierarchyNode.type === "root"
            ? "Root"
            : hierarchyNode.type === "category"
            ? hierarchyNode.name
            : hierarchyNode.type === "post"
            ? hierarchyNode.postData!.category
            : "Tag",
        level,
        parentId,
        hasChildren,
        isExpanded: hierarchyNode.type === "root", // Only roots start expanded
        ...(hierarchyNode.postData && {
          description: hierarchyNode.postData.description,
          url: hierarchyNode.postData.url,
          tags: hierarchyNode.postData.tags,
        }),
      },
      type: "expandableNode",
      hidden:
        level > 1 ||
        (level === 1 &&
          Boolean(parentId && !nodeMap.get(parentId)?.data.isExpanded)),
    };

    nodes.push(reactFlowNode);
    nodeMap.set(nodeId, reactFlowNode);

    // Process children recursively
    if (hierarchyNode.children) {
      hierarchyNode.children.forEach((child) => {
        processNode(child, level + 1, nodeId, position);
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

export function createHierarchicalNodes(
  _flatNodes: KnowledgeNode[] = []
): KnowledgeNode[] {
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
