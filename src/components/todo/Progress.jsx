import { motion } from 'framer-motion';

export default function Progress({ progress, isMobile }) {
  // モバイル時は lg:hidden、PC時は hidden lg:block で表示を切り替え
  const containerClass = isMobile 
    ? "lg:hidden bg-indigo-600 p-6 rounded-3xl text-white shadow-lg mb-4" 
    : "hidden lg:block bg-indigo-600 p-6 rounded-3xl text-white shadow-lg";

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-black text-xs uppercase">Progress</h3>
        <span className="text-xl font-black">{progress}%</span>
      </div>
      <div className="h-1.5 bg-indigo-400/50 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${progress}%` }} 
          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
        />
      </div>
    </div>
  );
}