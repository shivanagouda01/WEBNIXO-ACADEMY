import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

export default function Certificate() {
  return (
    <section id="certificate" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2">Recognition</h4>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Earn a <span className="text-gradient">Verified Certificate</span></h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Stand out from the crowd with a professional certificate of completion. 
                Share your achievements on LinkedIn, your resume, or with potential employers.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Industry-recognized certification',
                'Verified by Webnixo Academy',
                'Signed by SHIVANAGOUDA PATIL',
                'Sharable digital link included'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-text-main font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-2 px-8 py-4 bg-brand-primary rounded-2xl font-bold text-white text-base hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
              Enroll Now to Earn <Award className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Certificate Preview Image */}
            <div className="relative z-10 aspect-[1.414/1] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 group">
              <img 
                src="https://lh3.googleusercontent.com/d/1IFeZdAHyCu78AfoDtYOr4MZfYu11i_4J" 
                alt="Webnixo Academy Verified Certificate"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Glow Animation overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-secondary/10 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
