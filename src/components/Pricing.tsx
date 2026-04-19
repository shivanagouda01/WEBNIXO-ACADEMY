import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star } from 'lucide-react';

interface PricingProps {
  onBuy?: (course: { id: string; title: string }) => void;
  price?: number;
}

export default function Pricing({ onBuy, price = 199 }: PricingProps) {
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '0',
      description: 'Perfect for getting started with basics.',
      features: [
        'Access to Module 1',
        'Community Support',
        'Basic Quizzes',
        'Public Roadmap'
      ],
      buttonText: 'Get Started',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: price.toString(),
      originalPrice: (price * 5).toString(),
      description: 'Everything you need to become a pro.',
      features: [
        'Full Course Access',
        'Verified Certificate',
        'Private Discord Access',
        'Real-world Projects',
        'Lifetime Updates',
        'Priority Support'
      ],
      buttonText: 'Enroll Now 🔥',
      highlight: true
    }
  ];

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Simple, <span className="text-gradient">Affordable Pricing</span>
          </motion.h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Invest in your future without breaking the bank. Limited time offer!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[32px] border transition-all ${
                plan.highlight 
                  ? 'bg-brand-primary/10 border-brand-primary shadow-2xl shadow-brand-primary/20 scale-105 z-10' 
                  : 'bg-bg-card border-border-card'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2">
                  <Star className="w-3 h-3 fill-current" /> Limited Time Offer
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-main">₹{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg text-text-muted line-through">₹{plan.originalPrice}</span>
                  )}
                  <span className="text-text-muted text-sm">/ lifetime</span>
                </div>
                <p className="text-text-muted text-sm mt-4">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-text-muted'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-text-main">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onBuy?.({ id: plan.id, title: plan.name })}
                className={`w-full py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 ${
                  plan.highlight 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' 
                    : 'bg-white/5 border border-white/10 text-text-main hover:bg-white/10'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
