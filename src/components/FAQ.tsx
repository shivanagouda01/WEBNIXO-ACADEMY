import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Do I need any prior coding experience?",
    answer: "No! Our courses are designed for absolute beginners. We start from the very basics and gradually move to advanced concepts."
  },
  {
    question: "Is the certification industry-recognized?",
    answer: "Yes, our certificates are verified and recognized by many tech companies. They showcase your practical skills and project experience."
  },
  {
    question: "How long do I have access to the course?",
    answer: "You get lifetime access! Once you enroll, you can learn at your own pace and revisit the content anytime you want."
  },
  {
    question: "Is there any support if I get stuck?",
    answer: "Absolutely. You'll get access to our private Discord community where you can ask questions and get help from mentors and fellow students."
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a 7-day money-back guarantee if you're not satisfied with the course content. No questions asked."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4">
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary">Common Questions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked <span className="text-gradient">Questions</span></h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`rounded-[24px] border transition-all duration-300 ${
                openIndex === i ? 'bg-bg-card border-brand-primary/30 shadow-xl shadow-brand-primary/5' : 'bg-transparent border-border-card hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-7 flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-text-main tracking-tight">{faq.question}</span>
                <div className={`p-1.5 rounded-xl transition-all duration-500 ${openIndex === i ? 'bg-brand-primary text-white rotate-180' : 'bg-white/5 text-text-muted'}`}>
                  {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8 text-text-muted leading-relaxed text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
