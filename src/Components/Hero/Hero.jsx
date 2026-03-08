import React from "react";
import { Button, Container } from "../UI";
import { motion } from "framer-motion";
import { FaUtensils, FaUsers, FaHeart, FaArrowRight, FaStar, FaShieldAlt, FaClock } from "react-icons/fa";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="w-full relative min-h-[800px] py-20 lg:py-32 overflow-hidden bg-[#0A0A0B] flex items-center">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <Container className="relative z-10 h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-6 h-full"
        >
          {/* 1. MAIN HEADLINE TILE (Spans 2x2) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:row-span-2 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex flex-col justify-center items-start space-y-8 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Premium Home Cuisine
              </div>
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Discover <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 italic">Authentic</span> <br />
                Bazaar.
              </h1>
              <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed max-w-sm">
                Connecting you with local artisanal chefs for the most soulful homemade experiences.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 relative z-10">
              <Button
                to="/meals"
                className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all flex items-center gap-3"
              >
                Get Started
                <FaArrowRight />
              </Button>
            </div>
          </motion.div>

          {/* 2. CHEF SPOTLIGHT TILE */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-primary group-hover:scale-110 transition-transform">
                <FaUtensils />
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0B] overflow-hidden">
                    <img loading="lazy" src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">500+ Chefs</h3>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Local Artisans Joined</p>
            </div>
          </motion.div>

          {/* 3. QUALITY/TRUST TILE */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between hover:border-orange-500/20 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl text-orange-500 group-hover:rotate-12 transition-transform">
              <FaShieldAlt />
            </div>
            <div className="space-y-4">
              <div className="flex gap-1 text-orange-400">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Hygiene First</h3>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Certified Kitchens Only</p>
              </div>
            </div>
          </motion.div>

          {/* 4. RECENT ACTIVITY TILE (WIDER) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-between hover:border-blue-500/20 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl">
                <FaClock />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">35 Min Delivery</h4>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Average Wait Time Now</p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end relative z-10">
              <span className="text-4xl font-black text-white leading-none">120+</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Live Orders</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none opacity-50">
        <svg viewBox="0 0 1440 320" className="w-full fill-background">
          <path d="M0,256L60,240C120,224,240,192,360,192C480,192,600,224,720,224C840,224,960,192,1080,176C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
