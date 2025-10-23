'use client';

import { useState } from 'react';
import { CheckCircle, Users, Award, Heart, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'team', label: 'Meet Vivian' },
    { id: 'process', label: 'How It Works' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const founder = {
    name: 'Vivian',
    role: 'Founder & Registered Nurse',
    image: '👩‍⚕️',
    description: 'Our founder, Vivian, is a Registered Nurse with a deep passion for educating others on maintaining optimal health through nutritious vitamin IV therapy and illness prevention. After receiving training from leading IV drip experts in Sydney, Vivian set out to establish Wellness IV in Canberra, drawing on years of experience as a dedicated nurse.',
    additionalInfo: 'Inspired by the growing recognition and success of IV vitamin therapies both nationally and internationally, Vivian was determined to bring this transformative wellness solution to the people of Canberra, helping them on their journey to better health.'
  };

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
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
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
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Canberra Mobile IV Drip Service</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Wellness IV Drip offers mobile IV therapy services in Canberra, ACT, with a vision to deliver wellness and rejuvenation directly to the comfort of your home, providing you with ultimate convenience and flexibility.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Our mission is to offer customised IV nutrient therapy treatments and intramuscular boosters, tailored to each individual's unique health needs. We believe that true well-being is achieved by addressing the root causes of health challenges, and our dedicated team is here to empower you to take control of your wellness and live your best life.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-500" />
                    <span className="text-gray-700 font-semibold">Qualified Medical Professionals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-500" />
                    <span className="text-gray-700 font-semibold">Official IV League Drips Licensee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-500" />
                    <span className="text-gray-700 font-semibold">Mobile Service Across Canberra</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-400 to-amber-400 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Convenience</h4>
                      <p className="text-teal-100">We come to you, saving you time and travel.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Expertise</h4>
                      <p className="text-teal-100">Qualified nurses with specialized IV therapy training.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Personalized Care</h4>
                      <p className="text-teal-100">Each treatment is customized to your specific needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Vivian</h2>
                <p className="text-xl text-gray-600">
                  Our founder and dedicated Registered Nurse
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-6">{founder.image}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                  <p className="text-teal-500 font-semibold text-xl mb-6">{founder.role}</p>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {founder.description}
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {founder.additionalInfo}
                  </p>
                </div>
              </div>
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
