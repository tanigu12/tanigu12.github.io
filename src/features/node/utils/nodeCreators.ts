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
  hasChildren: boolean = false
): KnowledgeNode {
  const nodeId = `category-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const position = {
    x: parentPosition.x,
    y: parentPosition.y + POSITIONS.CATEGORY.offset.y,
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
    hidden: true, // Initially hidden until parent is expanded
  };
}

export function createTagNode(
  name: string,
  parentId: string,
  parentPosition: { x: number; y: number },
  tagIndex: number
): KnowledgeNode {
  const nodeId = `tag-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const position = {
    x: parentPosition.x + (tagIndex % 4) * POSITIONS.TAG.offset.x,
    y: parentPosition.y + Math.floor(tagIndex / 4) * POSITIONS.TAG.offset.y,
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
  postIndex: number
): KnowledgeNode {
  const nodeId = hierarchyNode.postData!.id;
  const position = {
    x: parentPosition.x,
    y: parentPosition.y + POSITIONS.POST.offset.y * (postIndex + 1),
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
