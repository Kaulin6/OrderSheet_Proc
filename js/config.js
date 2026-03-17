// ============================================
// SHQ Procurement - Configuration
// ============================================

const CONFIG = {
  // --- Supabase ---
  // Replace with your Supabase project URL and anon key
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',

  // --- EmailJS ---
  // Replace with your EmailJS IDs
  EMAILJS_PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  EMAILJS_SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',

  // --- Email Recipients ---
  PROCUREMENT_EMAIL: 'procurement@yourcompany.com',

  // --- Dropdown Options ---
  BUSINESS_UNITS: [
    'SHQ Operations',
    'Construction',
    'Security',
    'MEP',
    'Signage',
    'Temporary Facilities',
  ],

  PROJECT_NAMES: [
    'Tucson',
    'Phoenix',
    'Mesa',
    'Chandler',
    'Scottsdale',
    'Tempe',
    'Gilbert',
    'Glendale',
    'Peoria',
    'Surprise',
  ],

  REQUESTED_BY: [
    'Select...',
    'John Smith',
    'Jane Doe',
    'Alex Johnson',
    'Sam Williams',
  ],

  // --- Product Categories ---
  CATEGORIES: [
    'All',
    'Security',
    'MEP',
    'Signage',
    'Construction',
    'Temporary Facility',
  ],
};
