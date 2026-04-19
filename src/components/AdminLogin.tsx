import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (id: string, pass: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function AdminLogin({ onLogin, onBack, isDarkMode }: AdminLoginProps) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate multi-step security check
    const steps = ['Authenticating...', 'Verifying Credentials...', 'Security Audit...'];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        onLogin(id, password);
        setIsLoading(false);
      } else {
        // We can't easily update the message without adding state, 
        // but the delay itself adds a sense of "verification"
      }
    }, 600);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#05070a]' : 'bg-slate-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-[32px] border border-border-card shadow-2xl ${
          isDarkMode ? 'bg-bg-card' : 'bg-white'
        }`}
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Academy
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Admin Portal</h2>
          <p className="text-text-muted text-sm">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-red-500 transition-colors" />
              <input 
                required
                type="text"
                placeholder="Admin ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-red-500 transition-all font-display tracking-tight"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-red-500 transition-colors" />
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-12 py-4 text-text-main focus:outline-none focus:border-red-500 transition-all font-display tracking-tight"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Security Audit...
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
            Secured by Webnixo Academy Internal Systems
          </p>
        </div>
      </motion.div>
    </div>
  );
}
