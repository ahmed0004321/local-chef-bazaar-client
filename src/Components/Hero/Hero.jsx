import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight, FaPlay, FaStar, FaFire, FaUserTie } from "react-icons/fa";
import { Container } from "../UI";

const Hero = () => {
  // Animation for floating elements
  const floatingAnimation = {
    y: ["-10px", "10px"],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimationDelayed = {
    y: ["10px", "-10px"],
    transition: {
      y: {
        duration: 3.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-[#050505] flex items-center pt-20 pb-12 overflow-hidden">
      {/* Abstract Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="w-2 h-2 rounded-full bg-primary absolute" />
              <span className="text-xs font-semibold text-white/80 tracking-widest uppercase">100% Authentic Home Cooking</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight">
              Savor the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500">
                True Taste
              </span> <br className="hidden md:block" />
              of Home.
            </h1>

            <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Skip the generic restaurant food. Discover passionate local chefs cooking authentic, hygienic, and soulful meals right in your neighborhood.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/meals"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_var(--fallback-p)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Explore Meals <FaArrowRight />
              </Link>
              <button
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 font-bold text-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <FaPlay className="text-sm pl-0.5" />
                </div>
                Watch Video
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-4 w-full justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img loading="lazy" key={i} src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-10 h-10 rounded-full border-2 border-[#050505] object-cover" />
                ))}
              </div>
              <div className="text-sm">
                <p className="text-white font-bold">Trusted by 10k+ Foodies</p>
                <div className="flex text-yellow-500 text-xs">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Floating Elements Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center mt-10 md:mt-0"
          >
            {/* Main Central Image */}
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-tr from-primary/40 to-orange-500/40 backdrop-blur-3xl lg:animate-[spin_40s_linear_infinite]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#050505]">
                <img loading="lazy" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop" alt="Delicious Food" className="w-full h-full object-cover lg:animate-[spin_40s_linear_infinite_reverse]" />
              </div>
            </div>

            {/* Floating Component 1: Top Right */}
            <motion.div
              animate={floatingAnimation}
              className="absolute top-[5%] right-[0%] lg:right-[5%] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl">
                <FaStar />
              </div>
              <div>
                <p className="text-white font-black text-xl">4.9/5</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Average Rating</p>
              </div>
            </motion.div>

            {/* Floating Component 2: Bottom Left */}
            <motion.div
              animate={floatingAnimationDelayed}
              className="absolute bottom-[5%] left-[0%] lg:left-[5%] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl">
                <FaFire />
              </div>
              <div>
                <p className="text-white font-black text-xl">Hot & Fresh</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Straight to you</p>
              </div>
            </motion.div>

            {/* Floating Component 3: Center Left */}
            <motion.div
              animate={floatingAnimation}
              className="absolute top-[40%] left-[-5%] lg:left-[-10%] bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl items-center gap-3 z-20 hidden md:flex"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <FaUserTie />
              </div>
              <div>
                <p className="text-white font-bold text-sm">500+ Local</p>
                <p className="text-white/60 text-[10px] font-semibold uppercase">Verified Chefs</p>
              </div>
            </motion.div>

            {/* Decorative Glow behind the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/30 to-orange-500/30 blur-[100px] rounded-full -z-10 pointer-events-none" />

          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default Hero;
