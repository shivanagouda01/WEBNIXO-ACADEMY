import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  Loader2,
  Lock,
  ChevronRight,
  Mail,
  GraduationCap,
  Phone,
  Eye,
  EyeOff,
  User as UserIcon,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

interface PurchaseFlowProps {
  course: {
    id: string;
    title: string;
    price?: number;
  } | null;
  onClose: () => void;
  onSuccess: (userData: { name: string; email: string; phoneNumber: string; loginId: string; password?: string }) => void;
  isDarkMode: boolean;
  basePrice: number;
  availableCoupons: { code: string; discount: number }[];
}

type Step = 'registration' | 'payment' | 'success';

export default function PurchaseFlow({ course, onClose, onSuccess, isDarkMode, basePrice, availableCoupons }: PurchaseFlowProps) {
  const [step, setStep] = useState<Step>('registration');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCouponError, setIsCouponError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    university: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!course) return null;

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-transparent' };
    if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    if (formData.name && formData.email && formData.loginId) {
      setStep('payment');
    }
  };

  const currentPrice = Math.max(0, basePrice - appliedDiscount);

  const applyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      setAppliedDiscount(coupon.discount);
      setIsCouponError(false);
    } else {
      setAppliedDiscount(0);
      setIsCouponError(true);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Create order on our backend
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: currentPrice,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerId: formData.loginId,
          orderId: `order_${Math.random().toString(36).slice(2, 9)}`,
        }),
      });

      const orderData = await response.json();

      if (!orderData.payment_session_id) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // 2. Initialize Cashfree Checkout
      // Note: We expect Cashfree SDK was loaded in index.html
      const cashfree = (window as any).Cashfree({
        mode: "production" // or "sandbox" based on your env
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        returnUrl: `${window.location.origin}/?order_id={order_id}`,
      };

      // Redirecting to Cashfree Checkout
      // In a real app, you'd handle the response in the return URL
      // For this demo, we'll assume the user will be redirected back
      await cashfree.checkout(checkoutOptions);

      // Note: The code below might not run if redirected, 
      // but if using a popup it would. Cashfree checkout usually redirects.
      // We will handle the "success" part after the user returns in a real scenario.
      // For now, let's simulate the success just in case it doesn't redirect (some modes do popups)
      
      // Send data to Supabase (pre-emptive for now as we don't have webhook yet)
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.name,
            email: formData.email,
            phone_number: formData.phone,
            login_id: formData.loginId,
            password: formData.password,
            university: formData.university,
            course_id: course.id,
            course_title: course.title,
            amount: currentPrice,
            payment_method: paymentMethod,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Supabase Error:', error);
      }

      setIsProcessing(false);
      setStep('success');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#9333ea', '#ffffff']
      });
    } catch (err: any) {
      console.error('Payment failed:', err);
      setIsProcessing(false);
      alert(err.message || 'Payment initiation failed. Please check your internet connection and try again.');
    }
  };

  const handleStartLearning = () => {
    onSuccess({ 
      name: formData.name, 
      email: formData.email, 
      phoneNumber: formData.phone,
      loginId: formData.loginId,
      password: formData.password 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-xl overflow-hidden rounded-[32px] border border-border-card shadow-2xl ${
          isDarkMode ? 'bg-bg-main' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/10 p-2 rounded-xl">
              <Lock className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text-main">Secure Checkout</h3>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Webnixo Academy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'registration' && (
              <motion.div
                key="registration"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                  <div>
                    <h4 className="font-bold text-text-main">{course.title}</h4>
                    <p className="text-sm text-text-muted">Full Access • Certification Included</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-muted line-through">₹{basePrice * 5}</div>
                    <div className="text-2xl font-bold text-brand-primary flex flex-col items-end">
                      {appliedDiscount > 0 && (
                        <span className="text-[10px] text-green-500 font-bold -mb-1">
                          -₹{appliedDiscount} Off
                        </span>
                      )}
                      <span>₹{currentPrice}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        required
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        required
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        required
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        required
                        type="text"
                        placeholder="Create Login ID (Unique)"
                        value={formData.loginId}
                        onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                        className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                        <input 
                          required
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-12 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                        <input 
                          required
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                          <span className="text-text-muted">Password Strength:</span>
                          <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full transition-all duration-500 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} style={{ width: '33.33%' }} />
                          <div className={`h-full transition-all duration-500 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} style={{ width: '33.33%' }} />
                          <div className={`h-full transition-all duration-500 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} style={{ width: '33.33%' }} />
                        </div>
                      </div>
                    )}

                    <div className="relative group">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        type="text"
                        placeholder="University / College (Optional)"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full bg-bg-card border border-border-card rounded-2xl pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="flex gap-2">
                        <div className="relative flex-grow group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                          <input 
                            type="text"
                            placeholder="Coupon Code (Optional)"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              setIsCouponError(false);
                            }}
                            className={`w-full bg-bg-card border ${isCouponError ? 'border-red-500' : 'border-border-card'} rounded-xl pl-10 pr-4 py-3 text-sm text-text-main focus:outline-none focus:border-brand-primary transition-all`}
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={applyCoupon}
                          className="px-6 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedDiscount > 0 && (
                        <p className="text-[10px] text-green-500 font-bold mt-2 ml-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Coupon applied! ₹{appliedDiscount} discount saved.
                        </p>
                      )}
                      {isCouponError && (
                        <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">
                          Invalid coupon code.
                        </p>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-primary rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                  >
                    Proceed to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>100% Secure Payment • Instant Access</span>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h4 className="font-bold text-text-main">Order Summary</h4>
                  <div className="p-6 rounded-2xl bg-bg-card border border-border-card space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">{course.title}</span>
                      <span className="font-bold">₹{basePrice}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-500">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                        <span className="font-bold">- ₹{appliedDiscount}</span>
                      </div>
                    )}
                    <div className="h-px bg-border-card" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-brand-primary">₹{currentPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-text-main">Select Payment Method</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'upi', icon: Smartphone, label: 'UPI (PhonePe, Google Pay, etc.)' },
                      { id: 'card', icon: CreditCard, label: 'Debit / Credit Card' },
                      { id: 'netbanking', icon: Globe, label: 'Net Banking' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          paymentMethod === method.id 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-bg-card border-border-card text-text-muted hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="w-5 h-5" />
                          <span className="font-bold text-sm">{method.label}</span>
                        </div>
                        {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-brand-primary rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>Pay ₹{currentPrice} Now</>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    Founded by SHIVANAGOUDA PATIL
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-8"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h2>
                  <p className="text-text-muted">Your account is ready! Welcome to the academy.</p>
                </div>

                <div className="p-6 rounded-2xl bg-bg-card border border-border-card space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Login ID</span>
                    <span className="font-mono font-bold text-brand-primary">{formData.loginId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Enrolled In</span>
                    <span className="font-bold text-text-main">{course.title}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleStartLearning}
                    className="w-full py-4 bg-brand-primary rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                  >
                    Start Learning Now <ChevronRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      onSuccess({ 
                        name: formData.name, 
                        email: formData.email, 
                        phoneNumber: formData.phone,
                        loginId: formData.loginId,
                        password: formData.password 
                      });
                      onClose();
                    }}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-text-main hover:bg-white/10 transition-all font-display tracking-tight"
                  >
                    Login Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle Watermark */}
        <div className="absolute bottom-4 right-8 pointer-events-none opacity-[0.03] select-none">
          <span className="text-2xl font-bold italic">Webnixo</span>
        </div>
      </motion.div>
    </div>
  );
}
