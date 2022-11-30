import React, { useCallback, useState, useRef } from "react";
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useReactFlow,
    MarkerType,
    useEdgesState,
    useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";
import './index.css';
import { edges as initialEdges } from "./componentes/Edges";
import FloatingEdge from "./componentes/Edges"
import { nodes as initialNodes } from "./componentes/initial-nodes";
import TextUpdaterNode from "./componentes/Node-Text";
import Moveable from "react-moveable";
import moveAble from "./componentes/Moveable";



const getNodeId = () => `randomnode_${+new Date()}`;


const nodeTypes = { textUpdater: TextUpdaterNode, custom: moveAble };
const edgeTypes = { floating: FloatingEdge };
let id = 6;
const getId = () => `${id++}`;
const flowKey = `example-flow${id}`;
const fitViewOptions = {
    padding: 3,
};
const defaultEdgeOptions = {
    type: 'floating',
    markerEnd: {
        type: MarkerType.ArrowClosed,
    },
};
function Flow() {
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState([nodes.id]);
    
    const { setViewport, project } = useReactFlow();
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );
    const onSave = useCallback(() => {
        if (rfInstance) {
          const flow = rfInstance.toObject();
          localStorage.setItem([flowKey], JSON.stringify(flow));
        }
      }, [rfInstance]);

      const onRestore = useCallback(() => {
        const restoreFlow = async () => {
          const flow = JSON.parse(localStorage.getItem([flowKey]));
    
          if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
          }
        };
    
        restoreFlow();
      }, [setNodes, setViewport,setEdges]);
    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);
    const onConnectEnd = useCallback(
        (event) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                const id = getId();
                const newNode = {
                    id,
                    // we are removing the half of the node width (75) to center the new node
                    position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
                    type: 'textUpdater',
                    data: { label: `Node ${id}` },
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) => eds.concat({
                    id, source: connectingNodeId.current, target: id, markerEnd: {
                        type: MarkerType.ArrowClosed
                    }
                }));
            }
        },
        [setNodes, setEdges,project]
    );
    return (
        <div className="wrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                fitViewOptions={fitViewOptions}
                attributionPosition="top-right"
            >
                
                 <div className="save__controls">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
      </div>
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background;
                        if (n.type === "textUpdater") return "#0041d0";
                        if (n.type === "output") return "#ff0072";
                        if (n.type === "default") return "#1a192b";

                        return "#eee";
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background) return n.style.background;

                        return "#fff";
                    }}
                    style={{ backgroundColor: "darkgray" }}
                    nodeBorderRadius={3}
                />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default Flow;
