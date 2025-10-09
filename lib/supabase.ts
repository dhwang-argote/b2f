import { apiRequest } from './queryClient';
import { createClient } from '@supabase/supabase-js';

// Define hardcoded fallback values from the .env file we found
// const FALLBACK_URL = 'https://sczllrrloyywctmmrwke.supabase.co';
// const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjemxscnJsb3l5d2N0bW1yd2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzc0NTcsImV4cCI6MjA2MjkxMzQ1N30.UoFYfQwQE6sEgdyF2wA60ov_EyJD8H2D0tYvag-Dpdw';

// Try to get values from environment, fall back to hardcoded values if needed
// const supabaseUrl = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL : FALLBACK_URL;
// const supabaseAnonKey = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY : FALLBACK_KEY;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ;

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create the Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log status of Supabase connection
if (supabaseUrl && supabaseAnonKey) {
  console.log('Supabase client initialized with anon key');
} else {
  console.error('Supabase client-side credentials not available');
}

// Authentication services
export async function registerUser(userData: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}) {
  return await apiRequest('POST', '/api/auth/register', userData);
}

export async function loginUser(credentials: { 
  email: string;
  password: string;
}) {
  // Add a timestamp to help avoid caching issues
  const timestamp = new Date().getTime();
  return await apiRequest('POST', `/api/auth/login?_t=${timestamp}`, credentials);
}

export async function logoutUser() {
  return await apiRequest('POST', '/api/auth/logout');
}

export async function getSession() {
  return await fetch('/api/auth/session', {
    credentials: 'include',
  });
}

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

// User challenges services
export async function createUserChallenge(planId: number, transactionId: string) {
  return await apiRequest('POST', '/api/user-challenges', { planId, transactionId });
}

export async function getUserChallenges() {
  return await fetch('/api/user-challenges', {
    credentials: 'include',
  });
}

export async function getUserChallenge(id: number) {
  return await fetch(`/api/user-challenges/${id}`, {
    credentials: 'include',
  });
}

// Trade services
export async function createTrade(tradeData: {
  challengeId: number;
  sport: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
}) {
  return await apiRequest('POST', '/api/trades', tradeData);
}

export async function getTradesByChallenge(challengeId: number) {
  return await fetch(`/api/trades/challenge/${challengeId}`, {
    credentials: 'include',
  });
}
