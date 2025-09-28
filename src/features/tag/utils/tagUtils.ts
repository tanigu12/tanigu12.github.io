import { getAllPosts } from "@/features/post/utils/postUtils";
import { Tag, TaggedPost, TagWithPosts, TagCloudData } from "../types";

/**
 * Generates a URL-friendly slug from a tag name
 */
function generateTagSlug(tagName: string): string {
  return tagName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gets all posts with tag information (converts from Post to TaggedPost)
 */
export function getAllPostsWithTags(): TaggedPost[] {
  const posts = getAllPosts();
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    categories: post.categories,
  }));
}

/**
 * Extracts all unique tags from posts and generates tag metadata
 */
export function extractAllTags(posts: TaggedPost[]): Tag[] {
  const tagCountMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase().trim();
      if (normalizedTag) {
        tagCountMap.set(normalizedTag, (tagCountMap.get(normalizedTag) || 0) + 1);
      }
    });
  });

  return Array.from(tagCountMap.entries())
    .map(([tagName, count]) => ({
      id: generateTagSlug(tagName),
      name: tagName,
      slug: generateTagSlug(tagName),
      postCount: count,
    }))
    .sort((a, b) => b.postCount - a.postCount);
}

// Unused functions removed by knip - can be added back when needed