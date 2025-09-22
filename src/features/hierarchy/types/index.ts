export interface HierarchyNode {
  type: "category" | "tag";
  children: Record<string, HierarchyNode> | string[];
}

export interface HierarchyConfig {
  rootCategories: Record<string, HierarchyNode>;
}

export const hierarchyConfig: HierarchyConfig = {
  rootCategories: {
    Personal: {
      type: "category",
      children: {
        "Blog Post": {
          type: "tag",
          children: [
            "introduction",
            "personal",
            "reflection"
          ]
        }
      }
    },
    Technology: {
      type: "category",
      children: {
        Frontend: {
          type: "tag",
          children: [
            "react",
            "typescript",
            "javascript",
            "css"
          ]
        },
        Backend: {
          type: "tag",
          children: [
            "node",
            "api",
            "database"
          ]
        },
        Language: {
          type: "tag",
          children: [
            "english",
            "learning",
            "language"
          ]
        },
        Tools: {
          type: "tag",
          children: [
            "react",
            "typescript",
            "javascript",
            "css"
          ]
        }
      }
    }
  }
};