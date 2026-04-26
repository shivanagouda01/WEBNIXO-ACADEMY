import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  Star, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Copy, 
  Terminal, 
  Check,
  Award,
  Zap,
  Clock,
  Layout,
  User as UserIcon,
  Moon,
  Sun,
  Search,
  Download,
  X
} from 'lucide-react';
import { CURRICULUM, INITIAL_USER, COURSES } from '../constants';
import { Module, Lesson, AppUser, CourseCertificate } from '../types';
import confetti from 'canvas-confetti';
import ProfessionalCertificate from './ProfessionalCertificate';

interface DashboardProps {
  user: AppUser;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  onGenerateCertificate: (cert: CourseCertificate) => void;
}

export default function Dashboard({ user, isDarkMode, onToggleTheme, onLogout, onGenerateCertificate }: DashboardProps) {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [generatedCert, setGeneratedCert] = useState<CourseCertificate | null>(null);

  // Filter courses from the global list based on user enrollment
  const enrolledCoursesList = COURSES.filter(course => user.enrolledCourses.includes(course.id));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleModuleClick = (module: Module) => {
    if (!module.isLocked) {
      setSelectedModule(module);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
  };

  const handleCompleteLesson = () => {
    if (selectedLesson) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#9333ea', '#ffffff']
      });
      
      setSelectedLesson(null);
    }
  };

  const handleGenerateCertificate = () => {
    const code = user.certificateId || `CERT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const cert: CourseCertificate = {
      code,
      studentName: user.name,
      courseName: 'Python Mastery',
      date: new Date().toISOString().split('T')[0]
    };
    setGeneratedCert(cert);
    onGenerateCertificate(cert);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#05070a] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Top Navigation */}
      <nav className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-[#05070a]/80 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-xl px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              setActiveCourseId(null);
              setSelectedModule(null);
              setSelectedLesson(null);
            }}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
                <Terminal className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">Webnixo</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5 text-orange-500"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>{user.streak} Day Streak</span>
              </motion.div>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{user.xp} XP</span>
              </div>
            </div>
            
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!activeCourseId ? (
            /* Dashboard Welcome & My Courses List */
            <motion.div
              key="welcome-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <header className="py-12 relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    Welcome back, <span className="text-gradient inline-block">
                      {user.name.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span> 👋
                  </h1>
                  <p className="text-text-muted text-lg max-w-xl">
                    Continue your learning journey with Webnixo. You have access to {enrolledCoursesList.length} premium course(s).
                  </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
              </header>

              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Layout className="w-6 h-6 text-brand-primary" />
                  My Enrolled Courses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCoursesList.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group relative p-8 rounded-[32px] bg-bg-card border border-border-card hover:border-brand-primary/50 transition-all flex flex-col h-full overflow-hidden"
                    >
                      <div className="mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                          Enrolled
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{course.title}</h3>
                      
                      <div className="mt-auto space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-text-muted">Progress</span>
                            <span className="text-brand-primary">{user.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${user.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveCourseId(course.id)}
                          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-brand-primary/20"
                        >
                          Start Learning <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Subtle Watermark */}
                      <div className="absolute top-4 right-4 text-4xl opacity-[0.03] font-bold select-none italic">
                        Webnixo
                      </div>
                    </motion.div>
                  ))}

                  {enrolledCoursesList.length === 0 && (
                    <div className="col-span-full py-20 text-center rounded-[32px] bg-white/[0.02] border border-dashed border-border-card">
                      <p className="text-text-muted mb-4 uppercase tracking-widest font-bold text-xs">No courses enrolled yet</p>
                      <button 
                        onClick={onLogout}
                        className="text-brand-primary font-bold hover:underline"
                      >
                        Explore our premium courses
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : !selectedModule ? (
            /* Module List for Active Course */
            <motion.div
              key="modules-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setActiveCourseId(null)}
                className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to My Courses
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        {COURSES.find(c => c.id === activeCourseId)?.title} - Modules
                      </h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Search topics..."
                          className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CURRICULUM.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).map((module) => (
                        <motion.button
                          key={module.id}
                          whileHover={!module.isLocked ? { scale: 1.02, y: -4 } : {}}
                          whileTap={!module.isLocked ? { scale: 0.98 } : {}}
                          onClick={() => handleModuleClick(module)}
                          className={`text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                            module.isLocked 
                              ? 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed' 
                              : 'bg-white/[0.03] border-white/10 hover:border-blue-500/50 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${module.isLocked ? 'bg-slate-800' : 'bg-blue-500/10 text-blue-500'}`}>
                              {module.isLocked ? <Lock className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{module.duration}</span>
                          </div>
                          
                          <h3 className="font-bold mb-2">{module.title}</h3>
                          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{module.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${module.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">{module.progress}%</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{module.lessonsCount} Lessons</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Download Resources Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Download className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold">Course Resources</h3>
                          <p className="text-xs text-text-muted">Download all materials</p>
                        </div>
                      </div>
                      <p className="text-sm text-text-muted mb-6">
                        Get offline access to all course videos, transcripts, and exercises in one ZIP file.
                      </p>
                      <a 
                        href="/courses.zip" 
                        download
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                      >
                        Download ZIP <Download className="w-4 h-4" />
                      </a>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  </motion.div>

                  <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Achievements
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {user.badges.map((badge) => (
                        <div 
                          key={badge.id}
                          className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${
                            badge.unlocked ? 'bg-white/10 shadow-lg' : 'bg-white/5 opacity-20 grayscale'
                          }`}
                          title={badge.name}
                        >
                          {badge.icon}
                        </div>
                      ))}
                    </div>
                  </section>
                  
                  {/* Certificate Generation */}
                  <section 
                    className={`p-6 rounded-[32px] border transition-all ${user.progress >= 100 ? 'shadow-xl' : 'opacity-60'}`}
                    style={user.progress >= 100 ? { backgroundColor: '#ffffff', borderColor: '#f1f5f9' } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                          <Award className="w-6 h-6 text-yellow-500" />
                          Official Course Certificate
                        </h3>
                        <p className="text-sm font-medium" style={{ color: '#64748b' }}>
                          {user.progress >= 100 
                             ? 'Congratulations! Your industry-recognized verified certificate is now available.'
                             : 'Complete all modules and assignments to unlock your official verification.'}
                        </p>
                      </div>
                      
                      {!generatedCert && !user.certificateId && user.progress >= 100 && (
                        <button 
                          onClick={handleGenerateCertificate}
                          className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:scale-105 shadow-xl shadow-brand-primary/20 transition-all flex items-center gap-3"
                        >
                          <Award className="w-5 h-5" />
                          Generate Now
                        </button>
                      )}
                    </div>

                    {(generatedCert || user.certificateId) ? (
                      <div className="space-y-8">
                        <div 
                          className="rounded-[40px] p-4 sm:p-10 border overflow-hidden"
                          style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                        >
                          <ProfessionalCertificate 
                            certificate={generatedCert || {
                              code: user.certificateId!,
                              studentName: user.name,
                              courseName: 'Python Mastery',
                              date: new Date().toISOString().split('T')[0]
                            }} 
                            isDarkMode={false} 
                          />
                        </div>
                      </div>
                    ) : user.progress < 100 && (
                      <div 
                        className="aspect-[1.5/1] rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center p-12 text-center group"
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                          <Award className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="font-medium max-w-xs uppercase tracking-widest text-[10px]" style={{ color: '#94a3b8' }}>
                          Complete the course to see your certificate here
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              </div>

              {/* Removed Certificate Modal Overlay */}
            </motion.div>
          ) : !selectedLesson ? (
            /* Lesson List View */
            <motion.div
              key="lessons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setSelectedModule(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-grow space-y-4 w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">{selectedModule.title}</h2>
                    <p className="text-slate-500">{selectedModule.description}</p>
                  </div>

                  {selectedModule.lessons.map((lesson, i) => (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleLessonSelect(lesson)}
                      className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          lesson.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {lesson.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-sm mb-1">{lesson.title}</h4>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">{lesson.duration} Read</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                    </motion.button>
                  ))}
                </div>

                <div className="w-full md:w-80 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h3 className="font-bold mb-4">Module Progress</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-white/10"
                          strokeDasharray="100, 100"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-500"
                          strokeDasharray={`${selectedModule.progress}, 100`}
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                        {selectedModule.progress}%
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold">{selectedModule.lessons.filter(l => l.status === 'completed').length} / {selectedModule.lessonsCount} Completed</p>
                      <p className="text-[10px] text-slate-500">Keep it up!</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors">
                    Continue Learning
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Lesson Content View */
            <motion.div
              key="lesson-content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setSelectedLesson(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Lessons
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedLesson.duration} Read</span>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Module: {selectedModule.title}</span>
                </div>
              </div>

              <div className="space-y-12">
                <header>
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold mb-6"
                  >
                    {selectedLesson.title.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.h1>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-300 leading-relaxed">
                      {selectedLesson.content}
                    </p>
                  </div>
                </header>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-blue-500" />
                    Code Example
                  </h3>
                  <div className="relative group">
                    <pre className="p-6 rounded-2xl bg-[#0d1117] border border-white/10 font-mono text-sm overflow-x-auto">
                      <code className="text-blue-400">{selectedLesson.codeExample}</code>
                    </pre>
                    <button className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </section>

                <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-8">
                  <h3 className="text-2xl font-bold">Practice Quiz</h3>
                  {selectedLesson.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      <p className="font-medium text-slate-200">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`p-4 rounded-xl border text-left text-sm transition-all ${
                              quizAnswers[qIdx] === oIdx 
                                ? oIdx === q.correctIndex 
                                  ? 'bg-green-500/10 border-green-500 text-green-500' 
                                  : 'bg-red-500/10 border-red-500 text-red-500'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Coding Challenge</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      <Zap className="w-3 h-3" /> +50 XP
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{selectedLesson.challenge.instruction}</p>
                  
                  <div className="space-y-4">
                    <div className="bg-[#0d1117] rounded-2xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">main.py</span>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                      </div>
                      <textarea 
                        className="w-full h-32 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
                        defaultValue={selectedLesson.challenge.initialCode}
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Terminal className="w-3 h-3" />
                        <span>Output</span>
                      </div>
                      <div className="text-green-400">
                        {`> Running main.py...`}
                        <br />
                        {`> ${selectedLesson.challenge.expectedOutput || 'Success!'}`}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleCompleteLesson}
                      className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Complete Lesson
                    </button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <div className="fixed bottom-20 right-10 pointer-events-none opacity-[0.03] rotate-[-15deg] select-none">
        <span className="text-4xl font-bold whitespace-nowrap">Webnixo by SHIVANAGOUDA PATIL</span>
      </div>
    </div>
  );
}
