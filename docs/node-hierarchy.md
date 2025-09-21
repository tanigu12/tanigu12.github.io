# Node Hierarchy Documentation

This document outlines the hierarchical structure and relationships between different node types in the Tech Knowledge Map application.

## Overview

The knowledge map uses a hierarchical structure to organize information with the following levels:
- **Root Categories** → **Categories** → **Tags** → **Individual Nodes**

## Node Structure

### KnowledgeNode Interface
```typescript
interface KnowledgeNode extends Node {
  data: {
    label: string;           // Display name
    description?: string;    // Optional description
    category?: string;       // Parent category
    url?: string;           // Optional link
    date?: string;          // Creation/publication date
    tags?: string[];        // Associated tags
    isExpanded?: boolean;   // UI state for expandable nodes
    hasChildren?: boolean;  // Whether node has child nodes
    parentId?: string;      // Parent node ID for hierarchy
    level?: number;         // Depth level in hierarchy
  };
}
```

## Hierarchy Levels

### 1. Root Categories (Level 0)
The top-level organizational categories that serve as the foundation of the knowledge map.

**Current Root Categories:**
- `Technology` - Technical knowledge and skills
- `Personal` - Personal experiences and reflections

### 2. Categories (Level 1)
Sub-categories that organize content within root categories.

**Technology Subcategories:**
- `Frontend` - Client-side development
- `Backend` - Server-side development  
- `Language` - Programming/human languages
- `Tools` - Development tools and utilities

**Personal Subcategories:**
- Currently empty (flat structure)

### 3. Tags (Level 2)
Specific topic tags that group related content within categories.

**Frontend Tags:**
- `react` - React.js library
- `typescript` - TypeScript language
- `javascript` - JavaScript language
- `css` - Cascading Style Sheets

**Backend Tags:**
- `node` - Node.js runtime
- `api` - API development
- `database` - Database technologies

**Language Tags:**
- `english` - English language learning
- `learning` - Learning methodologies
- `language` - Language acquisition

### 4. Individual Nodes (Level 3+)
Specific knowledge items, articles, or concepts that belong to the tag groupings.

## Relationships

### Node Relationships
- **Parent-Child**: Nodes can have `parentId` to establish hierarchical relationships
- **Category Association**: Nodes belong to categories via the `category` field
- **Tag Association**: Nodes can have multiple tags via the `tags` array
- **Level Depth**: The `level` field indicates hierarchy depth (0 = root, 1 = category, etc.)

### Edge Relationships
Edges connect nodes and can have relationship types:
```typescript
interface KnowledgeEdge extends Edge {
  data?: {
    relationship?: string; // Type of relationship (e.g., "uses", "extends", "contains")
  };
}
```

## Expansion and Navigation

### Expandable Nodes
- Nodes with children use `hasChildren: true`
- Expansion state tracked with `isExpanded: boolean`
- UI can show/hide child nodes based on expansion state

### Hierarchy Navigation
- Users can navigate up/down the hierarchy
- Level-based filtering and grouping
- Category-based organization and filtering

## Configuration

The hierarchy structure is defined in `src/features/node/data/hierarchy.ts`:

```typescript
interface HierarchyConfig {
  rootCategories: string[];                    // Top-level categories
  categoryHierarchy: Record<string, string[]>; // Category → subcategories mapping
  tagHierarchy: Record<string, string[]>;      // Category → tags mapping
}
```

## Usage Examples

### Creating Hierarchical Nodes
```typescript
// Root category node
const rootNode = createKnowledgeNode(
  'tech-root',
  'Technology',
  { x: 0, y: 0 },
  'Technical knowledge and skills',
  undefined, // no parent category
  undefined, // no URL
  undefined, // no date
  undefined, // no tags
  false,     // not expanded
  true,      // has children
  undefined, // no parent
  0          // root level
);

// Category node
const frontendNode = createKnowledgeNode(
  'frontend',
  'Frontend',
  { x: 100, y: 100 },
  'Client-side development',
  'Technology',
  undefined,
  undefined,
  ['frontend'],
  false,
  true,
  'tech-root',
  1
);

// Individual content node
const reactNode = createKnowledgeNode(
  'react-basics',
  'React Fundamentals',
  { x: 200, y: 200 },
  'Core React concepts and patterns',
  'Frontend',
  '/posts/react-fundamentals',
  '2024-01-01',
  ['react', 'typescript', 'frontend'],
  false,
  false,
  'frontend',
  2
);
```

This hierarchical structure provides a scalable way to organize and navigate technical knowledge while maintaining clear relationships between different levels of information.