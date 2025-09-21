'use client';

import { useCallback, useState, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { KnowledgeNode, KnowledgeEdge } from '../types';
import { toggleNodeExpansion, createHierarchicalEdges } from '../utils/hierarchyUtils';

export function useKnowledgeFlow(
  initialNodes: KnowledgeNode[], 
  initialEdges: KnowledgeEdge[]
) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Parameters<typeof addEdge>[0]) => 
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onToggleExpand = useCallback((nodeId: string) => {
    setNodes((currentNodes) => {
      const updatedNodes = toggleNodeExpansion(currentNodes, nodeId);
      // Regenerate edges based on updated node visibility
      const updatedEdges = createHierarchicalEdges(updatedNodes);
      setEdges(updatedEdges);
      return updatedNodes;
    });
  }, [setNodes, setEdges]);

  const findNearestNode = useCallback((currentNodeId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return null;

    const visibleNodes = nodes.filter(n => n.hidden !== true);
    const currentPos = currentNode.position;
    
    let candidates: KnowledgeNode[] = [];
    
    switch (direction) {
      case 'up':
        candidates = visibleNodes.filter(n => n.position.y < currentPos.y);
        candidates.sort((a, b) => b.position.y - a.position.y);
        break;
      case 'down':
        candidates = visibleNodes.filter(n => n.position.y > currentPos.y);
        candidates.sort((a, b) => a.position.y - b.position.y);
        break;
      case 'left':
        candidates = visibleNodes.filter(n => n.position.x < currentPos.x);
        candidates.sort((a, b) => b.position.x - a.position.x);
        break;
      case 'right':
        candidates = visibleNodes.filter(n => n.position.x > currentPos.x);
        candidates.sort((a, b) => a.position.x - b.position.x);
        break;
    }
    
    return candidates.length > 0 ? candidates[0] : null;
  }, [nodes]);

  const selectNode = useCallback((nodeId: string | null) => {
    setNodes((currentNodes) => 
      currentNodes.map((node) => ({
        ...node,
        selected: node.id === nodeId
      }))
    );
    setSelectedNodeId(nodeId);
  }, [setNodes]);

  const handleArrowKey = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedNodeId) {
      // Select first visible node if none selected
      const firstVisibleNode = nodes.find(n => n.hidden !== true);
      if (firstVisibleNode) {
        selectNode(firstVisibleNode.id);
      }
      return;
    }

    const nearestNode = findNearestNode(selectedNodeId, direction);
    if (nearestNode) {
      selectNode(nearestNode.id);
    }
  }, [selectedNodeId, nodes, findNearestNode, selectNode]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        handleArrowKey('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleArrowKey('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handleArrowKey('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleArrowKey('right');
        break;
      case 'Enter':
      case ' ':
        if (selectedNodeId) {
          event.preventDefault();
          onToggleExpand(selectedNodeId);
        }
        break;
    }
  }, [handleArrowKey, selectedNodeId, onToggleExpand]);

  // Initialize edges on mount only
  useEffect(() => {
    const updatedEdges = createHierarchicalEdges(initialNodes);
    setEdges(updatedEdges);
  }, [initialNodes, setEdges]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onToggleExpand,
    selectedNodeId,
    selectNode,
    handleArrowKey
  };
}