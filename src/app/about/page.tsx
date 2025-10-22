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
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  At the heart of our mission is a genuine commitment to supporting individuals in their journey toward health and well-being. Whether you're recovering from physical exertion, dealing with jetlag, or feeling burnout, we offer treatments tailored to your needs.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  With our advanced facility and experienced, qualified nurses, you can feel confident in the care you receive. We are an official licensee of IV League Drips, bringing you proven wellness solutions.
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
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                <p className="text-xl text-gray-600">
                  Experienced medical professionals dedicated to your wellness
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-teal-500 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                <p className="text-xl text-gray-600">
                  The principles that guide everything we do
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partnership' && (
            <div className="text-center">
              <div className="bg-white rounded-2xl p-12 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">IV League Drips Partnership</h2>
                <p className="text-xl text-gray-600 mb-8">
                  We are proud to be an official licensee of IV League Drips, Australia's leading mobile IV therapy service. This partnership ensures that our clients receive the highest quality treatments backed by years of research and development.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-lg p-8 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What This Means for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700">Proven treatment protocols</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700">Premium quality ingredients</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700">Ongoing training and support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                      <span className="text-gray-700">Continuous innovation</span>
                    </div>
                  </div>
                </div>
                <a
                  href="https://ivleaguedrips.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200"
                >
                  Learn More About IV League Drips
                </a>
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
