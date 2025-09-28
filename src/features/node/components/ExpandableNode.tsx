'use client';

import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { useRouter } from 'next/navigation';
import { KnowledgeNode, ExpansionState } from '@/features/node/types';

interface ExpandableNodeProps extends NodeProps {
  data: KnowledgeNode['data'];
}

// Global reference to toggle function - we'll set this from the main component
let globalToggleExpand: ((nodeId: string) => void) | null = null;

export function setGlobalToggleExpand(fn: (nodeId: string) => void) {
  globalToggleExpand = fn;
}

export function ExpandableNode({ 
  id, 
  data
}: ExpandableNodeProps) {
  const router = useRouter();

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.url) {
      router.push(data.url);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (globalToggleExpand) {
      globalToggleExpand(id);
    }
  };

  const getNodeStyle = () => {
    const baseStyle = "px-4 py-2 shadow-md rounded-lg border text-center cursor-pointer transition-all duration-200";
    
    switch (data.category) {
      case 'Blog Post':
        return `${baseStyle} bg-blue-100 border-blue-300 hover:bg-blue-200`;
      case 'Frontend':
        return `${baseStyle} bg-green-100 border-green-300 hover:bg-green-200`;
      case 'Language':
        return `${baseStyle} bg-purple-100 border-purple-300 hover:bg-purple-200`;
      default:
        return `${baseStyle} bg-gray-100 border-gray-300 hover:bg-gray-200`;
    }
  };

  const getLevelIndent = () => {
    const level = data.level || 0;
    return level > 0 ? `ml-${level * 4}` : '';
  };

  return (
    <div className={`${getLevelIndent()} relative`}>
      {/* Input handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 bg-gray-400" 
      />
      
      <div 
        className={getNodeStyle()}
        onClick={handleNodeClick}
      >
        <div className="flex items-center justify-between">
          {/* Expand/Collapse button */}
          {data.hasChildren && (
            <button
              onClick={handleToggleClick}
              className="flex-shrink-0 w-4 h-4 mr-2 text-xs font-bold text-gray-600 hover:text-gray-800"
            >
              {data.isExpanded === ExpansionState.Expanded ? '−' : 
               data.isExpanded === ExpansionState.Partial ? '±' : 
               '+'}
            </button>
          )}
          
          {/* Node content */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {data.label}
            </div>
            {data.description && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {data.description}
              </div>
            )}
            {data.datetime && (
              <div className="text-xs text-gray-400 mt-1">
                {new Date(data.datetime).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Category badge */}
          {data.category && (
            <div className="flex-shrink-0 ml-2">
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                {data.category}
              </span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-1 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{data.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 bg-gray-400" 
      />
    </div>
  );
}