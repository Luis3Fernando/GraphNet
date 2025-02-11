"use client";
import * as motion from "motion/react-client";
import React, { useRef, useState, useEffect } from "react";
import LineTo from "react-lineto";
import { Toaster } from "react-hot-toast";
import { useAlgorithm } from "../context/Context";
import { Node, Arco } from "../models/types";
import { kruskal } from "../logic/maths/kruskal";
import { useNavigate } from "react-router-dom";

function Process() {
  const navigate = useNavigate();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [lines, setLines] = useState<Arco[]>([]);
  const { nodesC, linesC, matrix } = useAlgorithm();

  useEffect(() => {
    initializeGraph();
  }, [nodesC, linesC]);

  const initializeGraph = () => {
    const initializedNodes = nodesC.map((node: any) => ({
      ...node,
      x: node.x,
      y: node.y,
    }));
    setNodes(initializedNodes);

    setTimeout(() => {
      setLines(linesC);
    }, 50);
  };

  const handleSolution = () => {
    const result = kruskal(nodes.length, matrix);

    const newEdges: Arco[] = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (result[i][j] > 0) {
          newEdges.push({
            id: newEdges.length + 1,
            weight: result[i][j],
            from: nodes[i],
            to: nodes[j],
          });
        }
      }
    }

    setLines(newEdges);
  };

  const handleOriginal = () => {
    setLines(linesC);
  };

  return (
    <section className="flex flex-col w-full h-screen items-center justify-center gap-y-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-5/6 h-20 bg-gray-900 rounded-xl flex flex-row items-center justify-center">
      <button
          className="bg-primary-color px-3 rounded-md h-10 cursor-pointer mr-10"
          onClick={() => navigate("/algorithm")}
        >
          Escoger otro Algoritmo
        </button>
        <button
          className="bg-primary-color px-3 rounded-md h-10 cursor-pointer mr-10"
          onClick={handleOriginal}
        >
          Grafo original
        </button>
        <button
          className="bg-primary-color px-3 rounded-md h-10 cursor-pointer mr-10"
          onClick={handleSolution}
        >
          Grafo resultante
        </button>
      </div>
      <div className="w-5/6 h-3/4 bg-gray-900 rounded-xl">
        <motion.div ref={constraintsRef} style={constraints}>
          {nodes.length > 0 &&
            lines.map((arco, index) => {
              const fromNode = nodes.find((node) => node.id === arco.from.id);
              const toNode = nodes.find((node) => node.id === arco.to.id);

              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2 + 25;
              const midY = (fromNode.y + toNode.y) / 2 + 25;

              return (
                <React.Fragment key={index}>
                  <LineTo
                    zIndex={1}
                    borderColor="white"
                    borderWidth={3}
                    from={arco.from.name}
                    to={arco.to.name}
                  />
                  <div
                    className="absolute bg-gray-800 text-white px-2 py-1 rounded-md shadow-md text-sm"
                    style={{
                      left: `${midX}px`,
                      top: `${midY}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {arco.weight}
                  </div>
                </React.Fragment>
              );
            })}

          {nodes.map((node, index) => (
            <motion.div
              key={index}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.2}
              style={{ ...box, left: node.x, top: node.y, position: "absolute" }}
              onDrag={(event, info) => {
                const updatedNodes = nodes.map((n) =>
                  n.id === node.id ? { ...n, x: info.point.x, y: info.point.y } : n
                );
                setNodes(updatedNodes);
              }}
            >
              <h1 className="text-4xl">{node.name}</h1>
              <div className={node.name}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Process;

const constraints = {
  width: "100%",
  height: "100%",
  backgroundColor: "var(--hue-1-transparent)",
  borderRadius: 10,
};

const box: any = {
  width: 100,
  height: 100,
  backgroundColor: "#026BB6",
  borderRadius: 50,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
};
