import { MarkerType } from "reactflow";
import { useCallback } from 'react';
import { useStore, getStraightPath } from 'reactflow';
import { getEdgeParams } from '../Utils';

export const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }
  },
  {
    id: "",
    source: "1",
    target: "3",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }

  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }
  },

];

function FloatingEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}

export default FloatingEdge;