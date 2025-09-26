import matter from "gray-matter";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface PostData {
  id: string;
  label: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
}

interface HierarchyNode {
  name: string;
  type: "root" | "category" | "tag" | "post";
  children?: HierarchyNode[];
  postData?: PostData;
}

interface PostFrontMatter {
  title?: string;
  date?: string;
  tags?: string[];
}

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
  const postsDirectory = join(process.cwd(), "src/_posts");

  if (!existsSync(postsDirectory)) {
    return [];
  }

  try {
    const filenames = readdirSync(postsDirectory);
    const posts: HierarchyNode[] = [];

    filenames
      .filter((name) => name.endsWith(".md"))
      .forEach((filename) => {
        const fullPath = join(postsDirectory, filename);
        const fileContents = readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents) as any as {
          data: PostFrontMatter;
        };

        const slug = filename.replace(/\.md$/, "");
        const postUrl = `/posts/${slug}`;
        const nodeId = `post-${slug}`;

        const postData: PostData = {
          id: nodeId,
          label: data.title || filename,
          description: `Blog post published ${
            data.date
              ? new Date(data.date).toLocaleDateString()
              : "date unknown"
          }`,
          category: "Blog Post",
          url: postUrl,
          tags: data.tags || [],
        };

        posts.push({
          name: data.title || filename,
          type: "post",
          postData,
        });
      });

    return posts;
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

function generateHierarchyWithPosts(): HierarchyNode[] {
  // Load base hierarchy configuration
  const baseHierarchy = loadBaseHierarchyConfig();
  const posts = generateBaseHierarchyDataWithPosts();

  // Collect all unique tags from posts
  const allTags = new Set<string>();
  posts.forEach((post) => {
    if (post.postData?.tags) {
      post.postData.tags.forEach((tag) => allTags.add(tag.toLowerCase()));
    }
  });

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
      Array.from(allTags).forEach((tag) => {
        if (!existingTags.has(tag)) {
          blogPostCategory.children!.push({
            name: tag,
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