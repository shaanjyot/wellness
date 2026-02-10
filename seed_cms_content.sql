--
-- Seed Content for CMS Pages
-- Home, Services, About, Contact
--

-- 1. Insert Pages
INSERT INTO pages (slug, title, meta_description) VALUES
('home', 'Wellness IV Drip - Mobile IV Vitamin Therapy', 'Mobile IV Vitamin Therapy Service delivered in comfort.'),
('services', 'Our Services - Wellness IV Drip', 'Comprehensive range of mobile IV infusion services.'),
('about', 'About Us - Wellness IV Drip', 'Learn more about our mission, team, and commitment to your wellness journey.'),
('contact', 'Contact Us - Wellness IV Drip', 'Get in touch with our team for immediate assistance.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Home Page Sections
WITH page_cte AS (SELECT id FROM pages WHERE slug = 'home')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'hero', 'Hero Section', 1, '{
  "heading": "Mobile IV Vitamin Therapy Service",
  "subheading": "Bespoke IV drips - Delivered in comfort",
  "description": "Welcome to Wellness IV Drip Canberra. Need to have a drip today? Book in for a free consultation with our nurses.",
  "cta_primary": { "text": "Book an appointment", "link": "/booking" },
  "cta_secondary": { "text": "Watch Video", "link": "/bg-video.mp4" },
  "video_src": "/bg-video.mp4"
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'hero');

WITH page_cte AS (SELECT id FROM pages WHERE slug = 'home')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'services_intro', 'Services Intro', 2, '{
  "title": "Our Services",
  "description": "We offer a comprehensive range of mobile IV infusion services tailored to meet your unique wellness needs.",
  "services_list": [
    { "title": "Mobile IV Drip", "description": "Professional IV therapy delivered to your location", "icon": "💧" },
    { "title": "Intramuscular & Subcutaneous Shots", "description": "Targeted vitamin and mineral injections", "icon": "💉" },
    { "title": "Corporate Wellness Program", "description": "Comprehensive wellness solutions for businesses", "icon": "🏢" }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'services_intro');

WITH page_cte AS (SELECT id FROM pages WHERE slug = 'home')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'about_summary', 'About Summary', 3, '{
  "title": "About Us",
  "content": [
    "At the heart of our mission is a genuine commitment to supporting individuals in their journey toward health and well-being. Whether you''re recovering from physical exertion, dealing with jetlag, or feeling burnout, we offer treatments tailored to your needs.",
    "With our advanced facility and experienced, qualified nurses, you can feel confident in the care you receive. We are an official licensee of IV League Drips."
  ],
  "qualifications": ["Qualified Medical Professionals", "Official IV League Drips Licensee"],
  "contact_box": {
    "title": "Making an appointment",
    "description": "At Wellness IV Drip, we offer a range of mobile IV infusion services tailored to meet the unique needs of each client. Our experienced medical practitioners conduct thorough medical and physical assessments to create personalised solutions designed specifically for you.",
    "phone": "0450 480 698",
    "email": "admin@wellnessivdrip.com.au"
  }
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'about_summary');

WITH page_cte AS (SELECT id FROM pages WHERE slug = 'home')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'how_it_works', 'How It Works', 4, '{
  "title": "How our IV Drips work",
  "description": "A simple, streamlined process designed for your comfort and convenience.",
  "steps": [
    { "number": "01", "title": "Choose Your IV Drip", "description": "Our menu of Vitamin IV drips has something for everybody. Select your favorite blend, or let our qualified nurses help and suggest one that suits your needs." },
    { "number": "02", "title": "Schedule an Appointment", "description": "Just tell us the date and time. Our nurses will be there to give you the self-care treatment you deserve." },
    { "number": "03", "title": "In-person Consultation", "description": "Let us take care of you. Our highly-trained nurses are here to answer any of your questions and determine a personalised treatment plan for you." },
    { "number": "04", "title": "Time to Drip", "description": "Sit back, relax, and take in your custom blend of vitamins and minerals" }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'how_it_works');


-- 3. Insert About Page Sections
WITH page_cte AS (SELECT id FROM pages WHERE slug = 'about')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'mission_tab', 'Mission Tab', 1, '{
  "title": "Welcome to Canberra Mobile IV Drip Service",
  "intro": "Wellness IV Drip offers mobile IV therapy services in Canberra, ACT, with a vision to deliver wellness and rejuvenation directly to the comfort of your home, providing you with ultimate convenience and flexibility.",
  "mission": "Our mission is to offer customised IV nutrient therapy treatments and intramuscular boosters, tailored to each individual''s unique health needs. We believe that true well-being is achieved by addressing the root causes of health challenges, and our dedicated team is here to empower you to take control of your wellness and live your best life.",
  "highlights": ["Qualified Medical Professionals", "Official IV League Drips Licensee", "Mobile Service Across Canberra"],
  "why_choose_us": [
    { "title": "Convenience", "description": "We come to you, saving you time and travel." },
    { "title": "Expertise", "description": "Qualified nurses with specialized IV therapy training." },
    { "title": "Personalized Care", "description": "Each treatment is customized to your specific needs." }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'mission_tab');

