import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경 변수 확인을 위한 로그
console.log('=== Supabase Environment Variables Check ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase URL length:', supabaseUrl.length);
console.log('Supabase Anon Key length:', supabaseAnonKey.length);
console.log('==========================================');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables are not properly set!');
} else {
    console.log('✅ Supabase environment variables are properly set!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 