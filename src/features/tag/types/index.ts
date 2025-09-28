export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface TaggedPost {
  id: string;
  title: string;
  slug: string;
  datetime: string;
  tags: string[];
  categories: string[];
}

export interface TagWithPosts extends Tag {
  posts: TaggedPost[];
}

export interface TagCloudData {
  tags: Tag[];
  minCount: number;
  maxCount: number;
}