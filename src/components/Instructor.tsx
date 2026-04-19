import React from 'react';
import { motion } from 'motion/react';
import { FOUNDER } from '../constants';
import { CheckCircle2, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export default function Instructor() {
  return (
    <section id="instructor" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2">Meet Your Mentor</h4>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{FOUNDER.name}</h2>
              <p className="text-xl font-medium text-text-muted mb-6">{FOUNDER.role}</p>
              <p className="text-text-muted leading-relaxed text-lg">
                {FOUNDER.bio}
              </p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {FOUNDER.skills.map((skill, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-brand-primary/30 hover:bg-brand-primary/[0.02] transition-colors group shadow-sm"
                >
                  <CheckCircle2 className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
                  <span className="text-base font-bold text-text-main tracking-tight">{skill}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex items-center gap-4 pt-6">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                View Portfolio <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
