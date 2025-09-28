import matter from "gray-matter";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { Post, PostFrontMatter, PostWithContent } from "../types";

/**
 * Loads all posts and extracts their metadata
 */
export function getAllPosts(): Post[] {
  const postsDirectory = join(process.cwd(), "src/_posts");

  if (!existsSync(postsDirectory)) {
    return [];
  }

  try {
    const filenames = readdirSync(postsDirectory);
    const posts: Post[] = [];

    filenames
      .filter((name) => name.endsWith(".md"))
      .forEach((filename) => {
        const fullPath = join(postsDirectory, filename);
        const fileContents = readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents) as { data: PostFrontMatter };

        const slug = filename.replace(/\.md$/, "");

        posts.push({
          id: slug,
          title: data.title || filename,
          slug,
          datetime: data.datetime || "",
          tags: data.tags || [],
          categories: data.categories || [],
          description: data.description,
          excerpt: data.excerpt,
        });
      });

    return posts.sort((a, b) => {
      if (a.datetime && b.datetime) {
        return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
      }
      return 0;
    });
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

// Unused functions removed by knip - can be added back when needed