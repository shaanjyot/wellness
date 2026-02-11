'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageContent } from '@/hooks/usePageContent';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { content, loading } = usePageContent('contact');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconMap = {
    'Phone': <Phone className="w-6 h-6 text-teal-500" />,
    'Mail': <Mail className="w-6 h-6 text-teal-500" />,
    'MapPin': <MapPin className="w-6 h-6 text-teal-500" />,
    'Clock': <Clock className="w-6 h-6 text-teal-500" />
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const contactInfoList = content?.sections?.['contact_info']?.info_cards || [
    {
      icon: 'Phone',
      title: 'Phone',
      details: '0450 480 698',
      description: 'Call us for immediate assistance'
    },
    {
      icon: 'Mail',
      title: 'Email',
      details: 'admin@wellnessivdrip.com.au',
      description: 'Send us an email anytime'
    },
    {
      icon: 'MapPin',
      title: 'Service Area',
      details: 'Canberra & Surrounding Areas',
      description: 'We come to you anywhere in Canberra'
    },
    {
      icon: 'Clock',
      title: 'Hours',
      details: '7 Days a Week',
      description: 'Flexible scheduling available'
    }
  ];

  const faqs = content?.sections?.['faqs']?.questions || [
    {
      question: 'How does the mobile IV service work?',
      answer: 'Our qualified nurses come to your location with all necessary equipment. We conduct a brief consultation, then administer your chosen IV treatment in the comfort of your own space.'
    },
    {
      question: 'How long does an IV treatment take?',
      answer: 'Most treatments take 30-90 minutes depending on the type of IV drip you choose. We\'ll provide an estimated duration when you book.'
    },
    {
      question: 'Is IV therapy safe?',
      answer: 'Yes, IV therapy is generally safe when administered by qualified medical professionals. Our nurses are fully trained and licensed, and we conduct thorough health assessments before treatment.'
    },
    {
      question: 'What areas do you service?',
      answer: 'We provide mobile IV services throughout Canberra and surrounding areas. Contact us to confirm if we service your specific location.'
    },
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking at least 24 hours in advance, though we may be able to accommodate same-day appointments depending on availability.'
    },
    {
      question: 'What should I expect during my first visit?',
      answer: 'During your first visit, our nurse will conduct a health assessment, discuss your wellness goals, and recommend the best treatment for your needs. The actual IV administration is quick and comfortable.'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 bg-gradient-to-r from-teal-500 to-amber-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Message Sent!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-teal-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Get in touch with our team. We're here to answer your questions and help you book your wellness journey.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfoList.map((info: any, index: number) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {iconMap[info.icon as keyof typeof iconMap] || <CheckCircle className="w-6 h-6 text-teal-500" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-teal-600 font-semibold mb-2">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Question</option>
                      <option value="service">Service Information</option>
                      <option value="support">Customer Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Area</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Canberra & Surrounding Areas</p>
                    <p className="text-sm text-gray-500 mt-1">We come to you!</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Need Immediate Assistance?</h3>
                <p className="mb-6">For urgent inquiries or same-day bookings, call us directly.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">0450 480 698</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">admin@wellnessivdrip.com.au</span>
                  </div>
                </div>
                <a
                  href="/booking"
                  className="inline-block mt-6 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {content?.sections?.['faqs']?.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-xl text-gray-600">
              {content?.sections?.['faqs']?.subtitle || 'Common questions about our IV therapy services'}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
