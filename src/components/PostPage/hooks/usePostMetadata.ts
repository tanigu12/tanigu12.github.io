import { Metadata } from "next";
import matter from "gray-matter";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { PostData } from "./usePostData";

export function getPostMetadata(slug: string): Metadata {
  const postsDirectory = join(process.cwd(), "src/_posts");
  const fullPath = join(postsDirectory, `${slug}.md`);

  if (!existsSync(fullPath)) {
    return {
      title: "Post Not Found",
    };
  }

  const fileContents = readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostData;

  const description =
    frontmatter.description ||
    content.slice(0, 160) + "...";
  const title = frontmatter.title;
  const publishedTime = frontmatter.datetime;
  const keywords = [
    ...frontmatter.categories,
    ...(frontmatter.tags || []),
    "blog",
    "tech",
    "programming",
  ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Takaaki Taniguchi" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      authors: ["Takaaki Taniguchi"],
      url: `https://tanigu12.github.io/posts/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/posts/${slug}`,
    },
  };
}