import React from 'react';
import { motion } from 'motion/react';
import { COURSES } from '../constants';
import { ArrowUpRight, IndianRupee } from 'lucide-react';
import { CourseSetting } from '../types';

interface CoursesProps {
  onBuy?: (course: { id: string; title: string }) => void;
  courseSettings?: Record<string, CourseSetting>;
  defaultPrice?: number;
}

export default function Courses({ onBuy, courseSettings = {}, defaultPrice = 199 }: CoursesProps) {
  const visibleCourses = COURSES.filter(course => {
    const setting = courseSettings[course.id];
    return setting ? setting.is_live : true; // Default to live if no setting exists
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } }
  };

  return (
    <section id="courses" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Explore Our <span className="text-gradient">Premium Courses</span>
          </motion.h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Industry-standard curriculum designed to take you from a complete beginner to a professional developer.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleCourses.map((course) => {
            const price = courseSettings[course.id]?.price || defaultPrice;
            
            return (
              <motion.div
                key={course.id}
                variants={item}
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                onClick={() => onBuy?.({ id: course.id, title: course.title })}
                className="group relative p-8 rounded-[40px] bg-bg-card border border-border-card hover:border-brand-primary/40 hover:bg-brand-primary/[0.02] transition-colors overflow-hidden cursor-pointer flex flex-col h-full shadow-lg hover:shadow-brand-primary/10"
              >
                {/* Watermark */}
                <div className="absolute top-4 right-10 text-5xl opacity-[0.02] font-black group-hover:opacity-[0.05] transition-opacity select-none pointer-events-none">
                  Webnixo
                </div>

                <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${course.color} flex items-center justify-center text-3xl mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  {course.icon}
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-primary transition-colors tracking-tight">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4 bg-brand-primary/5 w-fit px-3 py-1 rounded-lg border border-brand-primary/10">
                    <IndianRupee className="w-4 h-4 text-brand-primary" />
                    <span className="text-xl font-display font-black text-text-main">
                      {price}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm mb-6 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {course.highlights?.map((h, idx) => (
                      <span key={idx} className="text-[10px] px-3 py-1 rounded-lg bg-white/5 text-text-muted font-bold uppercase tracking-wider group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-text-main leading-tight">{course.students}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Students</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-text-main leading-tight">{course.rating}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Rating</span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 45 }}
                    className="p-3 rounded-2xl bg-white/5 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-lg"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </motion.div>
                </div>

                {/* Subtle Glow Trail */}
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-primary/5 blur-[80px] rounded-full group-hover:bg-brand-primary/20 transition-colors duration-700" />
              </motion.div>
            );
          })}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-[32px] bg-brand-primary/5 border border-brand-primary/20 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-brand-primary/10 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">And Many More...</h3>
            <p className="text-text-muted text-sm">New courses added every month!</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
