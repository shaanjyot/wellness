'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

type Value = Date | [Date, Date] | null;

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    { id: 'hydration', name: 'Hydration Therapy', price: '$120', duration: '30-45 min' },
    { id: 'energy', name: 'Energy Boost', price: '$150', duration: '45-60 min' },
    { id: 'immunity', name: 'Immunity Support', price: '$180', duration: '45-60 min' },
    { id: 'beauty', name: 'Beauty Glow', price: '$200', duration: '60 min' },
    { id: 'athletic', name: 'Athletic Recovery', price: '$220', duration: '60-75 min' },
    { id: 'premium', name: 'Premium Wellness', price: '$280', duration: '75-90 min' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: selectedService,
          date: selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : '',
          time: selectedTime
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSelectedService('');
        setSelectedTime('');
        setSelectedDate(new Date());
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 bg-gradient-to-r from-teal-500 to-amber-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for booking with Wellness IV Drip. We will contact you shortly to confirm your appointment details.
              </p>
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200"
                >
                  Return Home
                </Link>
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
            Book Your Appointment
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Schedule your personalized IV therapy session with our qualified nurses.
            We will come to you for maximum convenience.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-teal-500" />
                Select Service
              </h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedService === service.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-500">{service.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-3 text-teal-500" />
                Select Date
              </h2>
              <div className="flex justify-center">
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    } else if (Array.isArray(value) && value[0] instanceof Date) {
                      setSelectedDate(value[0]);
                    }
                  }}
                  value={selectedDate}
                  minDate={new Date()}
                  className="react-calendar"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-teal-500" />
                Select Time
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-teal-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-teal-500" />
                Contact Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Book Appointment'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          {(selectedService || selectedDate || selectedTime) && (
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedService && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Service</h4>
                    <p className="text-teal-600 font-medium">
                      {services.find(s => s.id === selectedService)?.name}
                    </p>
                  </div>
                )}
                {selectedDate && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Date</h4>
                    <p className="text-teal-600 font-medium">
                      {selectedDate instanceof Date ? selectedDate.toLocaleDateString() : ''}
                    </p>
                  </div>
                )}
                {selectedTime && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Time</h4>
                    <p className="text-teal-600 font-medium">{selectedTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
