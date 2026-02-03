import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Button, Container } from "../UI";
import heroBg from "../../assets/images/hero_bg.png";
import basilImg from "../../assets/images/basil.png";
import rosemaryImg from "../../assets/images/rosemary.png";
import peppercornImg from "../../assets/images/peppercorn.png";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Scroll Parallax for background and content
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 800], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Mouse Parallax System
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate distance from center (-1 to 1)
    mouseX.set((clientX - innerWidth / 2) / 25);
    mouseY.set((clientY - innerHeight / 2) / 25);
  };

  const FloatingParticle = ({ img, size, initialX, initialY, rotate, speed, delay, depth, blur = 0 }) => {
    // Combine mouse move and auto-floating
    const pX = useTransform(springX, (val) => val * depth);
    const pY = useTransform(springY, (val) => val * depth);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: `${initialX}vw`, y: `${initialY}vh`, rotate }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [`${initialY}vh`, `${initialY + 3}vh`, `${initialY}vh`],
          rotate: [rotate, rotate + 15, rotate]
        }}
        style={{ x: pX, y: pY }}
        transition={{
          opacity: { duration: 1.5, delay },
          scale: { duration: 1.5, delay },
          y: { duration: 4 + speed, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6 + speed, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute z-10 pointer-events-none"
      >
        <img
          src={img}
          alt=""
          style={{
            width: size,
            filter: `blur(${blur}px) drop-shadow(${depth * 5}px ${depth * 8}px ${depth * 10}px rgba(0,0,0,0.4))`
          }}
          className="object-contain"
        />
      </motion.div>
    );
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[90vh] md:h-screen w-full flex items-center overflow-hidden bg-background pt-16"
    >
      {/* Immersive Cinematic Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.15]"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Layered Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
      </motion.div>

      {/* Advanced Particle System - Individual Elements */}
      {/* High Depth (Close to screen) */}
      <FloatingParticle img={basilImg} size={220} initialX={70} initialY={10} rotate={45} speed={1} delay={0.5} depth={2.5} blur={2} />
      <FloatingParticle img={rosemaryImg} size={280} initialX={-5} initialY={60} rotate={-20} speed={1.5} delay={0.8} depth={2} blur={1} />
      <FloatingParticle img={peppercornImg} size={50} initialX={80} initialY={70} rotate={0} speed={0.5} delay={1.2} depth={3} blur={3} />

      {/* Mid Depth */}
      <FloatingParticle img={basilImg} size={110} initialX={85} initialY={35} rotate={-30} speed={2} delay={1} depth={1.2} />
      <FloatingParticle img={basilImg} size={80} initialX={15} initialY={20} rotate={120} speed={1.2} delay={1.4} depth={1} />
      <FloatingParticle img={peppercornImg} size={25} initialX={35} initialY={85} rotate={90} speed={3} delay={1.6} depth={0.8} />

      {/* Distant/Small */}
      <FloatingParticle img={peppercornImg} size={15} initialX={50} initialY={15} rotate={200} speed={4} delay={2} depth={0.4} />

      {/* Content Layer */}
      <Container className="relative z-20">
        <motion.div
          style={{ y: contentY, opacity }}
          className="max-w-4xl space-y-12"
        >
          {/* Animated Brand Reveal */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="h-[1px] w-12 bg-primary" />
              <span className="text-primary font-black text-xs md:text-sm tracking-[0.4em] uppercase">
                Est. 2024 • LocalChef Bazaar
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-[8.5rem] font-black text-white leading-[0.85] tracking-[-0.04em] drop-shadow-2xl">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                THE ART OF
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="block text-primary italic font-serif mt-2"
              >
                HOMEMADE.
              </motion.span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="text-xl md:text-3xl text-white/70 font-light leading-relaxed max-w-2xl"
          >
            Redefining dinner. Connect with passionate local chefs for authentic, handcrafted meals that tell a story.
          </motion.p>

          {/* Premium CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex flex-wrap items-center gap-10 pt-6"
          >
            <Button
              to="/meals"
              size="lg"
              variant="primary"
              className="h-20 px-14 text-xl font-black rounded-full shadow-[0_20px_60px_-15px_rgba(243,139,12,0.5)] hover:shadow-primary/60 transition-all duration-500 hover:scale-105"
            >
              Discover Meals
            </Button>

            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-center gap-5 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-white border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-widest uppercase text-xs">Our Journey</span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">Watch 1:20min</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Social Proof Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex items-center gap-16 pt-16 md:pt-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-white">4.9/5</span>
              <span className="text-[10px] tracking-widest text-primary font-black uppercase">App Store Rating</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-white">12k+</span>
              <span className="text-[10px] tracking-widest text-primary font-black uppercase">Meals Shared</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Custom Bottom Gradient to Section 2 */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-30" />
    </section>
  );
};

export default Hero;
