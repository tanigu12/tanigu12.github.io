import { KnowledgeNode, KnowledgeEdge } from "../types";
import { hierarchyConfig } from "../data/hierarchy";

const POSITIONS = {
  ROOT: {
    base: { x: 400, y: 0 },
    offset: { x: 0, y: 400 },
  },
  CATEGORY: {
    offset: { x: 250, y: 100 },
  },
  NODE: {
    base: { x: 250, y: 100 },
    offset: { x: 250, y: 100 },
  },
};

export function createHierarchicalNodes(
  flatNodes: KnowledgeNode[]
): KnowledgeNode[] {
  const hierarchicalNodes: KnowledgeNode[] = [];
  const nodeMap = new Map<string, KnowledgeNode>();

  // Create root category nodes
  hierarchyConfig.rootCategories.forEach((category, index) => {
    const rootNode: KnowledgeNode = {
      id: `root-${category.toLowerCase()}`,
      position: {
        x: POSITIONS.ROOT.base.x + index * POSITIONS.ROOT.offset.x,
        y: POSITIONS.ROOT.base.y + index * POSITIONS.ROOT.offset.y,
      },
      data: {
        label: category,
        category: "Root",
        isExpanded: true,
        hasChildren: true,
        level: 0,
      },
      type: "expandableNode",
    };
    hierarchicalNodes.push(rootNode);
    nodeMap.set(rootNode.id, rootNode);
  });

  // Create subcategory nodes
  Object.entries(hierarchyConfig.categoryHierarchy).forEach(
    ([parentCategory, subCategories]) => {
      const parentId = `root-${parentCategory.toLowerCase()}`;
      const parentNode = nodeMap.get(parentId);

      if (parentNode) {
        subCategories.forEach((subCategory, index) => {
          const subNode: KnowledgeNode = {
            id: `category-${subCategory.toLowerCase()}`,
            position: {
              x: parentNode.position.x + POSITIONS.CATEGORY.offset.x,
              y:
                parentNode.position.y +
                (index - subCategories.length / 2) *
                  POSITIONS.CATEGORY.offset.y,
            },
            data: {
              label: subCategory,
              category: "Category",
              isExpanded: false,
              hasChildren: true,
              parentId: parentId,
              level: 1,
            },
            type: "expandableNode",
            hidden: !parentNode.data.isExpanded,
          };
          hierarchicalNodes.push(subNode);
          nodeMap.set(subNode.id, subNode);
        });
      }
    }
  );

  // Assign existing nodes to appropriate categories
  flatNodes.forEach((node) => {
    let assignedCategory: string | null = null;
    let parentNode: KnowledgeNode | null = null;

    // Try to match by category
    if (node.data.category) {
      const categoryId = `category-${node.data.category.toLowerCase()}`;
      parentNode = nodeMap.get(categoryId) || null;
      assignedCategory = categoryId;
    }

    // Try to match by tags
    if (!parentNode && node.data.tags) {
      for (const [category, tags] of Object.entries(
        hierarchyConfig.tagHierarchy
      )) {
        const hasMatchingTag = node.data.tags.some((tag) =>
          tags.includes(tag.toLowerCase())
        );
        if (hasMatchingTag) {
          const categoryId = `category-${category.toLowerCase()}`;
          parentNode = nodeMap.get(categoryId) || null;
          assignedCategory = categoryId;
          break;
        }
      }
    }

    // If no specific category found, assign to appropriate root based on content
    if (!parentNode) {
      if (node.data.category === "Blog Post") {
        assignedCategory = "root-personal";
        parentNode = nodeMap.get("root-personal") || null;
      } else if (
        node.data.tags?.some((tag) =>
          ["react", "typescript", "javascript"].includes(tag)
        )
      ) {
        assignedCategory = "root-technology";
        parentNode = nodeMap.get("root-technology") || null;
      } else {
        assignedCategory = "root-learning";
        parentNode = nodeMap.get("root-learning") || null;
      }
    }

    if (parentNode && assignedCategory) {
      const enhancedNode: KnowledgeNode = {
        ...node,
        data: {
          ...node.data,
          parentId: assignedCategory,
          level: (parentNode.data.level || 0) + 1,
          hasChildren: false,
          isExpanded: false,
        },
        type: "expandableNode",
        position: {
          x: parentNode.position.x + POSITIONS.NODE.offset.x,
          y: parentNode.position.y,
        },
        hidden:
          !parentNode.data.isExpanded ||
          (parentNode.data.parentId
            ? !nodeMap.get(parentNode.data.parentId)?.data.isExpanded
            : false),
      };

      hierarchicalNodes.push(enhancedNode);
      nodeMap.set(enhancedNode.id, enhancedNode);
    }
  });

  return hierarchicalNodes;
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
