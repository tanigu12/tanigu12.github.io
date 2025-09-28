export interface PostFrontMatter {
  title?: string;
  datetime?: string;
  categories: string[];
  tags?: string[];
  description: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  datetime: string;
  tags: string[];
  categories: string[];
  description: string;
}

export interface PostWithContent extends Post {
  content: string;
  frontmatter: PostFrontMatter;
}