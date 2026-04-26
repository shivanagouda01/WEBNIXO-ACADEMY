import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, KeyRound, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { passwordResetService } from '../services/passwordResetService';

interface ForgotPasswordProps {
  isDarkMode: boolean;
  onBack: () => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword({ isDarkMode, onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await passwordResetService.sendOTP(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await passwordResetService.verifyOTP(email, otp);
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await passwordResetService.resetPassword(email, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-2xl relative overflow-hidden`}
          >
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center mt-8 mb-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter your registered email to receive an OTP
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none ${
                      isDarkMode 
                        ? 'bg-black/20 border-white/10 focus:border-blue-500/50 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-500/50 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                We've sent a 6-digit code to <br/><span className="text-blue-500 font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">6-Digit OTP</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none text-center text-2xl tracking-[0.5em] font-mono ${
                      isDarkMode 
                        ? 'bg-black/20 border-white/10 focus:border-amber-500/50 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-amber-500/50 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify OTP <CheckCircle2 className="w-5 h-5" /></>}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className={`w-full text-sm font-medium ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
              >
                Request a new code
              </button>
            </form>
          </motion.div>
        )}

        {step === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">New Password</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Create a strong password for your account
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-4 rounded-2xl border transition-all outline-none ${
                      isDarkMode 
                        ? 'bg-black/20 border-white/10 focus:border-emerald-500/50 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-emerald-500/50 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-4 rounded-2xl border transition-all outline-none ${
                      isDarkMode 
                        ? 'bg-black/20 border-white/10 focus:border-emerald-500/50 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-emerald-500/50 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-2xl text-center`}
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
            <p className={`text-sm mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Your password has been changed successfully. You can now log in with your new password.
            </p>
            <button
              onClick={onBack}
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
