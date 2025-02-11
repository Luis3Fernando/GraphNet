import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import {Node, Arco} from '../models/types';

const Context = createContext<AlgorithmContextProps | undefined>(undefined);

interface AlgorithmContextProps {
  matrix: number[][];
  setMatrix: Dispatch<SetStateAction<number[][]>>;
  nodos: number;
  setNodos: Dispatch<SetStateAction<number>>;
  nodesC: Node[];
  setNodesC: Dispatch<SetStateAction<Node[]>>;
  linesC: Arco[];
  setLinesC: Dispatch<SetStateAction<Arco[]>>;
}

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [nodos, setNodos] = useState<number>(0);
  const [nodesC, setNodesC] = useState<Node[]>([]);
  const [linesC, setLinesC] = useState<Arco[]>([]);

  return (
    <Context.Provider value={{ matrix, setMatrix, nodos, setNodos, nodesC, setNodesC, linesC, setLinesC }}>
      {children}
    </Context.Provider>
  );
};

const useAlgorithm = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAlgorithm must be used within a ContextProvider");
  }
  return context;
};

export { ContextProvider, useAlgorithm }