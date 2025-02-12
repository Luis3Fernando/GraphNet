"use client";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as motion from "motion/react-client";
import React, { useRef, useState, useEffect } from "react";
import LineTo from "react-lineto";
import { useAlgorithm } from "../context/Context";
import { Node, Arco } from "../models/types";
import { dijkstra } from "../logic/maths/dijkstra";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const notify_error = (text: string) => toast.error(text);

function Process2() {
    const navigate = useNavigate();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [lines, setLines] = useState<Arco[]>([]);
    const [openLine, setOpenLine] = useState(false);
    const { nodesC, linesC, matrix } = useAlgorithm();
    const [startNode, setStartNode] = useState<Node | null>(null);
    const [endNode, setEndNode] = useState<Node | null>(null);

    const handleOpenLine = () => setOpenLine(true);
    const handleCloseLine = () => setOpenLine(false);

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

    const handleOriginal = () => {
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

    const defRuta = () => {
        if (!startNode || !endNode) {
            notify_error("Debe seleccionar nodo de inicio y de destino");
            return;
        }
        const startIdx = startNode.id - 1;
        const endIdx = endNode.id - 1;

        const shortestPath: number[] = dijkstra(nodes.length, matrix, startIdx, endIdx);

        const nodes_short: Node[] = [];
        shortestPath.forEach((index) => {
            nodes_short.push(nodes[index]);
        });

        const nodos_escogidos = nodes_short.map((node: any) => ({
            ...node,
            x: node.x,
            y: node.y,
        }));
        setNodes(nodos_escogidos);

        const routeEdges: Arco[] = [];
        for (let i = 0; i < shortestPath.length - 1; i++) {
            const fromIdx = shortestPath[i];
            const toIdx = shortestPath[i + 1];
            routeEdges.push({
                id: routeEdges.length + 1,
                weight: matrix[fromIdx][toIdx],
                from: nodes[fromIdx],
                to: nodes[toIdx],
            });
        }
        setLines(routeEdges);
    };


    const handleStartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNode = nodes.find(node => node.name === event.target.value) || null;
        setStartNode(selectedNode);
        setEndNode(null);
    };

    const handleEndChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNode = nodes.find(node => node.name === event.target.value) || null;
        setEndNode(selectedNode);
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
                    className="bg-primary-color ml-5 px-3 rounded-md h-10 cursor-pointer"
                    onClick={handleOpenLine}
                >
                    Seleccionar ruta
                </button>
                <Modal
                    open={openLine}
                    onClose={handleCloseLine}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h1 className='text-xl font-light'>Escoge la ruta</h1>
                        <div className="flex gap-4 bg-gray-800 p-4 rounded-lg shadow-lg mt-5">

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm">Nodo de inicio:</label>
                                <select
                                    value={startNode ? startNode.name : ""}
                                    onChange={handleStartChange}
                                    className="bg-gray-700 px-3 py-2 rounded-md text-white"
                                >
                                    <option value="" disabled>Selecciona un nodo</option>
                                    {nodes.map((node) => (
                                        <option key={node.id} value={node.name}>
                                            {node.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm">Nodo de destino:</label>
                                <select
                                    value={endNode ? endNode.name : ""}
                                    onChange={handleEndChange}
                                    className="bg-gray-700 px-3 py-2 rounded-md text-white"
                                    disabled={!startNode}
                                >
                                    <option value="" disabled>Selecciona un nodo</option>
                                    {nodes
                                        .filter((node) => node.name !== startNode?.name)
                                        .map((node) => (
                                            <option key={node.id} value={node.name}>
                                                {node.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <button onClick={defRuta} className='bg-primary-color px-3 mt-10 rounded-md h-10 cursor-pointer'>Calcular</button>
                    </Box>
                </Modal>
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
                            onDrag={(_, info) => {
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

export default Process2;

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: '#101828',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};