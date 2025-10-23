import { useEffect, useState } from "react";

const LiveCounter = () => {
  const [count, setCount] = useState(9279);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex justify-center items-center py-16 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all animate-fade-in">
      <div className="text-center rounded-3xl shadow-xl bg-white/60 dark:bg-gray-800/70 backdrop-blur-xl px-6 py-8 md:px-10 md:py-10 max-w-xl w-full mx-4 border border-white/30 dark:border-gray-700/50">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          🧘 Pessoas Meditando Agora
        </h2>
        <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight mb-3 animate-pulse">
          {count.toLocaleString()}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium">
          pessoas meditando neste momento
        </p>
      </div>
    </section>
  );
};

export default LiveCounter;
