import React, { useEffect, useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../services/api';

const GraphView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await api.get('/graph');
        // Map backend objects to ReactFlow definitions
        const initialNodes = res.data.nodes || [];
        const initialEdges = (res.data.edges || []).map(edge => ({
          ...edge,
          style: { stroke: '#000', strokeWidth: 2 },
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#000',
          },
        }));

        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (error) {
        console.error("Failed to load graph", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [setNodes, setEdges]);

  // Handle manual linking visually on the graph if requested
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ 
    ...params, 
    animated: true,
    style: { stroke: '#000', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }
  }, eds)), [setEdges]);

  if (loading) return <div className="p-8 font-bold text-xl uppercase">Loading connections...</div>;

  return (
    <div className="h-[80vh] w-full border-brutal-lg shadow-brutal bg-white overflow-hidden relative">
      <h2 className="absolute top-4 right-4 z-10 text-xl font-black bg-neo-yellow border-brutal px-4 py-2 text-neo-black shadow-brutal-sm">
        Knowledge Map
      </h2>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-neo-white"
      >
        <Background gap={24} color="#000" variant="dots" />
        <Controls className="border-brutal shadow-brutal-sm bg-white" />
        <MiniMap className="border-brutal shadow-brutal-sm" nodeColor="#ffde59" maskColor="rgba(0,0,0,0.1)" />
      </ReactFlow>
    </div>
  );
};

export default GraphView;
