import * as motion from "motion/react-client";
import { useNavigate } from "react-router-dom";
import { PiTreeThin, PiTreeViewLight  } from "react-icons/pi";

function Algorithm() {
  const navigate = useNavigate();

  return (
    <section className="w-full h-screen flex flex-col items-center p-10">
      <h1 className="text-2xl text-gray-100 mt-14">Selecciona el algoritmo a usar:</h1>
      <section className="w-full h-auto flex flex-wrap gap-x-10 justify-center mt-20">
        <button onClick={() => navigate("/algorithm/kruskal")} >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            style={box}>

            <PiTreeThin size={100} />
            <h2 className="font-medium text-2xl mt-10 w-4/5">Árbol de Expansión Mínima - Kruskal</h2>

          </motion.div>
        </button>

        <button onClick={() => navigate("/algorithm/dijkstra")}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            style={box}>

            <PiTreeViewLight size={100} />
            <h2 className="font-medium text-2xl mt-10 w-4/5">Algoritmo de Dijkstra</h2>

          </motion.div>
        </button>

      </section>
    </section>

  )
}

export default Algorithm

const box: any = {
  width: 300,
  height: 400,
  backgroundColor: "#0494FC",
  borderRadius: 15,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}