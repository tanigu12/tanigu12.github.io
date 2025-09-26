import { KnowledgeNode } from "../types";
import { HierarchyNode } from "@/features/hierarchy/types";
import { POSITIONS } from "@/features/hierarchy/config/positions";

export function createRootNode(
  name: string,
  index: number,
  hasChildren: boolean = false
): KnowledgeNode {
  const nodeId = `root-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const position = {
    x: POSITIONS.ROOT.base.x + index * POSITIONS.ROOT.offset.x,
    y: POSITIONS.ROOT.base.y + index * POSITIONS.ROOT.offset.y,
  };

  return {
    id: nodeId,
    position,
    data: {
      label: name,
      category: "Root",
      level: 0,
      hasChildren,
      isExpanded: true, // Root nodes start expanded
    },
    type: "expandableNode",
    hidden: false,
  };
}

export function createCategoryNode(
  name: string,
  parentId: string,
  parentPosition: { x: number; y: number },
  index: number,
  hasChildren: boolean = false
): KnowledgeNode {
  const nodeId = `category-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const position = {
    x: parentPosition.x + POSITIONS.CATEGORY.offset.x + (index * 50), // Add spacing between categories
    y: parentPosition.y + POSITIONS.CATEGORY.offset.y + (index * POSITIONS.CATEGORY.offset.y * 0.3),
  };

  return {
    id: nodeId,
    position,
    data: {
      label: name,
      category: name,
      level: 1,
      parentId,
      hasChildren,
      isExpanded: false, // Categories start collapsed
    },
    type: "expandableNode",
    hidden: false, // Initially hidden until parent is expanded
  };
}

export function createTagNode(
  name: string,
  parentId: string,
  parentPosition: { x: number; y: number },
  index: number
): KnowledgeNode {
  const nodeId = `tag-${name.toLowerCase().replace(/\s+/g, "-")}`;
  // Improved grid layout with better spacing
  const tagsPerRow = 3; // Reduced from 4 for better spacing
  const position = {
    x: parentPosition.x + (index % tagsPerRow) * POSITIONS.TAG.offset.x,
    y: parentPosition.y + POSITIONS.TAG.offset.y + Math.floor(index / tagsPerRow) * POSITIONS.TAG.offset.y,
  };

  return {
    id: nodeId,
    position,
    data: {
      label: name,
      category: "Tag",
      level: 2,
      parentId,
      hasChildren: false,
      isExpanded: false,
    },
    type: "expandableNode",
    hidden: true, // Initially hidden until parent is expanded
  };
}

export function createPostNode(
  hierarchyNode: HierarchyNode,
  parentId: string,
  parentPosition: { x: number; y: number },
  index: number
): KnowledgeNode {
  const nodeId = hierarchyNode.postData!.id;
  // Better vertical spacing and slight horizontal offset for readability
  const position = {
    x: parentPosition.x + POSITIONS.POST.offset.x + (index % 2) * 150, // Alternate horizontal positions
    y: parentPosition.y + POSITIONS.POST.offset.y + (index * POSITIONS.POST.offset.y),
  };

  return {
    id: nodeId,
    position,
    data: {
      label: hierarchyNode.name,
      category: hierarchyNode.postData!.category,
      level: 3,
      parentId,
      hasChildren: false,
      isExpanded: false,
      description: hierarchyNode.postData!.description,
      url: hierarchyNode.postData!.url,
      tags: hierarchyNode.postData!.tags,
    },
    type: "expandableNode",
    hidden: true, // Initially hidden until parent is expanded
  };
}

export function findRootNodes(nodes: KnowledgeNode[]): KnowledgeNode[] {
  return nodes.filter((node) => node.data.level === 0);
}

export function findChildNodes(
  nodes: KnowledgeNode[],
  parentId: string
): KnowledgeNode[] {
  return nodes.filter((node) => node.data.parentId === parentId);
}

export function calculateOptimalPosition(
  basePosition: { x: number; y: number },
  nodeType: "category" | "tag" | "post",
  index: number,
  totalSiblings: number = 1
): { x: number; y: number } {
  switch (nodeType) {
    case "category":
      // Spread categories horizontally with some vertical offset
      return {
        x: basePosition.x + POSITIONS.CATEGORY.offset.x + (index * 200),
        y: basePosition.y + POSITIONS.CATEGORY.offset.y + (index * 30),
      };
    
    case "tag":
      // Grid layout for tags (3 per row)
      const tagsPerRow = 3;
      return {
        x: basePosition.x + (index % tagsPerRow) * POSITIONS.TAG.offset.x,
        y: basePosition.y + POSITIONS.TAG.offset.y + Math.floor(index / tagsPerRow) * POSITIONS.TAG.offset.y,
      };
    
    case "post":
      // Zigzag pattern for posts
      return {
        x: basePosition.x + POSITIONS.POST.offset.x + (index % 2) * 200,
        y: basePosition.y + POSITIONS.POST.offset.y + (index * POSITIONS.POST.offset.y),
      };
    
    default:
      return basePosition;
  }
}
