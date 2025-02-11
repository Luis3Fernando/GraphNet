"use client"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as motion from "motion/react-client";
import React, { useRef, useState } from "react";
import LineTo from 'react-lineto';
import toast, { Toaster } from 'react-hot-toast';
import { useAlgorithm } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { Node, Arco } from '../../models/types';

const notify_error = (text: string) => toast.error(text);
const notify_succes = (text: string) => toast.success(text);

function AlgorithmKruskal() {
    const { setMatrix, setNodesC, setLinesC } = useAlgorithm();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [startNode, setStartNode] = useState<Node | null>(null);
    const [endNode, setEndNode] = useState<Node | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [lines, setLines] = useState<Arco[]>([]);
    const [openLine, setOpenLine] = useState(false);
    const navigate = useNavigate();

    const handleOpenLine = () => setOpenLine(true);
    const handleCloseLine = () => setOpenLine(false);

    const generateAdjacencyMatrix = (): number[][] => {
        const numNodes = nodes.length;
        const matrix: number[][] = Array.from({ length: numNodes }, () =>
            Array.from({ length: numNodes }, () => 0)
        );

        lines.forEach((arco) => {
            const fromIndex = nodes.findIndex((node) => node.id === arco.from.id);
            const toIndex = nodes.findIndex((node) => node.id === arco.to.id);

            if (fromIndex !== -1 && toIndex !== -1) {
                matrix[fromIndex][toIndex] = arco.weight;
                matrix[toIndex][fromIndex] = arco.weight;
            }
        });

        setMatrix(matrix);
        setLinesC(lines);
        setNodesC(nodes);
        return matrix;
    };

    const addNode = () => {
        if (nodes.length < 10) {
            const letter = String.fromCharCode(65 + nodes.length);
            setNodes([...nodes, { id: nodes.length + 1, name: letter, x: 0, y: 0 }]);
        } else {
            notify_error("No se pueden agregar más de 10 nodos.");
        }
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

    const connectNodes = () => {
        const weight = Number((document.getElementById('value') as HTMLInputElement)?.value || 0);

        if (!startNode || !endNode) {
            notify_error("Debes seleccionar ambos nodos.");
            return;
        }

        if (startNode.id === endNode.id) {
            notify_error("No puedes conectar un nodo consigo mismo.");
            return;
        }

        if (!weight && weight >= 0) {
            notify_error("Necesitas un peso del arco válido.");
            return;
        }

        const isDuplicate = lines.some(
            (arco) =>
                (arco.from.id === startNode.id && arco.to.id === endNode.id) ||
                (arco.from.id === endNode.id && arco.to.id === startNode.id)
        );

        if (isDuplicate) {
            notify_error("Ya existe un arco entre estos dos nodos.");
            return;
        }


        const newArco: Arco = {
            id: lines.length + 1,
            weight,
            from: startNode,
            to: endNode
        };

        setLines([...lines, newArco]);
    };

    const clear = () => {
        setNodes([]);
        setLines([]);
        notify_succes("Lienzo limpiado");
    }

    const solver = () => {
        generateAdjacencyMatrix();
        navigate("/process");
    }

    return (
        <section className="flex flex-col w-full h-screen items-center justify-center gap-y-5">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="w-5/6 h-20 bg-gray-900 rounded-xl flex flex-row items-center justify-between">
                <ul className="ml-10 flex gap-x-5">
                    <li>
                        <button
                            className="bg-primary-color px-3 rounded-md h-10 cursor-pointer"
                            onClick={addNode}
                        >
                            Agregar Nodo
                        </button>
                        <button
                            className="bg-primary-color ml-5 px-3 rounded-md h-10 cursor-pointer"
                            onClick={handleOpenLine}
                        >
                            Agregar Conexión
                        </button>
                        <Modal
                            open={openLine}
                            onClose={handleCloseLine}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <h1 className='text-xl font-light'>Agrega un linea de conexión entre 2 nodos</h1>

                                <input required type="number" id='value' placeholder='Ingresa el valor del arco' className='w-5/6 p-2 bg-gray-800 rounded-md outline-0 mt-5' />

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
                                <button onClick={connectNodes} className='bg-primary-color px-3 mt-10 rounded-md h-10 cursor-pointer'>Añadir</button>
                            </Box>
                        </Modal>
                        <button
                            className="bg-primary-color ml-5 px-3 rounded-md h-10 cursor-pointer"
                            onClick={clear}
                        >
                            Limpiar
                        </button>
                    </li>
                </ul>

                <button className='bg-primary-color px-3 rounded-md h-10 cursor-pointer mr-10' onClick={solver}>
                    Resolver
                </button>
            </div>
            <div className="w-5/6 h-3/4 bg-gray-900 rounded-xl">
                <motion.div ref={constraintsRef} style={constraints}>
                    {lines.map((arco, index) => {
                        const fromNode = nodes.find(node => node.id === arco.from.id);
                        const toNode = nodes.find(node => node.id === arco.to.id);

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
                            style={box}
                            onDrag={(_, info) => {
                                const updatedNodes = nodes.map((n) =>
                                    n.id === node.id ? { ...n, x: info.point.x, y: info.point.y } : n
                                );
                                setNodes(updatedNodes);
                            }}
                        >
                            <h1 className='text-4xl'>{node.name}</h1>
                            <div className={node.name}></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default AlgorithmKruskal;

const constraints = {
    width: '100%',
    height: '100%',
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
    zIndex: 10
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