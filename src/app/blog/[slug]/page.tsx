'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (!response.ok) {
        throw new Error('Blog not found');
      }
      const data = await response.json();
      setBlog(data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowLeft className="h-12 w-12 text-teal-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Blog Not Found</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">The blog post you're looking for doesn't exist or may have been moved.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="h-6 w-6" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Featured Image - Full Height */}
      {blog.featured_image && (
        <div className="relative w-full h-screen max-h-[80vh] overflow-hidden">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Article Content */}
      <article className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {/* Back Button - Moved to content area */}
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Blog
              </Link>
            </div>
            {/* Header */}
            <header className="mb-16">
              {/* Category */}
              <div className="mb-6">
                <span className="inline-block px-6 py-3 text-sm font-semibold text-teal-600 bg-gradient-to-r from-teal-50 to-teal-100 rounded-full border border-teal-200">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-8 text-gray-500 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{formatDate(blog.published_at)}</span>
                </div>
                <button
                  onClick={shareBlog}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-12">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: blog.content.replace(/\n/g, '<br />')
                }}
              />
            </div>

            {/* Share Section */}
            <div className="mt-20 pt-12 border-t border-gray-200">
              <div className="text-center bg-gradient-to-r from-gray-50 to-teal-50 rounded-2xl p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Found this helpful?</h3>
                <p className="text-gray-600 mb-8 text-lg">Share it with others who might benefit from this information</p>
                <button
                  onClick={shareBlog}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Share2 className="h-6 w-6" />
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
