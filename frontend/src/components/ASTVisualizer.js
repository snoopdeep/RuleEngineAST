import React, { useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const ASTVisualizer = ({ ast }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!ast) return;

    const newNodes = [];
    const newEdges = [];
    let nodeId = 0;

    const getNodeLabel = (node) => {
      if (node.operator) return node.operator;
      if (node.value !== undefined) return String(node.value);
      return "Node";
    };

    const calculateNodePositions = (
      node,
      level = 0,
      position = 0,
      positions = {}
    ) => {
      const currentId = nodeId++;
      const xSpacing = 100;
      const ySpacing = 100;

      positions[currentId] = {
        x: position * xSpacing,
        y: level * ySpacing,
      };

      let childCount = 0;
      if (node.left) {
        childCount += calculateNodePositions(
          node.left,
          level + 1,
          position - 1,
          positions
        );
      }
      if (node.right) {
        childCount += calculateNodePositions(
          node.right,
          level + 1,
          position + 1,
          positions
        );
      }

      return childCount + 1;
    };

    const traverseTree = (node, parentId = null, positions, currentId = 0) => {
      if (!node) return currentId;

      const id = currentId;
      const label = getNodeLabel(node);
      const position = positions[id];

      newNodes.push({
        id: id.toString(),
        data: { label },
        position,
        className: "bg-white rounded-md border-2 border-gray-300 p-2",
        style: { width: 80, textAlign: "center" },
      });

      if (parentId !== null) {
        newEdges.push({
          id: `e${parentId}-${id}`,
          source: parentId.toString(),
          target: id.toString(),
          type: "smoothstep",
          animated: false,
          style: { stroke: "#999" },
        });
      }

      let nextId = currentId + 1;

      if (node.left) {
        nextId = traverseTree(node.left, id, positions, nextId);
      }
      if (node.right) {
        nextId = traverseTree(node.right, id, positions, nextId);
      }

      return nextId;
    };

    const positions = {};
    calculateNodePositions(ast, 0, 0, positions);
    traverseTree(ast, null, positions);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [ast]);

  return (
    <div
      style={{ width: "100%", height: "500px" }}
      className="border rounded-lg"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ASTVisualizer;
