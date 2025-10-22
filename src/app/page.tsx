'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const services = [
    {
      title: 'Mobile IV Drip',
      description: 'Professional IV therapy delivered to your location',
      icon: '💧'
    },
    {
      title: 'Intramuscular & Subcutaneous Shots',
      description: 'Targeted vitamin and mineral injections',
      icon: '💉'
    },
    {
      title: 'Corporate Wellness Program',
      description: 'Comprehensive wellness solutions for businesses',
      icon: '🏢'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your IV Drip',
      description: 'Our menu of Vitamin IV drips has something for everybody. Select your favorite blend, or let our qualified nurses help and suggest one that suits your needs.'
    },
    {
      number: '02',
      title: 'Schedule an Appointment',
      description: 'Just tell us the date and time. Our nurses will be there to give you the self-care treatment you deserve.'
    },
    {
      number: '03',
      title: 'In-person Consultation',
      description: 'Let us take care of you. Our highly-trained nurses are here to answer any of your questions and determine a personalised treatment plan for you.'
    },
    {
      number: '04',
      title: 'Time to Drip',
      description: 'Sit back, relax, and take in your custom blend of vitamins and minerals'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loop
          muted
          playsInline
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Mobile IV Vitamin Therapy Service
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-teal-200">
            Bespoke IV drips - Delivered in comfort
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Welcome to Wellness IV Drip Canberra. Need to have a drip today?
            Book in for a free consultation with our nurses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105"
            >
              Book an appointment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
              <Play className="mr-2 w-5 h-5" />
              Watch Video
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of mobile IV infusion services tailored to meet your unique wellness needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-teal-500 font-semibold hover:text-teal-600 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Us
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At the heart of our mission is a genuine commitment to supporting individuals in their journey toward health and well-being. Whether you're recovering from physical exertion, dealing with jetlag, or feeling burnout, we offer treatments tailored to your needs.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With our advanced facility and experienced, qualified nurses, you can feel confident in the care you receive. We are an official licensee of IV League Drips.
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-teal-500" />
                <span className="text-gray-700 font-semibold">Qualified Medical Professionals</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <CheckCircle className="w-6 h-6 text-teal-500" />
                <span className="text-gray-700 font-semibold">Official IV League Drips Licensee</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-teal-400 to-amber-400 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Making an appointment</h3>
                <p className="mb-6">
                  At Wellness IV Drip, we offer a range of mobile IV infusion services tailored to meet the unique needs of each client. Our experienced medical practitioners conduct thorough medical and physical assessments to create personalised solutions designed specifically for you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">☎️</span>
                    <span>0450 480 698</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📧</span>
                    <span>admin@wellnessivdrip.com.au</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How our IV Drips work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, streamlined process designed for your comfort and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl font-bold text-teal-500 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Premium IV Therapy?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Book your consultation today and take the first step towards optimal wellness.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            Book Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
