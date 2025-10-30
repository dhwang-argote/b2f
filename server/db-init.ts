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

  // Check necessary tables
  try {
    const { data: plansData, error: plansError } = await supabase.from('plans').select('*').limit(1);
    if (plansError) {
      console.error('Error connecting to plans table:', plansError);
    } else if (plansData && plansData.length > 0) {
      console.log(`Found ${plansData.length} plan(s) in the database.`);
    }
    
    const { data: faqsData, error: faqsError } = await supabase.from('faqs').select('*').limit(1);
    if (faqsError) {
      console.error('Error connecting to faqs table:', faqsError);
    }
    
    const { data: testimonialsData, error: testimonialsError } = await supabase.from('testimonials').select('*').limit(1);
    if (testimonialsError) {
      console.error('Error connecting to testimonials table:', testimonialsError);
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }

  console.log('Database initialization check completed');
}

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
});