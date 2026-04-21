import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import WhyChoose from './components/WhyChoose';
import Instructor from './components/Instructor';
import CertificateSection from './components/Certificate';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import PolicyModal from './components/PolicyModal';
import Dashboard from './components/Dashboard';
import PurchaseFlow from './components/PurchaseFlow';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CertificateVerification from './components/CertificateVerification';
import { AppUser, CourseCertificate, CourseSetting } from './types';
import { INITIAL_USER, COURSES } from './constants';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'login' | 'verify' | 'admin-login' | 'admin-dashboard'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCourseForPurchase, setSelectedCourseForPurchase] = useState<{ id: string; title: string } | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<'refund' | 'privacy' | 'terms' | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse currentUser from localStorage', e);
      return null;
    }
  });
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  const [users, setUsers] = useState<AppUser[]>([INITIAL_USER]);
  const [programPrice, setProgramPrice] = useState(199);
  const [courseSettings, setCourseSettings] = useState<Record<string, CourseSetting>>({});
  const [coupons, setCoupons] = useState<{ code: string; discount: number }[]>([
    { code: 'WELCOME50', discount: 50 }
  ]);
  const [certificates, setCertificates] = useState<CourseCertificate[]>([
    {
      code: 'WXN-PY-2026-A1B2',
      studentName: 'Shivanagouda',
      courseName: 'Python Mastery',
      date: '2026-04-10'
    }
  ]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id');
      const status = urlParams.get('status');

      if (orderId && status === 'verify') {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/payment/verify/${orderId}`);
          const data = await response.json();

          if (data.status === 'SUCCESS') {
            // Find user data from temporary storage if available, or fetch from registration
            // For now, let's just show a message. In a real app, you'd associate this.
            alert('Payment Verified Successfully! Please login to your dashboard.');
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            alert('Payment verification pending or failed. Please contact support.');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkPaymentStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && !error) {
          const supabaseUsers: AppUser[] = data.map(reg => ({
            id: reg.id.toString(),
            name: reg.full_name,
            email: reg.email,
            phoneNumber: reg.phone_number,
            loginId: reg.login_id,
            password: reg.password,
            certificateId: reg.certificate_id,
            progress: 0,
            xp: 0,
            streak: 1,
            completedLessons: [],
            enrolledCourses: [reg.course_id],
            badges: [{ id: 'b1', name: 'Beginner', icon: '🌱', unlocked: true }]
          }));

          // Merge local users with Supabase users, avoiding duplicates by loginId
          setUsers(prev => {
            const existingIds = new Set(prev.map(u => u.loginId));
            const newOnes = supabaseUsers.filter(u => !existingIds.has(u.loginId));
            return [...prev, ...newOnes];
          });
        }
      } catch (err) {
        console.error('Failed to fetch from Supabase:', err);
      }
    };

    if (isAdminLoggedIn) {
      fetchRegistrations();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const fetchCourseSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('course_settings')
          .select('*');

        if (data && !error) {
          const settingsMap: Record<string, CourseSetting> = {};
          data.forEach(s => {
            settingsMap[s.course_id] = s;
          });
          setCourseSettings(settingsMap);
        }
      } catch (err) {
        console.error('Failed to fetch course settings:', err);
      }
    };

    fetchCourseSettings();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*');

        if (data && !error) {
          setCoupons(data);
        }
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      }
    };

    fetchCoupons();
  }, []);

  const addCoupon = async (code: string, discount: number) => {
    try {
      setCoupons(prev => [...prev, { code, discount }]);
      const { error } = await supabase
        .from('coupons')
        .insert([{ code, discount }]);
      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to add coupon:', err);
      const errorMessage = err?.message || 'Unknown error';
      alert(`Failed to add coupon: ${errorMessage}`);
    }
  };

  const removeCoupon = async (code: string) => {
    try {
      setCoupons(prev => prev.filter(c => c.code !== code));
      const { error } = await supabase
        .from('coupons')
        .delete()
        .match({ code });
      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to remove coupon:', err);
      const errorMessage = err?.message || 'Unknown error';
      alert(`Failed to remove coupon: ${errorMessage}`);
    }
  };

  const updateCourseSetting = async (setting: CourseSetting) => {
    try {
      // Optimistic update
      setCourseSettings(prev => ({ ...prev, [setting.course_id]: setting }));

      const { error } = await supabase
        .from('course_settings')
        .upsert({
          course_id: setting.course_id,
          price: setting.price,
          is_live: setting.is_live,
          updated_at: new Date().toISOString()
        }, { onConflict: 'course_id' });

      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to update course settings:', err);
      const errorMessage = err?.message || 'Unknown error';
      alert(`Failed to save settings: ${errorMessage}. Please check your Supabase connection and table RLS policies.`);
    }
  };

  const handleNavigate = (page: 'home' | 'dashboard' | 'login' | 'verify' | 'admin-login' | 'admin-dashboard') => {
    if (page === 'dashboard' && !currentUser) {
      setCurrentPage('login');
      return;
    }
    if (page === 'admin-dashboard' && !isAdminLoggedIn) {
      setCurrentPage('admin-login');
      return;
    }
    if (page === 'admin-login' && isAdminLoggedIn) {
      setCurrentPage('admin-dashboard');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 800);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = async (loginId: string, password: string) => {
    setIsLoading(true);
    try {
      // First check local state for demo/test users
      const localUser = users.find(u => u.loginId === loginId && u.password === password);
      
      if (localUser) {
        setCurrentUser(localUser);
        setTimeout(() => {
          setCurrentPage('dashboard');
          setIsLoading(false);
          window.scrollTo(0, 0);
        }, 800);
        return;
      }

      // If not found locally, check Supabase
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('login_id', loginId)
        .eq('password', password)
        .single();

      if (data && !error) {
        const dbUser: AppUser = {
          id: data.id.toString(),
          name: data.full_name,
          email: data.email,
          phoneNumber: data.phone_number,
          loginId: data.login_id,
          password: data.password,
          certificateId: data.certificate_id,
          progress: 0,
          xp: 0,
          streak: 1,
          completedLessons: [],
          enrolledCourses: [data.course_id],
          badges: [{ id: 'b1', name: 'Beginner', icon: '🌱', unlocked: true }]
        };
        
        // Update local users list and set current user
        setUsers(prev => {
          if (prev.some(u => u.loginId === dbUser.loginId)) return prev;
          return [...prev, dbUser];
        });
        
        setCurrentUser(dbUser);
        
        setTimeout(() => {
          setCurrentPage('dashboard');
          setIsLoading(false);
          window.scrollTo(0, 0);
        }, 800);
      } else {
        setIsLoading(false);
        alert('Invalid Login ID or Password. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleAdminLogin = (loginId: string, password: string) => {
    const adminId = import.meta.env.VITE_ADMIN_ID || '18139649';
    const adminPwd = import.meta.env.VITE_ADMIN_PASSWORD || 'St0ck@458';
    
    if (loginId === adminId && password === adminPwd) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage('admin-dashboard');
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, 800);
    } else {
      alert('Invalid Admin Credentials Access Denied');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
    handleNavigate('home');
  };

  const handlePurchaseSuccess = (userData: any) => {
    const newUser: AppUser = {
      id: Math.random().toString(36).slice(2, 9),
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      loginId: userData.loginId,
      password: userData.password,
      progress: 0,
      xp: 0,
      streak: 1,
      completedLessons: [],
      enrolledCourses: [selectedCourseForPurchase?.id || 'python'],
      badges: [
        { id: 'b1', name: 'Beginner', icon: '🌱', unlocked: true }
      ]
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    handleNavigate('dashboard');
  };

  if (isLoading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'} z-[100]`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-brand-primary">Webnixo Academy</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? '' : 'light'}`}>
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative flex flex-col flex-grow"
          >
            <Navbar 
              onNavigate={handleNavigate} 
              currentPage={currentPage} 
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              isLoggedIn={!!currentUser}
              onLogout={handleLogout}
            />
            
            <main className="flex-grow">
              <Hero onNavigate={handleNavigate} />
              <Courses 
                onBuy={(course) => setSelectedCourseForPurchase(course)} 
                courseSettings={courseSettings}
                defaultPrice={programPrice}
              />
              <WhyChoose />
              <Instructor />
              <CertificateSection />
              <Testimonials />
              <FAQ />
            </main>

            <Footer onNavigate={(page) => {
              if (['refund', 'privacy', 'terms'].includes(page)) {
                setSelectedPolicy(page as any);
              } else {
                handleNavigate(page);
              }
            }} />

            {/* Global Watermark */}
            <div className="watermark">Webnixo</div>

            {/* Policy Modals */}
            <AnimatePresence>
              {selectedPolicy && (
                <PolicyModal 
                  type={selectedPolicy}
                  onClose={() => setSelectedPolicy(null)}
                  isDarkMode={isDarkMode}
                />
              )}
            </AnimatePresence>

            {/* Purchase Flow Modal */}
            <AnimatePresence>
              {selectedCourseForPurchase && (
                <PurchaseFlow 
                  course={selectedCourseForPurchase}
                  onClose={() => setSelectedCourseForPurchase(null)}
                  onSuccess={handlePurchaseSuccess}
                  isDarkMode={isDarkMode}
                  basePrice={courseSettings[selectedCourseForPurchase.id]?.price || programPrice}
                  availableCoupons={coupons}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : currentPage === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Login 
              onLogin={handleLogin} 
              onBack={() => handleNavigate('home')} 
              isDarkMode={isDarkMode} 
            />
          </motion.div>
        ) : currentPage === 'admin-login' ? (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <AdminLogin 
              onLogin={handleAdminLogin} 
              onBack={() => handleNavigate('home')} 
              isDarkMode={isDarkMode} 
            />
          </motion.div>
        ) : currentPage === 'admin-dashboard' ? (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <AdminDashboard 
              students={users}
              isDarkMode={isDarkMode} 
              onLogout={handleLogout}
              programPrice={programPrice}
              onUpdatePrice={setProgramPrice}
              courseSettings={courseSettings}
              onUpdateCourseSetting={updateCourseSetting}
              coupons={coupons}
              onAddCoupon={addCoupon}
              onRemoveCoupon={removeCoupon}
            />
          </motion.div>
        ) : currentPage === 'verify' ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <CertificateVerification 
              onBack={() => handleNavigate('home')} 
              isDarkMode={isDarkMode}
              certificates={certificates}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard 
              user={currentUser!} 
              isDarkMode={isDarkMode} 
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              onGenerateCertificate={(cert) => setCertificates(prev => [...prev, cert])}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
