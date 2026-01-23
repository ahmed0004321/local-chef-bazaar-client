import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 -left-20 size-96 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 size-96 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Animated Number */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[150px] md:text-[220px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none"
        >
          404
        </motion.h1>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-4">
            Oops! You're lost in the kitchen.
          </h2>
          <p className="text-neutral-400 mt-4 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            The meal you are looking for has been moved or eaten by the chef.
            Let's get you back to the main menu.
          </p>
        </motion.div>

        {/* Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all duration-300 backdrop-blur-md"
          >
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Floating Elements (Visual Garnish) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] hidden lg:block"
      >
        <span className="text-6xl grayscale opacity-20">🍳</span>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 left-[15%] hidden lg:block"
      >
        <span className="text-6xl grayscale opacity-20">🍕</span>
      </motion.div>
    </div>
  );
};

export default Page404;