WITH page_cte AS (SELECT id FROM pages WHERE slug = 'about')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'team_tab', 'Team Tab', 2, '{
  "title": "Meet Vivian",
  "subtitle": "Our founder and dedicated Registered Nurse",
  "founder": {
    "name": "Vivian",
    "role": "Founder & Registered Nurse",
    "description": "Our founder, Vivian, is a Registered Nurse with a deep passion for educating others on maintaining optimal health through nutritious vitamin IV therapy and illness prevention. After receiving training from leading IV drip experts in Sydney, Vivian set out to establish Wellness IV in Canberra, drawing on years of experience as a dedicated nurse.",
    "additional_info": "Inspired by the growing recognition and success of IV vitamin therapies both nationally and internationally, Vivian was determined to bring this transformative wellness solution to the people of Canberra, helping them on their journey to better health."
  }
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'team_tab');


-- 4. Insert Services Page Sections
WITH page_cte AS (SELECT id FROM pages WHERE slug = 'services')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'services_list', 'Main Services List', 1, '{
  "title": "IV Drip Treatments",
  "subtitle": "Professional vitamin therapy delivered by qualified nurses",
  "services": [
    {
      "id": "hydration",
      "name": "Hydration Therapy",
      "price": "$120",
      "duration": "30-45 min",
      "description": "Perfect for dehydration, hangovers, and general wellness",
      "includes": ["Normal Saline Solution", "B-Complex Vitamins", "Vitamin C", "Magnesium", "Zinc"],
      "specs": {
        "Volume": "500ml",
        "Duration": "30-45 minutes",
        "Best For": "Dehydration, Hangovers, General Wellness",
        "Side Effects": "Minimal - slight bruising possible"
      }
    },
    {
      "id": "energy",
      "name": "Energy Boost",
      "price": "$150",
      "duration": "45-60 min",
      "description": "Combat fatigue and boost your energy levels naturally",
      "includes": ["Normal Saline Solution", "B-Complex Vitamins", "Vitamin C", "Magnesium", "Taurine", "Glutathione"],
      "specs": {
        "Volume": "750ml",
        "Duration": "45-60 minutes",
        "Best For": "Fatigue, Low Energy, Mental Clarity",
        "Side Effects": "Minimal - slight bruising possible"
      }
    },
    {
      "id": "immunity",
      "name": "Immunity Support",
      "price": "$180",
      "duration": "45-60 min",
      "description": "Strengthen your immune system with essential vitamins",
      "includes": ["Normal Saline Solution", "High-dose Vitamin C", "Zinc", "Selenium", "Vitamin D", "Glutathione"],
      "specs": {
        "Volume": "750ml",
        "Duration": "45-60 minutes",
        "Best For": "Immune Support, Cold Prevention, Recovery",
        "Side Effects": "Minimal - slight bruising possible"
      }
    },
    {
      "id": "beauty",
      "name": "Beauty Glow",
      "price": "$200",
      "duration": "60 min",
      "description": "Enhance your skin, hair, and nails from within",
      "includes": ["Normal Saline Solution", "Biotin", "Collagen Peptides", "Vitamin C", "Glutathione", "Selenium"],
      "specs": {
        "Volume": "1000ml",
        "Duration": "60 minutes",
        "Best For": "Skin Health, Hair Growth, Anti-aging",
        "Side Effects": "Minimal - slight bruising possible"
      }
    }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'services_list');


-- 5. Insert Contact Page Sections
WITH page_cte AS (SELECT id FROM pages WHERE slug = 'contact')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'contact_info', 'Contact Information', 1, '{
  "info_cards": [
    {
      "icon": "Phone",
      "title": "Phone",
      "details": "0450 480 698",
      "description": "Call us for immediate assistance"
    },
    {
      "icon": "Mail",
      "title": "Email",
      "details": "admin@wellnessivdrip.com.au",
      "description": "Send us an email anytime"
    },
    {
      "icon": "MapPin",
      "title": "Service Area",
      "details": "Canberra & Surrounding Areas",
      "description": "We come to you anywhere in Canberra"
    },
    {
      "icon": "Clock",
      "title": "Hours",
      "details": "7 Days a Week",
      "description": "Flexible scheduling available"
    }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'contact_info');

WITH page_cte AS (SELECT id FROM pages WHERE slug = 'contact')
INSERT INTO page_sections (page_id, section_key, title, display_order, content)
SELECT id, 'faqs', 'Frequently Asked Questions', 2, '{
  "title": "Frequently Asked Questions",
  "subtitle": "Common questions about our IV therapy services",
  "questions": [
    {
      "question": "How does the mobile IV service work?",
      "answer": "Our qualified nurses come to your location with all necessary equipment. We conduct a brief consultation, then administer your chosen IV treatment in the comfort of your own space."
    },
    {
      "question": "How long does an IV treatment take?",
      "answer": "Most treatments take 30-90 minutes depending on the type of IV drip you choose. We''ll provide an estimated duration when you book."
    },
    {
      "question": "Is IV therapy safe?",
      "answer": "Yes, IV therapy is generally safe when administered by qualified medical professionals. Our nurses are fully trained and licensed, and we conduct thorough health assessments before treatment."
    },
    {
      "question": "What areas do you service?",
      "answer": "We provide mobile IV services throughout Canberra and surrounding areas. Contact us to confirm if we service your specific location."
    },
    {
      "question": "How far in advance should I book?",
      "answer": "We recommend booking at least 24 hours in advance, though we may be able to accommodate same-day appointments depending on availability."
    },
    {
      "question": "What should I expect during my first visit?",
      "answer": "During your first visit, our nurse will conduct a health assessment, discuss your wellness goals, and recommend the best treatment for your needs. The actual IV administration is quick and comfortable."
    }
  ]
}'::jsonb
FROM page_cte
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_id = page_cte.id AND section_key = 'faqs');

