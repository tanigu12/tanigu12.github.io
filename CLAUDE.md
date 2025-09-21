# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 TypeScript project configured as a **static site** for building an interactive tech knowledge map using React Flow. The project is organized using a **feature-based architecture** to manage complexity and maintain clean separation of concerns.

## Key Configuration

- **Static Export**: Configured with `output: 'export'` in `next.config.ts` for static site generation
- **Turbopack**: Uses Next.js Turbopack for faster builds (`--turbopack` flag)
- **React Flow**: Uses `@xyflow/react` v12.8.5 for interactive flowcharts and network diagrams
- **TypeScript**: Fully typed with strict configuration
- **Tailwind CSS**: v4 for styling

## Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run preview      # Serve static build locally using 'serve'
```

### Quality Assurance
```bash
npm run check:all    # Run full quality check: lint + type-check + test + build
npm run lint         # ESLint with auto-fix on src/ directory
npm run type-check   # TypeScript type checking without emit
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
npm run knip         # Unused code detection
```

### Build & Deploy
```bash
npm run build        # Production build with static export (outputs to /out)
npm run export       # Alias for build command
npm run start        # Start production server (use preview for static)
```

## Architecture

### Feature-Based Structure
The project follows a feature-based architecture in `/src/features/`:

- **`/src/features/node/`** - Core knowledge mapping functionality
  - `components/` - React components (KnowledgeFlowChart)
  - `hooks/` - Custom hooks (useKnowledgeFlow)
  - `types/` - TypeScript interfaces (KnowledgeNode, KnowledgeEdge)
  - `utils/` - Utilities and data (nodeData.ts)

### Key Types
- `KnowledgeNode` - Extends React Flow Node with label, description, category
- `KnowledgeEdge` - Extends React Flow Edge with relationship data

### Import Conventions
- **DO NOT** create barrel export files (`index.ts`) in features
- Import directly from specific files: `@/features/node/components/KnowledgeFlowChart`
- Use full paths to maintain explicit dependencies and avoid circular imports
- TypeScript path mapping configured in `tsconfig.json`

### Static Export Considerations
- Images must use `unoptimized: true` configuration
- No server-side features (getServerSideProps, API routes)
- Output directory is `/out/` for deployment

## Testing

- **Framework**: Vitest with jsdom environment
- **Location**: Tests co-located with features (e.g., `KnowledgeFlowChart.test.tsx`)
- **Globals**: Enabled in `vitest.config.ts`
- Keep tests simple and focused on core functionality

## Quality Tools

- **ESLint**: v9 with Next.js core-web-vitals config
- **Knip**: Configured to detect unused code in `src/` directory
- **TypeScript**: Strict mode enabled with comprehensive type checking