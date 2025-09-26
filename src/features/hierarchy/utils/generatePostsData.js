const matter = require("gray-matter");
const { readFileSync, readdirSync, existsSync, writeFileSync } = require("fs");
const { join } = require("path");

function generatePostsData() {
  const postsDirectory = join(process.cwd(), "src/_posts");

  if (!existsSync(postsDirectory)) {
    return [];
  }

  try {
    const filenames = readdirSync(postsDirectory);
    const posts = [];

    filenames
      .filter((name) => name.endsWith(".md"))
      .forEach((filename) => {
        const fullPath = join(postsDirectory, filename);
        const fileContents = readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        const slug = filename.replace(/\.md$/, "");
        const postUrl = `/posts/${slug}`;
        const nodeId = `post-${slug}`;

        posts.push({
          name: data.title || filename,
          type: "post",
          postData: {
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
          },
        });
      });

    return posts;
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

function generateHierarchyWithPosts() {
  const posts = generatePostsData();
  
  // Collect all unique tags from posts
  const allTags = new Set();
  posts.forEach(post => {
    if (post.postData.tags) {
      post.postData.tags.forEach(tag => allTags.add(tag.toLowerCase()));
    }
  });

  // Create base hierarchy structure
  const hierarchy = [
    {
      name: "Personal",
      type: "root",
      children: [
        {
          name: "Blog Post",
          type: "category",
          children: [
            // Add tag nodes for tags found in posts
            ...Array.from(allTags).map(tag => ({
              name: tag,
              type: "tag",
            })),
          ],
        },
        // Add all blog posts under Personal root
        ...posts,
      ],
    },
    {
      name: "Technology",
      type: "root",
      children: [
        {
          name: "Frontend",
          type: "category",
          children: [
            {
              name: "react",
              type: "tag",
            },
            {
              name: "typescript",
              type: "tag",
            },
            {
              name: "javascript",
              type: "tag",
            },
            {
              name: "css",
              type: "tag",
            },
          ],
        },
      ],
    },
  ];

  return hierarchy;
}

// Generate and write the hierarchy data to a JSON file
const hierarchyData = generateHierarchyWithPosts();
const posts = generatePostsData();

writeFileSync(
  join(process.cwd(), "src/features/hierarchy/data/postsData.json"),
  JSON.stringify(hierarchyData, null, 2)
);

console.log(`Generated ${posts.length} post nodes and 0 edges`);
