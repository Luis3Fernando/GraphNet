import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const bubbles = [
  { size: "w-60 h-60", color: "bg-teal-800", position: "left-0 top-10" },
  { size: "w-52 h-52", color: "bg-cyan-600", position: "left-20 bottom-10" },
  { size: "w-80 h-80", color: "bg-sky-700", position: "right-20 top-32" },
  { size: "w-48 h-48", color: "bg-fuchsia-300", position: "left-32 top-60" },
  { size: "w-48 h-48", color: "bg-orange-300", position: "right-24 bottom-24" },
];

function Bubble({ size, color, position }: { size: string; color: string; position: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showBubble = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000); 
    };

    let delay = Math.random() * 5000 + 2000;
    let timer = setTimeout(() => {
      showBubble();
      const interval = setInterval(() => {
        showBubble();
      }, Math.random() * 5000 + 2000);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`${size} ${color} rounded-full absolute ${position}`}
    />
  );
}

export default function Bubbles() {
  return (
    <div className="w-full h-screen relative">
      {bubbles.map((bubble, index) => (
        <Bubble key={index} {...bubble} />
      ))}
    </div>
  );
}
