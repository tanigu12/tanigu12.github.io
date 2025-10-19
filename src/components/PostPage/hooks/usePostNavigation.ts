import { join } from "path";
import { readFileSync } from "fs";
import matter from "gray-matter";

interface PostNavigationData {
  nextSlug: string | null;
  nextTitle: string | null;
  previousSlug: string | null;
  previousTitle: string | null;
}

function getPostTitle(slug: string): string | null {
  try {
    const postsDirectory = join(process.cwd(), "src/_posts");
    const fullPath = join(postsDirectory, `${slug}.md`);
    const fileContents = readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return data.title || null;
  } catch {
    return null;
  }
}

export function getPostNavigation(currentSlug: string): PostNavigationData {
  const postsDirectory = join(process.cwd(), "src/_posts");
  const { readdirSync } = require("fs");

  try {
    const filenames = readdirSync(postsDirectory);
    const slugs = filenames
      .filter((name: string) => name.endsWith(".md"))
      .map((name: string) => name.replace(/\.md$/, ""))
      .sort(); // Sort chronologically by filename (assuming YYYY-MM-DD prefix)

    const currentIndex = slugs.indexOf(currentSlug);

    if (currentIndex === -1) {
      return { nextSlug: null, nextTitle: null, previousSlug: null, previousTitle: null };
    }

    const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;
    const previousSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;

    return {
      nextSlug,
      nextTitle: nextSlug ? getPostTitle(nextSlug) : null,
      previousSlug,
      previousTitle: previousSlug ? getPostTitle(previousSlug) : null,
    };
  } catch {
    return { nextSlug: null, nextTitle: null, previousSlug: null, previousTitle: null };
  }
}
