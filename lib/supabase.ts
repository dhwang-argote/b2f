import { apiRequest } from './queryClient';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ;

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create the Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Plans services
export async function getPlans() {
  return await fetch('/api/plans', {
    credentials: 'include',
  });
}

export async function getPlan(id: number) {
  return await fetch(`/api/plans/${id}`, {
    credentials: 'include',
  });
}

// FAQ services
export async function getFAQs() {
  return await apiRequest('GET', '/api/faqs');
}

// Testimonials services
export async function getTestimonials() {
  return await apiRequest('GET', '/api/testimonials');
}

