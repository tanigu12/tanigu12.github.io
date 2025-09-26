"use client";

import { useCallback, useEffect } from "react";
import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { KnowledgeNode, KnowledgeEdge } from "../types";
import {
  nodesAtom,
  edgesAtom,
  selectedNodeIdAtom,
  nodesWithDynamicExpansionAtom,
  visibleNodesAtom,
  selectNodeAtom,
  toggleNodeExpansionAtom,
  initializeNodesAndEdgesAtom,
} from "../store/atoms";

export function useKnowledgeFlow(
  initialNodes: KnowledgeNode[],
  initialEdges: KnowledgeEdge[]
) {
  const [, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const nodes = useAtomValue(nodesWithDynamicExpansionAtom); // Use nodes with dynamic expansion
  const selectedNodeId = useAtomValue(selectedNodeIdAtom);
  const visibleNodes = useAtomValue(visibleNodesAtom);
  const selectNode = useSetAtom(selectNodeAtom);
  const toggleExpansion = useSetAtom(toggleNodeExpansionAtom);
  const initializeNodesAndEdges = useSetAtom(initializeNodesAndEdgesAtom);

  // React Flow state for UI interactions
  const [, , onNodesChange] = useNodesState(nodes);
  const [, , onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Parameters<typeof addEdge>[0]) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onToggleExpand = useCallback(
    (nodeId: string) => {
      toggleExpansion(nodeId);
    },
    [toggleExpansion]
  );

  const findNearestNode = useCallback(
    (currentNodeId: string, direction: "up" | "down" | "left" | "right") => {
      const currentNode = nodes.find((n) => n.id === currentNodeId);
      if (!currentNode) return null;

      const currentPos = currentNode.position;

      let candidates: KnowledgeNode[] = [];

      switch (direction) {
        case "up":
          candidates = visibleNodes.filter((n) => n.position.y < currentPos.y);
          candidates.sort((a, b) => b.position.y - a.position.y);
          break;
        case "down":
          candidates = visibleNodes.filter((n) => n.position.y > currentPos.y);
          candidates.sort((a, b) => a.position.y - b.position.y);
          break;
        case "left":
          candidates = visibleNodes.filter((n) => n.position.x < currentPos.x);
          candidates.sort((a, b) => b.position.x - a.position.x);
          break;
        case "right":
          candidates = visibleNodes.filter((n) => n.position.x > currentPos.x);
          candidates.sort((a, b) => a.position.x - b.position.x);
          break;
      }

      return candidates.length > 0 ? candidates[0] : null;
    },
    [nodes, visibleNodes]
  );

  const handleArrowKey = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!selectedNodeId) {
        // Select first visible node if none selected
        const firstVisibleNode = visibleNodes[0];
        if (firstVisibleNode) {
          selectNode(firstVisibleNode.id);
        }
        return;
      }

      const nearestNode = findNearestNode(selectedNodeId, direction);
      if (nearestNode) {
        selectNode(nearestNode.id);
      }
    },
    [selectedNodeId, visibleNodes, findNearestNode, selectNode]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          handleArrowKey("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          handleArrowKey("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          handleArrowKey("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          handleArrowKey("right");
          break;
        case "Enter":
        case " ":
          if (selectedNodeId) {
            event.preventDefault();
            onToggleExpand(selectedNodeId);
          }
          break;
      }
    },
    [handleArrowKey, selectedNodeId, onToggleExpand]
  );

  // Initialize nodes and edges on mount only
  useEffect(() => {
    initializeNodesAndEdges({ nodes: initialNodes, edges: initialEdges });
  }, [initialNodes, initialEdges, initializeNodesAndEdges]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
    handleArrowKey,
  };
}
