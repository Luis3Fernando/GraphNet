import { createContext, useContext, useState } from "react";
import {Node, Arco} from '../models/types';

const Context = createContext({});

const ContextProvider = ({ children }: { children: any }) => {
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
  return useContext(Context);
};

export { ContextProvider, useAlgorithm }