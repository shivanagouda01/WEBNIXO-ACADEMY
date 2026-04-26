import { supabase } from '../lib/supabase';

export interface RegistrationData {
  full_name: string;
  email: string;
  phone_number: string;
  login_id: string;
  password: string;
  university?: string;
  course_id: string;
  course_title: string;
  amount: number;
  payment_method: string;
  payment_id: string;
  certificate_id: string;
}

export const syncRegistrationToCloud = async (data: RegistrationData) => {
  console.log('Syncing registration to Supabase:', { 
    login_id: data.login_id, 
    email: data.email, 
    payment_id: data.payment_id 
  });

  try {
    const { data: result, error } = await supabase
      .from('registrations')
      .insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          login_id: data.login_id,
          password: data.password,
          university: data.university || '',
          course_id: data.course_id,
          course_title: data.course_title,
          amount: Number(data.amount) || 0,
          payment_method: data.payment_method,
          payment_id: data.payment_id,
          certificate_id: data.certificate_id,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Sync Error:', error);
      // Check for duplicate login_id (code 23505)
      if (error.code === '23505') {
        console.log('User already exists in cloud, skipping insert.');
        return { success: true, alreadyExists: true };
      }
      return { success: false, error: error.message, code: error.code };
    }

    console.log('Successfully synced to cloud:', result);
    return { success: true, data: result };
  } catch (err: any) {
    console.error('Unexpected Supabase error:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
};
