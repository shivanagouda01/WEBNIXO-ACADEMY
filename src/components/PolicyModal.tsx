import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, RefreshCcw, ScrollText } from 'lucide-react';

interface PolicyModalProps {
  type: 'refund' | 'privacy' | 'terms';
  onClose: () => void;
  isDarkMode: boolean;
}

const POLICIES = {
  refund: {
    title: 'Refund Policy',
    icon: RefreshCcw,
    color: 'text-blue-500',
    content: (
      <div className="space-y-6">
        <section>
          <h4 className="text-lg font-bold mb-2">7-Day Money-Back Guarantee</h4>
          <p className="text-text-muted leading-relaxed">
            At Webnixo Academy, we want you to be completely satisfied with your learning experience. 
            If you find that the course content doesn't meet your expectations, you are eligible for a 
            full refund within 7 days of your purchase.
          </p>
        </section>
        
        <section>
          <h4 className="text-lg font-bold mb-2">Eligibility Criteria</h4>
          <ul className="list-disc list-inside text-text-muted space-y-2">
            <li>Refund request must be submitted within 7 calendar days of purchase.</li>
            <li>Content consumption must be less than 20% of the total course material.</li>
            <li>No certificates of completion should have been issued for the course.</li>
          </ul>
        </section>

        <section>
          <h4 className="text-lg font-bold mb-2">Exceptions</h4>
          <p className="text-text-muted leading-relaxed">
            Refunds will not be granted after the 7-day period has passed, or if a user has 
            completed more than 20% of the course content. Promo codes or discounted purchases 
            are also subject to this policy unless stated otherwise during the promotion.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-bold mb-2">Process</h4>
          <p className="text-text-muted leading-relaxed">
            To request a refund, please email our support team at <span className="text-brand-primary font-bold">support@webnixo.com</span> with 
            your registered email ID and Course Login ID. Refunds are typically processed within 5-7 working days.
          </p>
        </section>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    color: 'text-green-500',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold mb-2">Data Protection</h3>
          <p className="text-text-muted leading-relaxed">
            We value your privacy and security. We only collect essential information required 
            to provide our educational services, such as your name, email, and university details.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold mb-2">Information Usage</h3>
          <p className="text-text-muted leading-relaxed">
            Your data is used solely for course registration, progress tracking, and certificate 
            generation. We do not sell or share your personal data with third-party advertisers.
          </p>
        </section>
      </div>
    )
  },
  terms: {
    title: 'Terms of Service',
    icon: ScrollText,
    color: 'text-purple-500',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold mb-2">User Conduct</h3>
          <p className="text-text-muted leading-relaxed">
            By enrolling in Webnixo Academy, you agree to use the platform for educational 
            purposes only. Sharing of accounts or distribution of proprietary course material is 
            strictly prohibited and may lead to account termination.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold mb-2">Intellectual Property</h3>
          <p className="text-text-muted leading-relaxed">
            All course content, videos, and source code provided are the property of Webnixo Academy 
            and are protected by copyright laws.
          </p>
        </section>
      </div>
    )
  }
};

export default function PolicyModal({ type, onClose, isDarkMode }: PolicyModalProps) {
  const policy = POLICIES[type];
  const Icon = policy.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[32px] border border-white/10 shadow-2xl flex flex-col ${
          isDarkMode ? 'bg-[#0a0c12]' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${policy.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{policy.title}</h2>
              <p className="text-text-muted text-xs uppercase tracking-widest font-bold">Webnixo Academy Official Policy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          {policy.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
            Last Updated: April 2026 • © Webnixo Academy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
