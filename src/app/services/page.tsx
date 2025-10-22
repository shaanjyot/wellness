'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  const [openSection, setOpenSection] = useState<string | null>('includes');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const services = [
    {
      id: 'hydration',
      name: 'Hydration Therapy',
      price: '$120',
      duration: '30-45 min',
      description: 'Perfect for dehydration, hangovers, and general wellness',
      includes: [
        'Normal Saline Solution',
        'B-Complex Vitamins',
        'Vitamin C',
        'Magnesium',
        'Zinc'
      ],
      specs: {
        'Volume': '500ml',
        'Duration': '30-45 minutes',
        'Best For': 'Dehydration, Hangovers, General Wellness',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    },
    {
      id: 'energy',
      name: 'Energy Boost',
      price: '$150',
      duration: '45-60 min',
      description: 'Combat fatigue and boost your energy levels naturally',
      includes: [
        'Normal Saline Solution',
        'B-Complex Vitamins',
        'Vitamin C',
        'Magnesium',
        'Taurine',
        'Glutathione'
      ],
      specs: {
        'Volume': '750ml',
        'Duration': '45-60 minutes',
        'Best For': 'Fatigue, Low Energy, Mental Clarity',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    },
    {
      id: 'immunity',
      name: 'Immunity Support',
      price: '$180',
      duration: '45-60 min',
      description: 'Strengthen your immune system with essential vitamins',
      includes: [
        'Normal Saline Solution',
        'High-dose Vitamin C',
        'Zinc',
        'Selenium',
        'Vitamin D',
        'Glutathione'
      ],
      specs: {
        'Volume': '750ml',
        'Duration': '45-60 minutes',
        'Best For': 'Immune Support, Cold Prevention, Recovery',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    },
    {
      id: 'beauty',
      name: 'Beauty Glow',
      price: '$200',
      duration: '60 min',
      description: 'Enhance your skin, hair, and nails from within',
      includes: [
        'Normal Saline Solution',
        'Biotin',
        'Collagen Peptides',
        'Vitamin C',
        'Glutathione',
        'Selenium'
      ],
      specs: {
        'Volume': '1000ml',
        'Duration': '60 minutes',
        'Best For': 'Skin Health, Hair Growth, Anti-aging',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    },
    {
      id: 'athletic',
      name: 'Athletic Recovery',
      price: '$220',
      duration: '60-75 min',
      description: 'Optimize recovery and performance for athletes',
      includes: [
        'Normal Saline Solution',
        'B-Complex Vitamins',
        'Magnesium',
        'Zinc',
        'Glutathione',
        'Amino Acids',
        'Electrolytes'
      ],
      specs: {
        'Volume': '1000ml',
        'Duration': '60-75 minutes',
        'Best For': 'Athletic Recovery, Muscle Repair, Performance',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    },
    {
      id: 'premium',
      name: 'Premium Wellness',
      price: '$280',
      duration: '75-90 min',
      description: 'Our most comprehensive treatment for complete wellness',
      includes: [
        'Normal Saline Solution',
        'All B-Vitamins',
        'High-dose Vitamin C',
        'Magnesium',
        'Zinc',
        'Selenium',
        'Glutathione',
        'NAD+',
        'Amino Acids'
      ],
      specs: {
        'Volume': '1000ml',
        'Duration': '75-90 minutes',
        'Best For': 'Complete Wellness, Anti-aging, Peak Performance',
        'Side Effects': 'Minimal - slight bruising possible'
      }
    }
  ];

  const additionalServices = [
    {
      name: 'Intramuscular Shots',
      description: 'Quick vitamin injections for immediate benefits',
      price: '$50-80',
      duration: '15 min'
    },
    {
      name: 'Subcutaneous Shots',
      description: 'Slow-release vitamin injections',
      price: '$60-90',
      duration: '20 min'
    },
    {
      name: 'Corporate Wellness',
      description: 'On-site wellness programs for businesses',
      price: 'Custom',
      duration: 'Flexible'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Professional IV therapy services delivered to your location.
            Choose from our comprehensive menu of wellness treatments.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              IV Drip Treatments
            </h2>
            <p className="text-xl text-gray-600">
              Professional vitamin therapy delivered by qualified nurses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-teal-500">{service.price}</div>
                      <div className="text-sm text-gray-500">{service.duration}</div>
                    </div>
                  </div>

                  {/* Collapsible Sections */}
                  <div className="space-y-4">
                    {/* Includes Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection(`${service.id}-includes`)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">INCLUDES</span>
                        {openSection === `${service.id}-includes` ? (
                          <ChevronUp className="w-5 h-5 text-teal-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {openSection === `${service.id}-includes` && (
                        <div className="px-4 pb-4">
                          <ul className="space-y-2">
                            {service.includes.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-teal-500" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Specs Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection(`${service.id}-specs`)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">SPECS</span>
                        {openSection === `${service.id}-specs` ? (
                          <ChevronUp className="w-5 h-5 text-teal-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {openSection === `${service.id}-specs` && (
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(service.specs).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 font-medium">{key}:</span>
                                <span className="text-gray-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200">
                      Book This Service
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600">
              More ways to support your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-teal-500">{service.price}</div>
                  <div className="text-sm text-gray-500">{service.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Book Your Treatment?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Our qualified nurses are ready to provide you with personalized IV therapy.
          </p>
          <a
            href="/booking"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            Book Appointment
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
