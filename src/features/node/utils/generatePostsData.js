const matter = require('gray-matter');
const { readFileSync, readdirSync, existsSync, writeFileSync } = require('fs');
const { join } = require('path');

function generatePostsData() {
  const postsDirectory = join(process.cwd(), 'src/_posts');
  
  if (!existsSync(postsDirectory)) {
    return [];
  }

  try {
    const filenames = readdirSync(postsDirectory);
    const posts = [];

    filenames
      .filter(name => name.endsWith('.md'))
      .forEach((filename, index) => {
        const fullPath = join(postsDirectory, filename);
        const fileContents = readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        
        const slug = filename.replace(/\.md$/, '');
        const postUrl = `/posts/${slug}`;
        
        // Create a unique ID and position for each post
        const nodeId = `post-${slug}`;
        
        // Calculate position in a circle layout
        const angle = (index * 2 * Math.PI) / filenames.length;
        const radius = 300;
        const centerX = 400;
        const centerY = 400;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        posts.push({
          id: nodeId,
          position: { x, y },
          data: {
            label: data.title || filename,
            description: `Blog post published ${data.date ? new Date(data.date).toLocaleDateString() : 'date unknown'}`,
            category: 'Blog Post',
            url: postUrl,
            date: data.date,
            tags: data.tags || []
          },
          type: 'default'
        });
      });

    return posts;
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

function generatePostEdges(postNodes) {
  const edges = [];
  
  // Create edges between posts that share tags
  for (let i = 0; i < postNodes.length; i++) {
    for (let j = i + 1; j < postNodes.length; j++) {
      const node1 = postNodes[i];
      const node2 = postNodes[j];
      
      const tags1 = node1.data.tags || [];
      const tags2 = node2.data.tags || [];
      
      // Check if posts share any tags
      const sharedTags = tags1.filter(tag => tags2.includes(tag));
      
      if (sharedTags.length > 0) {
        edges.push({
          id: `edge-${node1.id}-${node2.id}`,
          source: node1.id,
          target: node2.id,
          data: {
            relationship: `shared tags: ${sharedTags.join(', ')}`
          },
          type: 'default',
          style: { stroke: '#888' }
        });
      }
    }
  }
  
  return edges;
}

// Generate and write the data to a JSON file
const posts = generatePostsData();
const edges = generatePostEdges(posts);

const data = {
  nodes: posts,
  edges: edges
};

writeFileSync(
  join(process.cwd(), 'src/features/node/data/postsData.json'),
  JSON.stringify(data, null, 2)
);

console.log(`Generated ${posts.length} post nodes and ${edges.length} edges`);