import { createClient } from '@supabase/supabase-js';

async function initializeDatabase() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase credentials not available');
    return;
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL as string,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string
  );

  console.log('Checking Supabase connection and tables...');

  // Test if we can connect to Supabase
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log('Users table does not exist in Supabase.');
        console.log('Please create the necessary tables in Supabase dashboard:');
        logTableStructures();
      } else {
        console.error('Error connecting to users table:', error);
      }
    } else {
      console.log('Successfully connected to Supabase and users table exists.');
      if (data && data.length > 0) {
        console.log(`Found ${data.length} user(s) in the database.`);
      } else {
        console.log('Users table exists but is empty.');
      }
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }

  // Check other necessary tables
  try {
    const { data: plansData, error: plansError } = await supabase.from('plans').select('*').limit(1);
    if (plansError) {
      if (plansError.code === '42P01') {
        console.log('Plans table does not exist in Supabase.');
      } else {
        console.error('Error connecting to plans table:', plansError);
      }
    } else if (plansData && plansData.length > 0) {
      console.log(`Found ${plansData.length} plan(s) in the database.`);
    }
    
    const { data: faqsData, error: faqsError } = await supabase.from('faqs').select('*').limit(1);
    if (faqsError) {
      if (faqsError.code === '42P01') {
        console.log('FAQs table does not exist in Supabase.');
      } else {
        console.error('Error connecting to faqs table:', faqsError);
      }
    } else if (faqsData && faqsData.length > 0) {
      console.log(`Found ${faqsData.length} FAQ(s) in the database.`);
    }
    
    const { data: testimonialsData, error: testimonialsError } = await supabase.from('testimonials').select('*').limit(1);
    if (testimonialsError) {
      if (testimonialsError.code === '42P01') {
        console.log('Testimonials table does not exist in Supabase.');
      } else {
        console.error('Error connecting to testimonials table:', testimonialsError);
      }
    } else if (testimonialsData && testimonialsData.length > 0) {
      console.log(`Found ${testimonialsData.length} testimonial(s) in the database.`);
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }

  console.log('Database initialization check completed');
}

function logTableStructures() {
  console.log('------------------------------------------------------------');
  console.log('CREATE TABLE users (');
  console.log('  id SERIAL PRIMARY KEY,');
  console.log('  email VARCHAR(255) UNIQUE NOT NULL,');
  console.log('  username VARCHAR(255) UNIQUE NOT NULL,');
  console.log('  password VARCHAR(255) NOT NULL,');
  console.log('  first_name VARCHAR(255),');
  console.log('  last_name VARCHAR(255),');
  console.log('  profile_picture TEXT,');
  console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
  console.log(');');
  console.log('');
  
  console.log('CREATE TABLE plans (');
  console.log('  id SERIAL PRIMARY KEY,');
  console.log('  name VARCHAR(255) NOT NULL,');
  console.log('  description TEXT NOT NULL,');
  console.log('  account_size INTEGER NOT NULL,');
  console.log('  price INTEGER NOT NULL,');
  console.log('  profit_target INTEGER NOT NULL,');
  console.log('  max_drawdown INTEGER NOT NULL,');
  console.log('  profit_split INTEGER NOT NULL,');
  console.log('  min_trading_days INTEGER NOT NULL,');
  console.log('  max_daily_profit INTEGER NOT NULL,');
  console.log('  features TEXT NOT NULL,');
  console.log('  is_active BOOLEAN DEFAULT TRUE,');
  console.log('  payout_frequency VARCHAR(255) NOT NULL');
  console.log(');');
  console.log('');
  
  console.log('CREATE TABLE faqs (');
  console.log('  id SERIAL PRIMARY KEY,');
  console.log('  question TEXT NOT NULL,');
  console.log('  answer TEXT NOT NULL,');
  console.log('  category VARCHAR(255) NOT NULL,');
  console.log('  order INTEGER NOT NULL,');
  console.log('  is_active BOOLEAN DEFAULT TRUE');
  console.log(');');
  console.log('');
  
  console.log('CREATE TABLE testimonials (');
  console.log('  id SERIAL PRIMARY KEY,');
  console.log('  name VARCHAR(255) NOT NULL,');
  console.log('  title VARCHAR(255) NOT NULL,');
  console.log('  content TEXT NOT NULL,');
  console.log('  account_size INTEGER NOT NULL,');
  console.log('  profit INTEGER NOT NULL,');
  console.log('  duration VARCHAR(255) NOT NULL,');
  console.log('  initials VARCHAR(10) NOT NULL,');
  console.log('  avatar_color VARCHAR(50) NOT NULL,');
  console.log('  is_active BOOLEAN DEFAULT TRUE');
  console.log(');');
  console.log('------------------------------------------------------------');
}

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
});