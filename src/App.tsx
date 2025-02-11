import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Process from "./pages/Process";
import Algorithm from "./pages/Algorithm";
import LayoutEdit from "./pages/LayoutEdit";
import AlgorithmKruskal from "./logic/components/AlgorithmKruskal";
import AlgorithmDijkstra from "./logic/components/AlgorithmDijkstra";
import Process2 from "./pages/Process2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/process" element={<Process/>} />
        <Route path="/process2" element={<Process2/>} />
        <Route path="/algorithm" element={<Algorithm/>} />
        <Route path="/edit" element={<LayoutEdit/>} />
        <Route path="algorithm/kruskal" element={<AlgorithmKruskal/>} />
        <Route path="algorithm/dijkstra" element={<AlgorithmDijkstra/>} />
      </Routes>
    </Router>
  )
}

export default App
