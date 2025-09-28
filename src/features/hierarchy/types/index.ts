
export interface PostData {
  id: string;
  label: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
}

export interface HierarchyNode {
  name: string;
  type: "root" | "category" | "tag" | "post";
  options?: {
    initialExpand?: boolean;
  };
  children?: HierarchyNode[];
  postData?: PostData;
}
