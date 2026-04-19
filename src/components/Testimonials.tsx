import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            What Our <span className="text-gradient">Students Say</span>
          </motion.h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Join thousands of satisfied students who have transformed their careers with Webnixo Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-bg-card border border-border-card relative group hover:border-brand-primary/30 transition-all"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-brand-primary/10 group-hover:text-brand-primary/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((_, starIdx) => (
                  <Star key={starIdx} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              <p className="text-text-main leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-primary/20">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">{testimonial.name}</h4>
                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
