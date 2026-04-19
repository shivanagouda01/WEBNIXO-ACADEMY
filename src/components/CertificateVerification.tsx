import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle2, XCircle, ArrowLeft, Copy, Check, Award, Calendar, User as UserIcon, BookOpen } from 'lucide-react';
import { CourseCertificate } from '../types';

interface CertificateVerificationProps {
  onBack: () => void;
  isDarkMode: boolean;
  certificates: CourseCertificate[];
}

export default function CertificateVerification({ onBack, isDarkMode, certificates }: CertificateVerificationProps) {
  const [code, setCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<CourseCertificate | null | 'not_found'>(null);
  const [copied, setCopied] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResult(null);

    // Simulate verification delay
    setTimeout(() => {
      const found = certificates.find(c => c.code.toUpperCase() === code.toUpperCase());
      setResult(found || 'not_found');
      setIsSearching(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (result && typeof result !== 'string') {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#05070a]' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto pt-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <Award className="text-brand-primary w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Verify Your Certificate</h1>
          <p className="text-text-muted max-w-xl mx-auto">
            Enter the unique verification code found on your Webnixo Academy certificate to validate its authenticity.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleVerify} className="relative group">
            <input 
              required
              type="text"
              placeholder="Enter Verification Code (e.g., WXN-PY-2026-XXXX)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-bg-card border border-border-card rounded-[24px] pl-6 pr-32 py-6 text-xl font-mono text-text-main focus:outline-none focus:border-brand-primary transition-all shadow-xl"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-brand-primary rounded-[18px] font-bold text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
            >
              {isSearching ? <Search className="w-5 h-5 animate-spin" /> : 'Verify'}
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {result === 'not_found' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 text-center"
            >
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Invalid Certificate Code</h3>
              <p className="text-text-muted">We couldn't find any certificate matching this code. Please check for typos and try again.</p>
            </motion.div>
          )}

          {result && typeof result !== 'string' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-[32px] bg-green-500/5 border border-green-500/20"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3 aspect-[4/3] bg-bg-card border border-border-card rounded-2xl flex items-center justify-center relative overflow-hidden group">
                  <Award className="w-20 h-20 text-brand-primary/20 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-[8px] font-mono text-text-muted truncate">
                    {result.code}
                  </div>
                </div>

                <div className="flex-grow space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified & Valid</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-text-muted">
                        <UserIcon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Student Name</span>
                      </div>
                      <p className="text-xl font-bold">{result.studentName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-text-muted">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Course Name</span>
                      </div>
                      <p className="text-xl font-bold">{result.courseName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Issue Date</span>
                      </div>
                      <p className="text-xl font-bold">{result.date}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Award className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Verification Code</span>
                      </div>
                      <p className="text-xl font-mono font-bold text-brand-primary">{result.code}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-4">
            Official Verification Portal
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Award className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-lg">Webnixo Academy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
