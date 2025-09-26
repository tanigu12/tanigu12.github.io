import { join } from "path";

export async function getPostStaticParams() {
  const postsDirectory = join(process.cwd(), "src/_posts");
  const { readdirSync } = await import("fs");

  try {
    const filenames = readdirSync(postsDirectory);
    return filenames
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        slug: name.replace(/\.md$/, ""),
      }));
  } catch {
    return [];
  }
}