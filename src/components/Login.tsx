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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      
      const authWindow = window.open(url, 'google_login_popup', 'width=500,height=600');
      
      if (!authWindow) {
        throw new Error('Popup blocked! Please allow popups for this site.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google login');
      setIsLoading(false);
    }
  };

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

          <div className="space-y-4">
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

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-card"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 text-text-muted ${isDarkMode ? 'bg-bg-card' : 'bg-white'}`}>Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-border-card hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-50 ${
                isDarkMode ? 'text-text-main' : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  style={{ fill: '#4285F4' }}
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  style={{ fill: '#34A853' }}
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  style={{ fill: '#FBBC05' }}
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  style={{ fill: '#EA4335' }}
                />
              </svg>
              Sign in with Google
            </button>
          </div>
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
