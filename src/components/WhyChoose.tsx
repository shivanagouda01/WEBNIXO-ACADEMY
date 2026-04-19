import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Target, Zap, Award, CreditCard, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Rocket,
    title: 'Beginner to Advanced',
    description: 'Structured roadmap that takes you from zero to a professional developer.'
  },
  {
    icon: Target,
    title: 'Real-world Projects',
    description: 'Build practical projects that you can showcase in your portfolio.'
  },
  {
    icon: Zap,
    title: 'Fast Learning',
    description: 'Concise, high-quality text-based learning that respects your time.'
  },
  {
    icon: Award,
    title: 'Certification',
    description: 'Earn a verified certificate of completion for every course you finish.'
  },
  {
    icon: Rocket,
    title: 'Lifetime Access',
    description: 'Enroll once and get lifetime access to all course materials and future updates.'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a vibrant community of learners and mentors for guidance.'
  }
];

export default function WhyChoose() {
  return (
    <section id="why-choose" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Why Choose <span className="text-gradient">Webnixo Academy?</span>
          </motion.h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We provide a unique learning experience focused on practical skills and career growth.
          </p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } }
              }}
              className="p-8 rounded-[40px] bg-bg-card border border-border-card hover:border-brand-primary/40 hover:bg-brand-primary/[0.02] transition-colors group shadow-lg"
            >
              <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-main tracking-tight">{feature.title}</h3>
              <p className="text-text-muted text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
