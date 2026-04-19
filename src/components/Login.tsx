import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User as UserIcon, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (loginId: string, password: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function Login({ onLogin, onBack, isDarkMode }: LoginProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login delay
    setTimeout(() => {
      onLogin(loginId, password);
      setIsLoading(false);
    }, 1500);
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
          Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-text-muted">Login to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input 
                required
                type="text"
                placeholder="Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-12 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-text-muted">
              <input type="checkbox" className="rounded border-border-card bg-bg-card text-brand-primary focus:ring-brand-primary" />
              Remember me
            </label>
            <button type="button" className="text-brand-primary hover:underline font-medium">
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-brand-primary rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login & Start Learning'
            )}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-8">
          Don't have an account?{' '}
          <button onClick={onBack} className="text-brand-primary font-bold hover:underline">
            Explore Courses
          </button>
        </p>
      </motion.div>
    </div>
  );
}
