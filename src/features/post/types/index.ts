export interface PostFrontMatter {
  title?: string;
  date?: string;
  categories?: string[];
  tags?: string[];
  description?: string;
  excerpt?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  categories?: string[];
  description?: string;
  excerpt?: string;
}

export interface PostWithContent extends Post {
  content: string;
  frontmatter: PostFrontMatter;
}