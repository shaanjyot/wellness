'use client';

import { useState } from 'react';
import { CheckCircle, Users, Award, Heart, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageContent } from '@/hooks/usePageContent';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');
  const { content, loading } = usePageContent('about');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'team', label: 'Meet Vivian' },
    { id: 'process', label: 'How It Works' },
    { id: 'contact', label: 'Contact Us' }
  ];

  /*
   Fallback hardcoded data structure mirrors what we expect from CMS.
   In a real app, we might just return empty states or error if content is missing,
   but here we keep robust fallbacks or simple checks.
  */

  const missionData = content?.sections?.['mission_tab'] || {};
  const teamData = content?.sections?.['team_tab'] || {};

  // Re-use home page 'how_it_works' logic or if we stored it specifically for about page
  // In seed script, we didn't add 'process' section for 'about' page specifically,
  // but often 'How It Works' is same across site.
  // Let's actually check if we added it to 'about' in seed script...
  // Wait, I only added 'mission_tab' and 'team_tab' for 'about' in previous step.
  // So 'process' and 'contact' might need to be hardcoded or fetched from 'home' page content if duplicated?
  // Or better, for now I will keep the hardcoded processSteps as fallback if not in CMS.

  const processSteps = [
    {
      number: '1',
      title: 'Choose Your IV Drip',
      description: 'Our menu of Vitamin IV drips has something for everybody. Select your favorite blend, or let our qualified nurses help and suggest one that suits your needs.'
    },
    {
      number: '2',
      title: 'Schedule an Appointment',
      description: 'Just tell us the date and time. Our nurses will be there to give you the self-care treatment you deserve.'
    },
    {
      number: '3',
      title: 'In-person Consultation',
      description: 'Let us take care of you. Our highly-trained nurses are here to answer any of your questions and determine a personalised treatment plan for you.'
    },
    {
      number: '4',
      title: 'Time to Drip',
      description: 'Sit back, relax, and take in your custom blend of vitamins and minerals.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Learn more about our mission, team, and commitment to your wellness journey.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'mission' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{missionData.title || 'Welcome to Canberra Mobile IV Drip Service'}</h2>
                <p className="text-lg text-gray-600 mb-6">
                  {missionData.intro || 'Wellness IV Drip offers mobile IV therapy services...'}
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  {missionData.mission || 'Our mission is to offer customised IV nutrient therapy...'}
                </p>
                <div className="space-y-4">
                  {(missionData.highlights || []).map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700 font-semibold">{highlight}</span>
                    </div>
                  ))}
                  {(!missionData.highlights || missionData.highlights.length === 0) && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700 font-semibold">Qualified Medical Professionals</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-400 to-amber-400 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  {(missionData.why_choose_us || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-teal-100">{item.description}</p>
                      </div>
                    </div>
                  ))}
                  {(!missionData.why_choose_us || missionData.why_choose_us.length === 0) && (
                    <p className="text-teal-100">Contact us for details.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{teamData.title || 'Meet Vivian'}</h2>
                <p className="text-xl text-gray-600">
                  {teamData.subtitle || 'Our founder and dedicated Registered Nurse'}
                </p>
              </div>
              {teamData.founder ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-6">👩‍⚕️</div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{teamData.founder.name}</h3>
                    <p className="text-teal-500 font-semibold text-xl mb-6">{teamData.founder.role}</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {teamData.founder.description}
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {teamData.founder.additional_info}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Founder information not available.</div>
              )}
            </div>
          )}

          {activeTab === 'process' && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our IV Drips Work</h2>
                <p className="text-xl text-gray-600">
                  A simple, streamlined process designed for your comfort and convenience
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-4xl font-bold text-teal-500 mb-4">{step.number}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="text-center">
              <div className="bg-white rounded-2xl p-12 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-xl text-gray-600 mb-8">
                  For more information, feel free to reach out to our dedicated team — we're here to assist you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone</h3>
                    <p className="text-xl text-teal-600 font-semibold">0450 480 698</p>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Email</h3>
                    <p className="text-xl text-teal-600 font-semibold">admin@wellnessivdrip.com.au</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <a
                    href="/booking"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 mr-4"
                  >
                    Book Appointment
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 border-2 border-teal-500 text-teal-500 font-semibold rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-200"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Contact us today to learn more about our services or book your first appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Book Appointment
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
