'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, BookOpen, Plus, Edit, Trash2, Eye as ViewIcon, Upload, X, MessageSquare, Settings } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'blogs' | 'contact' | 'settings'>('bookings');
  const [siteSettings, setSiteSettings] = useState({
    header_scripts: '',
    footer_scripts: '',
    google_ads_client: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogFormError, setBlogFormError] = useState('');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'general',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    author: 'Admin'
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Bookings filters, sorting, and pagination
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState<string>('all');
  const [bookingsSearchTerm, setBookingsSearchTerm] = useState('');
  const [bookingsSortBy, setBookingsSortBy] = useState<'date' | 'name' | 'created'>('created');
  const [bookingsSortOrder, setBookingsSortOrder] = useState<'asc' | 'desc'>('desc');
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  // Contact submissions filters, sorting, and pagination
  const [contactStatusFilter, setContactStatusFilter] = useState<string>('all');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [contactSortOrder, setContactSortOrder] = useState<'asc' | 'desc'>('desc');
  const [contactCurrentPage, setContactCurrentPage] = useState(1);
  const [contactPerPage] = useState(10);

  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        fetchBookings();
        fetchBlogs();
        fetchContactSubmissions();
        fetchSettings();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchBookings();
        fetchBlogs();
        fetchContactSubmissions();
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Login failed');
      }
    } catch {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const fetchContactSubmissions = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContactSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/cms/settings');
      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking =>
          booking.id === id ? { ...booking, status } : booking
        ));
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const updateContactSubmissionStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setContactSubmissions(contactSubmissions.map(sub =>
          sub.id === id ? { ...sub, status: status as any } : sub
        ));
      }
    } catch (error) {
      console.error('Failed to update contact submission status:', error);
    }
  };

  const deleteContactSubmission = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContactSubmissions(contactSubmissions.filter(sub => sub.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete contact submission:', error);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormError('');

    if (!blogForm.title.trim()) {
      setBlogFormError('Please enter a valid blog post title.');
      return;
    }

    if (!blogForm.content || blogForm.content.trim() === '' || blogForm.content === '<p></p>') {
      setBlogFormError('Please write some content for your blog post.');
      return;
    }

    try {
      const tagsArray = blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const blogData = {
        ...blogForm,
        tags: tagsArray
      };

      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        fetchBlogs();
        setShowBlogForm(false);
        setEditingBlog(null);
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          featured_image: '',
          category: 'general',
          tags: '',
          status: 'draft',
          author: 'Admin'
        });
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  const editBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featured_image: blog.featured_image || '',
      category: blog.category,
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status,
      author: blog.author
    });
    setBlogFormError('');
    setShowBlogForm(true);
  };

  const deleteBlog = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBlogs();
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  const uploadFeaturedImage = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setBlogForm({ ...blogForm, featured_image: data.url });
      } else {
        alert('Failed to upload image: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setBookings([]);
        setBlogs([]);
        // Redirect to home page after logout
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setIsAuthenticated(false);
      setBookings([]);
      setBlogs([]);
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">Access the booking management system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter password"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-teal-500 hover:text-teal-600 font-medium"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'archived':
        return 'bg-red-100 text-red-800';
      case 'completed':
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      case 'new':
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getServiceName = (serviceId: string) => {
    const services: { [key: string]: string } = {
      'hydration': 'Hydration Therapy',
      'energy': 'Energy Boost',
      'immunity': 'Immunity Support',
      'beauty': 'Beauty Glow',
      'athletic': 'Athletic Recovery',
      'premium': 'Premium Wellness'
    };
    return services[serviceId] || serviceId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Wellness IV Drip Management</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'bookings'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <CalendarIcon className="w-5 h-5 inline mr-2" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'blogs'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Blog Management
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'contact'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <MessageSquare className="w-5 h-5 inline mr-2" aria-hidden="true" />
                Contact Submissions
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'settings'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <Settings className="w-5 h-5 inline mr-2" aria-hidden="true" />
                Settings
              </button>
              <button
                onClick={() => router.push('/secure-access/admin/cms')}
                className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Edit className="w-5 h-5 inline mr-2" />
                CMS Content
              </button>
            </nav>

            <button
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'bookings'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <CalendarIcon className="w-5 h-5 inline mr-2" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'blogs'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Blog Management
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'contact'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h2>
              <p className="text-gray-600">Manage all appointment bookings and their status</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={bookingsSearchTerm}
                    onChange={(e) => {
                      setBookingsSearchTerm(e.target.value);
                      setBookingsCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={bookingsStatusFilter}
                    onChange={(e) => {
                      setBookingsStatusFilter(e.target.value);
                      setBookingsCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={bookingsSortBy}
                      onChange={(e) => setBookingsSortBy(e.target.value as 'date' | 'name' | 'created')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="created">Created Date</option>
                      <option value="date">Appointment Date</option>
                      <option value="name">Name</option>
                    </select>
                    <button
                      onClick={() => setBookingsSortOrder(bookingsSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title={bookingsSortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                      {bookingsSortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  All Bookings ({(() => {
                    let filtered = bookings;
                    if (bookingsStatusFilter !== 'all') {
                      filtered = filtered.filter(b => b.status === bookingsStatusFilter);
                    }
                    if (bookingsSearchTerm) {
                      const search = bookingsSearchTerm.toLowerCase();
                      filtered = filtered.filter(b =>
                        b.name.toLowerCase().includes(search) ||
                        b.email.toLowerCase().includes(search) ||
                        b.phone.includes(search)
                      );
                    }
                    return filtered.length;
                  })()})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      // Filter bookings
                      let filtered = bookings;
                      if (bookingsStatusFilter !== 'all') {
                        filtered = filtered.filter(b => b.status === bookingsStatusFilter);
                      }
                      if (bookingsSearchTerm) {
                        const search = bookingsSearchTerm.toLowerCase();
                        filtered = filtered.filter(b =>
                          b.name.toLowerCase().includes(search) ||
                          b.email.toLowerCase().includes(search) ||
                          b.phone.includes(search)
                        );
                      }

                      // Sort bookings
                      filtered.sort((a, b) => {
                        let comparison = 0;
                        if (bookingsSortBy === 'name') {
                          comparison = a.name.localeCompare(b.name);
                        } else if (bookingsSortBy === 'date') {
                          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                        } else { // created
                          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                        }
                        return bookingsSortOrder === 'asc' ? comparison : -comparison;
                      });

                      // Paginate
                      const startIndex = (bookingsCurrentPage - 1) * bookingsPerPage;
                      const endIndex = startIndex + bookingsPerPage;
                      const paginatedBookings = filtered.slice(startIndex, endIndex);

                      if (paginatedBookings.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                              <p className="text-gray-500">
                                {bookingsSearchTerm || bookingsStatusFilter !== 'all'
                                  ? 'Try adjusting your filters or search term.'
                                  : 'Bookings will appear here once customers start making appointments.'}
                              </p>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.email}</div>
                              <div className="text-sm text-gray-500">{booking.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getServiceName(booking.service)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{booking.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => deleteBooking(booking.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Booking"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                let filtered = bookings;
                if (bookingsStatusFilter !== 'all') {
                  filtered = filtered.filter(b => b.status === bookingsStatusFilter);
                }
                if (bookingsSearchTerm) {
                  const search = bookingsSearchTerm.toLowerCase();
                  filtered = filtered.filter(b =>
                    b.name.toLowerCase().includes(search) ||
                    b.email.toLowerCase().includes(search) ||
                    b.phone.includes(search)
                  );
                }
                const totalPages = Math.ceil(filtered.length / bookingsPerPage);

                if (totalPages <= 1) return null;

                return (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((bookingsCurrentPage - 1) * bookingsPerPage) + 1} to {Math.min(bookingsCurrentPage * bookingsPerPage, filtered.length)} of {filtered.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingsCurrentPage(Math.max(1, bookingsCurrentPage - 1))}
                        disabled={bookingsCurrentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setBookingsCurrentPage(page)}
                          className={`px-3 py-1 border rounded-lg ${page === bookingsCurrentPage
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setBookingsCurrentPage(Math.min(totalPages, bookingsCurrentPage + 1))}
                        disabled={bookingsCurrentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
              <p className="text-gray-500 mt-1">Configure global scripts, SEO, and integration codes.</p>
            </div>

            <div className="p-8 space-y-8">
              {/* Scripts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700 font-bold flex items-center gap-2">
                      Header Scripts
                      <span className="text-xs font-normal text-gray-400 font-medium">(Google Ads, Facebook Pixel, etc.)</span>
                    </span>
                    <textarea
                      value={siteSettings.header_scripts}
                      onChange={(e) => setSiteSettings({ ...siteSettings, header_scripts: e.target.value })}
                      className="mt-2 block w-full rounded-xl border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-48 font-mono text-sm p-4 bg-gray-50"
                      placeholder="<!-- Paste scripts here to be injected into <head> -->"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700 font-bold flex items-center gap-2">
                      Footer Scripts
                      <span className="text-xs font-normal text-gray-400 font-medium">(Live Chat, Tracking, etc.)</span>
                    </span>
                    <textarea
                      value={siteSettings.footer_scripts}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footer_scripts: e.target.value })}
                      className="mt-2 block w-full rounded-xl border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-48 font-mono text-sm p-4 bg-gray-50"
                      placeholder="<!-- Paste scripts here to be injected before </body> -->"
                    />
                  </label>
                </div>
              </div>

              {/* Marketing Tools */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Marketing Tools</h3>
                <div className="max-w-md space-y-4">
                  <label className="block">
                    <span className="text-gray-700 font-bold">Google Ads Client ID</span>
                    <input
                      type="text"
                      value={siteSettings.google_ads_client}
                      onChange={(e) => setSiteSettings({ ...siteSettings, google_ads_client: e.target.value })}
                      className="mt-2 block w-full rounded-xl border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3 bg-gray-50"
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className={`flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg transition-all hover:bg-teal-700 transform hover:-translate-y-0.5 ${isSavingSettings ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CheckCircle size={20} />
                  {isSavingSettings ? 'Saving Changes...' : 'Save Site Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h2>
                <p className="text-gray-600">Create, edit, and manage blog posts</p>
              </div>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setBlogForm({
                    title: '',
                    excerpt: '',
                    content: '',
                    featured_image: '',
                    category: 'general',
                    tags: '',
                    status: 'draft',
                    author: 'Admin'
                  });
                  setBlogFormError('');
                  setShowBlogForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Blog Post
              </button>
            </div>

            {/* Blog Form Modal */}
            {showBlogForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowBlogForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>

                    {blogFormError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{blogFormError}</p>
                      </div>
                    )}

                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                            placeholder="Blog post title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={blogForm.category}
                            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          >
                            <option value="general">General</option>
                            <option value="wellness">Wellness</option>
                            <option value="education">Education</option>
                            <option value="service">Service</option>
                            <option value="sports">Sports</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Excerpt
                        </label>
                        <textarea
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          placeholder="Brief description of the blog post"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        <RichTextEditor
                          content={blogForm.content}
                          onChange={(content) => setBlogForm({ ...blogForm, content })}
                          placeholder="Write your blog post content here..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Featured Image
                          </label>
                          <div className="space-y-4">
                            {blogForm.featured_image && (
                              <div className="relative">
                                <Image
                                  src={blogForm.featured_image}
                                  alt="Featured image preview"
                                  width={400}
                                  height={192}
                                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setBlogForm({ ...blogForm, featured_image: '' })}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    uploadFeaturedImage(file);
                                  }
                                }}
                                className="hidden"
                                id="featured-image-upload"
                                disabled={isUploadingImage}
                              />
                              <label
                                htmlFor="featured-image-upload"
                                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                              >
                                {isUploadingImage ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Featured Image</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={blogForm.tags}
                            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                            placeholder="wellness, IV therapy, health"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author
                          </label>
                          <input
                            type="text"
                            value={blogForm.author}
                            onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                            placeholder="Author name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={blogForm.status}
                            onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as 'draft' | 'published' | 'archived' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setShowBlogForm(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Blogs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Blog Posts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {blog.title}
                            </div>
                            {blog.excerpt && (
                              <div className="text-sm text-gray-500 truncate">
                                {blog.excerpt}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold text-teal-600 bg-teal-100 rounded-full">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' :
                            blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {blog.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(blog.published_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-900"
                              title="View"
                            >
                              <ViewIcon className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => editBlog(blog)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteBlog(blog.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {blogs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-500">Create your first blog post to get started.</p>
              </div>
            )}
          </>
        )}

        {/* Contact Submissions Tab */}
        {activeTab === 'contact' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h2>
              <p className="text-gray-600">View and manage messages from your customers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Messages</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contactSubmissions.filter(s => s.status === 'new').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Read</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contactSubmissions.filter(s => s.status === 'read').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Edit className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Replied</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contactSubmissions.filter(s => s.status === 'replied').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Archived</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contactSubmissions.filter(s => s.status === 'archived').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={contactSearchTerm}
                    onChange={(e) => {
                      setContactSearchTerm(e.target.value);
                      setContactCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={contactStatusFilter}
                    onChange={(e) => {
                      setContactStatusFilter(e.target.value);
                      setContactCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <button
                    onClick={() => setContactSortOrder(contactSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{contactSortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
                    <span>{contactSortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      let filtered = [...contactSubmissions];
                      if (contactStatusFilter !== 'all') {
                        filtered = filtered.filter(s => s.status === contactStatusFilter);
                      }
                      if (contactSearchTerm) {
                        const search = contactSearchTerm.toLowerCase();
                        filtered = filtered.filter(s =>
                          s.name.toLowerCase().includes(search) ||
                          s.email.toLowerCase().includes(search) ||
                          s.message.toLowerCase().includes(search)
                        );
                      }

                      filtered.sort((a, b) => {
                        const dateA = new Date(a.created_at).getTime();
                        const dateB = new Date(b.created_at).getTime();
                        return contactSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                      });

                      const startIndex = (contactCurrentPage - 1) * contactPerPage;
                      const paginated = filtered.slice(startIndex, startIndex + contactPerPage);

                      if (paginated.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                              <p>No submissions found</p>
                            </td>
                          </tr>
                        );
                      }

                      return paginated.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{sub.name}</div>
                            <div className="text-sm text-gray-500">{sub.email}</div>
                            {sub.phone && <div className="text-xs text-gray-400">{sub.phone}</div>}
                          </td>
                          <td className="px-6 py-4">
                            {sub.subject && <div className="text-xs font-bold text-gray-600 mb-1">{sub.subject}</div>}
                            <div className="text-sm text-gray-900 line-clamp-2 max-w-xs" title={sub.message}>
                              {sub.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <select
                                value={sub.status}
                                onChange={(e) => updateContactSubmissionStatus(sub.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-teal-500 focus:border-teal-500"
                              >
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                              </select>
                              <button
                                onClick={() => deleteContactSubmission(sub.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                let filtered = contactSubmissions;
                if (contactStatusFilter !== 'all') {
                  filtered = filtered.filter(s => s.status === contactStatusFilter);
                }
                if (contactSearchTerm) {
                  const search = contactSearchTerm.toLowerCase();
                  filtered = filtered.filter(s =>
                    s.name.toLowerCase().includes(search) ||
                    s.email.toLowerCase().includes(search) ||
                    s.message.toLowerCase().includes(search)
                  );
                }
                const totalPages = Math.ceil(filtered.length / contactPerPage);
                if (totalPages <= 1) return null;

                return (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((contactCurrentPage - 1) * contactPerPage) + 1} to {Math.min(contactCurrentPage * contactPerPage, filtered.length)} of {filtered.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setContactCurrentPage(Math.max(1, contactCurrentPage - 1))}
                        disabled={contactCurrentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setContactCurrentPage(page)}
                          className={`px-3 py-1 border rounded-lg ${page === contactCurrentPage
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setContactCurrentPage(Math.min(totalPages, contactCurrentPage + 1))}
                        disabled={contactCurrentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </main>
    </div >
  );
}
