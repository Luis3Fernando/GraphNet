import { useNavigate } from "react-router-dom";

import Bubbles from "../components/Bubbles";

import logo from '../assets/icon/logo.png';

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <section className="flex flex-row w-full h-screen p-5">
                <div className="w-1/2 pl-20 relative h-screen">
                    <img className="w-20 h-20 mt-20" src={logo} alt="" />
                    <h1 className="text-7xl mt-5 font-bold bg-background">GraphNet</h1>
                    <p className="font-light text-gray-300 text-xl   w-4/5 mt-8">Los grafos están en todas partes, y ahora puedes explorarlos como nunca antes. En GraphNet, visualiza, experimenta y resuelve problemas de la manera más intuitiva. <br /> ¡Haz que los algoritmos trabajen para ti!</p>
                    <button
                       onClick={() => navigate("/algorithm")} 
                      className="bg-primary-color cursor-pointer mt-20 px-5 rounded-md h-14 text-xl text-white font-semibold transition duration-400 ease-in-out transform hover:scale-105 hover:bg-opacity-90 hover:shadow-lg">
                        Comenzar
                    </button>                    
                </div>
                <div className="w-1/2 relative h-screen">
                    <Bubbles />
                </div>
            </section>
        </>
    )
}

export default Home
