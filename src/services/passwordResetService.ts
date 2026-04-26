import { supabase } from '../lib/supabase';

export const passwordResetService = {
  // 1. Generate and save OTP
  async sendOTP(email: string) {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('registrations')
      .select('full_name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error('No account found with this email address.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expire in 10 mins

    // Save OTP to DB
    const { error: otpError } = await supabase
      .from('password_resets')
      .insert([{ 
        email, 
        otp, 
        expires_at: expiresAt.toISOString() 
      }]);

    if (otpError) throw otpError;

    // In a real app, you'd call an API to send the email here
    // For now, I'll log it to console and return success
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    
    // Call our internal API to simulate sending
    try {
      await fetch('/api/mail/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name: user.full_name })
      });
    } catch (e) {
      console.warn('Mail API failed, but OTP is generated in DB:', e);
    }

    return true;
  },

  // 2. Verify OTP
  async verifyOTP(email: string, otp: string) {
    const { data, error } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error('Invalid or expired OTP.');
    }

    return true;
  },

  // 3. Reset Password
  async resetPassword(email: string, newPassword: string) {
    console.log(`Attempting password reset for: ${email}`);
    
    const { data, error, count } = await supabase
      .from('registrations')
      .update({ password: newPassword })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Supabase Reset Error:', error);
      throw new Error(`Cloud update failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('No registration found for email:', email);
      throw new Error('No account found with this email to update.');
    }

    console.log(`Password updated successfully for ${data.length} account(s).`);

    // Clean up OTPs for this email
    try {
      await supabase.from('password_resets').delete().eq('email', email);
    } catch (e) {
      console.warn('OTP cleanup failed, but password was reset:', e);
    }

    return true;
  }
};
