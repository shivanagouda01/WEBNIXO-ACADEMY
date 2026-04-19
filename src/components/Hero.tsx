import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, Star, Users, Award, Code, Cpu, Globe, Rocket } from 'lucide-react';

interface HeroProps {
  onNavigate?: (page: 'home' | 'dashboard') => void;
}

const FloatingIcon = ({ icon: Icon, delay, className }: { icon: any, delay: number, className: string }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, repeat: Infinity, delay }}
    className={`absolute p-3 rounded-2xl glass-dark text-brand-primary/50 ${className}`}
  >
    <Icon className="w-6 h-6" />
  </motion.div>
);

export default function Hero({ onNavigate }: HeroProps) {
  const words = "Master In-Demand Tech Skills 🚀".split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center relative overflow-hidden py-12 md:py-20">
      {/* Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-primary/10 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-brand-secondary/10 blur-[120px] rounded-full" 
      />

      {/* Floating Icons with parallax-style drift */}
      <FloatingIcon icon={Code} delay={0} className="top-[10%] right-[10%] md:right-[15%]" />
      <FloatingIcon icon={Cpu} delay={1} className="bottom-[20%] right-[5%] md:right-[10%]" />
      <FloatingIcon icon={Globe} delay={2} className="top-[15%] left-[5%] md:left-[10%]" />
      <FloatingIcon icon={Rocket} delay={3} className="bottom-[10%] left-[10%] md:left-[15%]" />

      <div className="relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-brand-primary">
            Founded by SHIVANAGOUDA PATIL
          </span>
        </motion.div>

        <motion.h1 
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[1.05] mb-8 tracking-tight max-w-4xl"
        >
          {words.map((word, index) => (
            <motion.span
              variants={child}
              key={index}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mb-12 leading-relaxed"
        >
          Learn Python, JavaScript, React, and more with our 
          <span className="text-text-main font-bold"> Industry-Standard </span> 
          curriculum designed by experts. Build real-world projects and get certified.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16"
        >
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="group relative px-10 py-5 bg-brand-primary rounded-2xl font-bold text-white text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-primary/30"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Learning <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </button>
          <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-text-main text-lg hover:bg-white/10 transition-all hover:border-brand-primary/30 text-center">
            Explore Courses
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl"
        >
          {[
            { label: 'Students Joined', value: '2500+', icon: Users, color: 'text-blue-400' },
            { label: 'Student Rating', value: '4.9/5.0', icon: Star, color: 'text-yellow-400' },
            { label: 'Expert Mentors', value: 'Global', icon: Award, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-text-main">{stat.value}</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
