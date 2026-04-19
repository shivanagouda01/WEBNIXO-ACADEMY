import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  LogOut, 
  Mail, 
  BookOpen, 
  Shield, 
  Terminal,
  ChevronRight,
  Eye,
  EyeOff,
  Phone,
  Tag,
  Plus,
  Trash2,
  Lock,
  IndianRupee,
  ToggleLeft as Toggle,
  ToggleRight
} from 'lucide-react';
import { AppUser, CourseSetting } from '../types';
import { COURSES } from '../constants';

interface AdminDashboardProps {
  students: AppUser[];
  isDarkMode: boolean;
  onLogout: () => void;
  programPrice: number;
  onUpdatePrice: (price: number) => void;
  courseSettings: Record<string, CourseSetting>;
  onUpdateCourseSetting: (setting: CourseSetting) => void;
  coupons: { code: string; discount: number }[];
  onAddCoupon: (code: string, discount: number) => void;
  onRemoveCoupon: (code: string) => void;
}

export default function AdminDashboard({ 
  students, 
  isDarkMode, 
  onLogout,
  programPrice,
  onUpdatePrice,
  courseSettings,
  onUpdateCourseSetting,
  coupons,
  onAddCoupon,
  onRemoveCoupon
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  const validStudents = Array.isArray(students) ? students : [];

  const filteredStudents = validStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.phoneNumber && student.phoneNumber.includes(searchTerm))
  );

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#080b11] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 pb-20`}>
      {/* Header */}
      <nav className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-[#05070a]/80 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-xl px-6 py-4 mb-10`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-xl">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight">Admin <span className="text-red-500 text-sm align-top ml-1 uppercase">HQ</span></h1>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none">Management Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full glass border border-white/10 mr-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary" />
                <span className="text-xs font-bold text-text-muted">Total Students: <span className="text-text-main">{students.length}</span></span>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics or Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[32px] bg-bg-card border border-border-card relative overflow-hidden group"
          >
            <div className="relative z-10">
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Total Students</p>
              <h3 className="text-4xl font-bold">{students.length}</h3>
              <p className="text-xs text-green-500 mt-2 font-bold">+ {students.length > 5 ? '12%' : 'Active'}</p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <Users className="text-brand-primary w-6 h-6" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[32px] bg-bg-card border border-border-card relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Enrolled Courses</p>
              <h3 className="text-4xl font-bold">{students.reduce((acc, curr) => acc + curr.enrolledCourses.length, 0)}</h3>
              <p className="text-xs text-blue-500 mt-2 font-bold">Total Purchases</p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-blue-500 w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[32px] bg-bg-card border border-border-card relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">System Status</p>
              <h3 className="text-4xl font-bold text-green-500">Live</h3>
              <p className="text-xs text-text-muted mt-2 font-bold">Secure Connection</p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <Shield className="text-green-500 w-6 h-6" />
            </div>
          </motion.div>
        </div>

        {/* Platform Management */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Individual Course Pricing & Status */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[32px] bg-bg-card border border-border-card"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl">Course Fees & Status</h3>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {COURSES.map((course) => {
                const setting = courseSettings[course.id] || { course_id: course.id, price: programPrice, is_live: true };
                return (
                  <div key={course.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-text-main">{course.title}</h4>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">{course.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">₹</span>
                        <input 
                          type="number" 
                          value={setting.price}
                          onChange={(e) => onUpdateCourseSetting({ ...setting, price: Number(e.target.value) })}
                          className="w-24 bg-[#05070a] border border-white/10 rounded-xl pl-6 pr-2 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary transition-all font-mono font-bold"
                        />
                      </div>
                      <button 
                        onClick={() => onUpdateCourseSetting({ ...setting, is_live: !setting.is_live })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                          setting.is_live 
                            ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
                            : 'bg-white/5 border-white/10 text-text-muted'
                        }`}
                      >
                        {setting.is_live ? <ToggleRight className="w-5 h-5" /> : <Toggle className="w-5 h-5" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{setting.is_live ? 'Live' : 'Draft'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Global Pricing Context */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-[32px] bg-bg-card border border-border-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl">Global Defaults</h3>
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Fallback Fee (₹)</label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    value={programPrice}
                    onChange={(e) => onUpdatePrice(Number(e.target.value))}
                    className="flex-grow bg-[#05070a]/50 border border-white/10 rounded-2xl px-6 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all font-mono text-xl font-bold"
                  />
                  <div className="px-6 py-4 bg-brand-primary/10 text-brand-primary rounded-2xl font-bold flex items-center">
                    Active
                  </div>
                </div>
                <p className="text-xs text-text-muted italic">Used for courses without custom pricing.</p>
              </div>
            </motion.div>

            {/* Coupon Management */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-[32px] bg-bg-card border border-border-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl">Discount Coupons</h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-grow space-y-2">
                    <input 
                      type="text" 
                      placeholder="CODE (e.g. WELCOME50)"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-[#05070a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                    <input 
                      type="number" 
                      placeholder="Discount Amount (₹)"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="w-full bg-[#05070a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (newCouponCode && newCouponDiscount) {
                        onAddCoupon(newCouponCode, Number(newCouponDiscount));
                        setNewCouponCode('');
                        setNewCouponDiscount('');
                      }
                    }}
                    className="px-6 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] uppercase">Add</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {coupons.map((coupon) => (
                    <div key={coupon.code} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-400">{coupon.code}</span>
                        <span className="text-xs text-text-muted">— ₹{coupon.discount} Off</span>
                      </div>
                      <button 
                        onClick={() => onRemoveCoupon(coupon.code)}
                        className="p-1.5 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {coupons.length === 0 && (
                    <p className="text-center py-4 text-text-muted text-xs italic">No active coupons</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email, or Login ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-card border border-border-card rounded-2xl pl-14 pr-6 py-5 text-text-main focus:outline-none focus:border-brand-primary transition-all font-display"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="bg-bg-card border border-border-card rounded-[32px] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-card bg-white/5">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-text-muted">Student</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-text-muted">Login ID</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-text-muted">Password</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-text-muted">Enrolled Courses</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-card">
                <AnimatePresence>
                  {filteredStudents.map((student, i) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-primary/20">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-text-main text-lg">{student.name}</div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                <Mail className="w-3 h-3 text-brand-primary" />
                                {student.email}
                              </div>
                              {student.phoneNumber && (
                                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                  <Phone className="w-3 h-3 text-brand-primary" />
                                  {student.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
                          <Terminal className="w-4 h-4 text-brand-primary" />
                          <span className="font-mono font-bold text-brand-primary text-sm">{student.loginId}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 min-w-[140px]">
                            <Lock className="w-4 h-4 text-red-500" />
                            <span className="font-mono font-bold text-text-main">
                              {showPasswords[student.id] ? student.password : '••••••••'}
                            </span>
                          </div>
                          <button 
                            onClick={() => togglePassword(student.id)}
                            className="p-2 rounded-xl border border-border-card hover:bg-white/10 transition-colors text-text-muted hover:text-text-main"
                          >
                            {showPasswords[student.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {student.enrolledCourses.map((courseId, idx) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-tight"
                            >
                              {courseId}
                            </span>
                          ))}
                          {student.enrolledCourses.length === 0 && <span className="text-text-muted text-xs">None</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <div className="hidden sm:block flex-grow max-w-[100px] h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-sm font-bold text-brand-primary w-12">{student.progress}%</span>
                          <ChevronRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-text-main">{student.name}</h4>
                    <p className="text-xs text-text-muted">{student.email}</p>
                    {student.phoneNumber && (
                      <p className="text-[10px] text-brand-primary font-bold mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {student.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-brand-primary">{student.progress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Login ID</span>
                    <div className="flex items-center gap-2 font-mono text-xs text-brand-primary font-bold">
                      <Terminal className="w-3 h-3" />
                      {student.loginId}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Password</span>
                    <button 
                      onClick={() => togglePassword(student.id)}
                      className="flex items-center gap-2 font-mono text-xs text-text-main font-bold"
                    >
                      <Lock className="w-3 h-3 text-red-500" />
                      {showPasswords[student.id] ? student.password : '••••••••'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest block mb-2">Enrolled Courses</span>
                  <div className="flex flex-wrap gap-2">
                    {student.enrolledCourses.map((courseId, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-bold"
                      >
                        {courseId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="py-20 text-center">
              <Users className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No students found</h3>
              <p className="text-text-muted">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
