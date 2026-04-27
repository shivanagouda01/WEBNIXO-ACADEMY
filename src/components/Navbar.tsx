import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, User as UserIcon, Menu, Sun, Moon, LogOut, Award, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'dashboard' | 'login' | 'verify') => void;
  currentPage: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ onNavigate, currentPage, isDarkMode, onToggleTheme, isLoggedIn, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', href: '#courses' },
    { label: 'Instructor', href: '#instructor' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleMobileNav = (page: any) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-4 md:px-6 py-3">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleMobileNav('home')}
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Code2 className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight">
            Webnixo <span className="text-brand-primary">Academy</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className="text-sm font-medium text-text-muted hover:text-text-main transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={() => onNavigate('verify')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'verify' ? 'text-brand-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            <Award className="w-4 h-4" />
            Verify Certificate
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-main"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
          
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                    currentPage === 'dashboard' 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-text-main'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Dashboard</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                  currentPage === 'login' 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-text-main'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Login</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden glass-dark p-1.5 sm:p-2 rounded-xl text-text-main border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[40] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm p-8 shadow-2xl lg:hidden z-[50] flex flex-col ${
                isDarkMode ? 'bg-[#0a0c10] text-white' : 'bg-white text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display font-black text-xl tracking-tight">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {[...navLinks, { label: 'Verify Certificate', href: '#verify', action: () => handleMobileNav('verify'), icon: Award }].map((item: any, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    key={item.label}
                  >
                    <a 
                      href={item.action ? undefined : item.href}
                      onClick={(e) => {
                        if (item.action) { e.preventDefault(); item.action(); }
                        else setIsMobileMenuOpen(false);
                      }}
                      className="text-2xl font-black flex items-center gap-3 hover:text-brand-primary transition-colors py-2"
                    >
                      {item.icon && <item.icon className="w-6 h-6 text-brand-primary" />}
                      {item.label}
                    </a>
                  </motion.div>
                ))}
                
                <div className="h-px bg-white/5 my-4" />
                
                <div className="flex flex-col gap-4 mt-auto mb-8">
                  {isLoggedIn ? (
                    <>
                      <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => handleMobileNav('dashboard')}
                        className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-brand-primary text-white font-black text-lg shadow-xl shadow-brand-primary/20"
                      >
                        <UserIcon className="w-6 h-6" />
                        Go to Dashboard
                      </motion.button>
                      <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-lg"
                      >
                        <LogOut className="w-6 h-6" />
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => handleMobileNav('login')}
                      className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-brand-primary text-white font-black text-lg shadow-xl shadow-brand-primary/20"
                    >
                      <UserIcon className="w-6 h-6" />
                      Student Login
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
