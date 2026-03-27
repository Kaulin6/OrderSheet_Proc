// ============================================
// SHQ Procurement - Configuration
// ============================================

const CONFIG = {
  // --- Supabase ---
  // Replace with your Supabase project URL and anon key
  SUPABASE_URL: 'https://nrhjlbuldysvuthypxtw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yaGpsYnVsZHlzdnV0aHlweHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjExOTUsImV4cCI6MjA4OTMzNzE5NX0.q4baJEjaUs87WqV2IelZ-4-9kkprFJnkiBeNAen6-Pc',

  // --- EmailJS ---
  // Replace with your EmailJS IDs
  EMAILJS_PUBLIC_KEY: 'jnNLGpYmjff51TlTj',
  EMAILJS_SERVICE_ID: 'service_vri60gr',
  EMAILJS_TEMPLATE_ID: 'template_o71btmg',

  // --- Email Recipients ---
  PROCUREMENT_EMAIL: 'kaulin@storagehq.ca',

  // --- Requester Email Mapping ---
  REQUESTER_EMAILS: {
    'Josh M.': 'josh@storagehq.ca',
    'Keegan W.': 'keegan@storagehq.ca',
    'Luz': 'luzcenit@storagehq.ca',
    'Lance M.': 'lance@storagehq.ca',
  },

  // --- Dropdown Options ---
  BUSINESS_UNITS: [
    'Development',
    'Construction',
    'Facility',
  ],

  REQUESTED_BY: [
    'Select...',
    'Josh M.',
    'Keegan W.',
    'Luz',
    'Lance M.',
    'Other',
  ],

  // --- Product Categories ---
  CATEGORIES: [
    'All',
    'Security',
    'MEP',
    'Signage',
    'Construction',
  ],
};
