import { notFound } from "next/navigation";
import matter from "gray-matter";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export interface PostData {
  title: string;
  date?: string;
  categories?: string[];
  tags?: string[];
  description?: string;
  excerpt?: string;
}


interface PostContent {
  frontmatter: PostData;
  content: string;
}

export function getPostData(slug: string): PostContent {
  const postsDirectory = join(process.cwd(), "src/_posts");
  const fullPath = join(postsDirectory, `${slug}.md`);

  if (!existsSync(fullPath)) {
    notFound();
  }

  const fileContents = readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostData;

  return {
    frontmatter,
    content,
  };
}