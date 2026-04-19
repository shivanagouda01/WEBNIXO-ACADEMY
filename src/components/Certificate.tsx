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
            {/* Certificate Preview Card */}
            <div className="relative z-10 aspect-[1.4/1] bg-white rounded-[32px] p-12 shadow-2xl border-[12px] border-slate-100 overflow-hidden group">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-15deg]">
                <span className="text-[100px] font-bold whitespace-nowrap text-slate-900">WEBNIXO</span>
              </div>

              <div className="h-full border-4 border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-between relative z-10">
                <div className="text-center">
                  <Award className="w-16 h-16 text-brand-primary mb-4 mx-auto" />
                  <h3 className="text-slate-900 font-display text-2xl font-bold uppercase tracking-widest mb-2">Certificate of Completion</h3>
                  <p className="text-slate-500 text-sm">This is to certify that</p>
                </div>

                <div className="text-center">
                  <h4 className="text-slate-900 font-display text-4xl font-bold border-b-2 border-slate-200 px-12 pb-2 mb-4">STUDENT NAME</h4>
                  <p className="text-slate-500 text-sm">has successfully completed the course</p>
                  <h5 className="text-brand-primary font-bold text-xl mt-2">PYTHON MASTERY BOOTCAMP</h5>
                </div>

                <div className="w-full flex justify-between items-end pt-8">
                  <div className="text-center">
                    <div className="w-32 h-px bg-slate-300 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Date of Issue</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-slate-900 font-bold italic mb-1">Shivanagouda Patil</p>
                    <div className="w-32 h-px bg-slate-300 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold">CEO & Founder</p>
                  </div>
                </div>
              </div>
              
              {/* Glow Animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-secondary/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
