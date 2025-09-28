/**
 * IMPORTANT: This file is executed during the build process!
 * 
 * This script generates the hierarchy data with posts that is used by the knowledge map.
 * It's run as part of the build process (see package.json build script) to:
 * 1. Read all blog posts from src/_posts/
 * 2. Extract tags and create a hierarchical structure
 * 3. Generate the baseHierarchyDataWithPosts.json file
 * 
 * DO NOT REMOVE this file or its entry in knip.json - it's essential for the build!
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { getAllPosts } from "@/features/post/utils/postUtils";
import { extractAllTags, getAllPostsWithTags } from "@/features/tag/utils/tagUtils";
import { HierarchyNode, PostData } from "../types";

function loadBaseHierarchyConfig(): HierarchyNode[] {
  try {
    const configPath = join(
      process.cwd(),
      "src/features/hierarchy/config/hierarchyConfig.json"
    );
    const configContent = readFileSync(configPath, "utf8");
    return JSON.parse(configContent) as HierarchyNode[];
  } catch (error) {
    console.error("Error loading base hierarchy config:", error);
    return [];
  }
}

function generateBaseHierarchyDataWithPosts(): HierarchyNode[] {
  try {
    const allPosts = getAllPosts();
    const posts: HierarchyNode[] = [];

    allPosts.forEach((post) => {
      const nodeId = `post-${post.slug}`;
      const postUrl = `/posts/${post.slug}`;

      const postData: PostData = {
        id: nodeId,
        label: post.title,
        description: `Blog post published ${
          post.date ? new Date(post.date).toLocaleDateString() : "date unknown"
        }`,
        category: post.categories?.[0] || "Blog Post",
        url: postUrl,
        tags: post.tags,
      };

      posts.push({
        name: post.title,
        type: "post",
        postData,
      });
    });

    return posts;
  } catch (error) {
    console.error("Error generating post hierarchy data:", error);
    return [];
  }
}

function generateHierarchyWithPosts(): HierarchyNode[] {
  // Load base hierarchy configuration
  const baseHierarchy = loadBaseHierarchyConfig();
  const posts = generateBaseHierarchyDataWithPosts();

  // Get all unique tags using the tag management system
  const allTags = extractAllTags(getAllPostsWithTags());

  // Deep clone the base hierarchy to avoid modifying the original
  const hierarchy: HierarchyNode[] = JSON.parse(JSON.stringify(baseHierarchy));

  // Find the Personal root and add dynamic content
  const personalRoot = hierarchy.find((root) => root.name === "Personal");
  if (personalRoot && personalRoot.children) {
    // Find the Blog Post category and add dynamic tags
    const blogPostCategory = personalRoot.children.find(
      (child) => child.name === "Blog Post"
    );
    if (blogPostCategory && blogPostCategory.children) {
      // Add dynamic tags found in posts (avoiding duplicates)
      const existingTags = new Set(
        blogPostCategory.children.map((tag) => tag.name.toLowerCase())
      );

      allTags.forEach((tag) => {
        if (!existingTags.has(tag.name.toLowerCase())) {
          blogPostCategory.children!.push({
            name: tag.name,
            type: "tag",
          });
        }
      });
    }

    // Add all blog posts under Personal root
    personalRoot.children.push(...posts);
  }

  return hierarchy;
}

// Generate and write the hierarchy data to a JSON file
const hierarchyData = generateHierarchyWithPosts();
const posts = generateBaseHierarchyDataWithPosts();

writeFileSync(
  join(
    process.cwd(),
    "src/features/hierarchy/data/baseHierarchyDataWithPosts.json"
  ),
  JSON.stringify(hierarchyData, null, 2)
);

console.log(`Generated ${posts.length} post nodes and 0 edges`);
