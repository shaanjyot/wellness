'use client';

import { Config } from "@puckeditor/core";
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layout as LayoutIcon,
  Table as TableIcon,
  Columns,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Layers,
  MousePointer2,
  Info,
  Droplets,
  List,
  Type,
  GalleryVertical,
  TableProperties
} from 'lucide-react';
import { useState } from 'react';
import PuckImageField from '@/components/PuckImageField';

// Reusable custom image field with upload + preview
const imageField = (label: string = "Image") => ({
  type: "custom" as const,
  label,
  render: (props: any) => (
    <PuckImageField {...props} />
  )
});

export const config: any = {
  root: {
    fields: {
      title: { type: "text" },
      description: { type: "textarea" },
      keywords: { type: "text" },
    },
    render: ({ children }: any) => {
      return (
        <main className="puck-root" aria-label="Page Content">
          {children}
        </main>
      );
    },
  },
  categories: {
    Layout: {
      components: ["GenericHeader", "GenericFooter", "SectionHeader", "CallToAction"]
    },
    Content: {
      components: ["Hero", "About", "Services"]
    },
    Interactive: {
      components: ["Tabs", "Carousel", "Gallery", "Table"]
    }
  },
  components: {
    GenericHeader: {
      label: "Header",
      fields: {
        logo_text: { type: "text" },
        logo_aria_label: { type: "text" },
        links: {
          type: "array",
          getItemSummary: (item: any) => item?.label || "Link",
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
            aria_label: { type: "text" }
          }
        },
        cta_text: { type: "text" },
        cta_href: { type: "text" },
        cta_aria_label: { type: "text" }
      },
      defaultProps: {
        logo_text: "Wellness IV",
        logo_aria_label: "Wellness IV Drip Home",
        links: [
          { label: "Home", href: "/", aria_label: "Go to homepage" },
          { label: "Services", href: "/services", aria_label: "View our services" },
          { label: "About", href: "/about", aria_label: "About us" },
          { label: "Contact", href: "/contact", aria_label: "Contact us" }
        ],
        cta_text: "Book Now",
        cta_href: "/booking",
        cta_aria_label: "Book a therapy session"
      },
      render: ({ logo_text, logo_aria_label, links, cta_text, cta_href, cta_aria_label }: any) => (
        <header role="banner" className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" aria-label={logo_aria_label || logo_text} className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-amber-500 bg-clip-text text-transparent">
              {logo_text}
            </Link>
            <nav role="navigation" aria-label="Main Navigation" className="hidden md:flex space-x-8">
              {Array.isArray(links) && links.map((link: any, idx: number) => (
                <Link key={idx} href={link.href || "#"} aria-label={link.aria_label || link.label} className="text-gray-600 hover:text-teal-500 font-medium transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href={cta_href || "/booking"}
              aria-label={cta_aria_label || cta_text}
              className="bg-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none"
            >
              {cta_text}
            </Link>
          </div>
        </header>
      )
    },
    GenericFooter: {
      label: "Footer",
      fields: {
        company_name: { type: "text" },
        description: { type: "textarea" },
        social_links: {
          type: "array",
          getItemSummary: (item: any) => item?.platform || "Social Link",
          arrayFields: {
            platform: { type: "select", options: [{ label: "Facebook", value: "facebook" }, { label: "Instagram", value: "instagram" }, { label: "Twitter", value: "twitter" }] },
            href: { type: "text" },
            aria_label: { type: "text" }
          }
        } as any,
        contact_info: {
          type: "object",
          fields: {
            email: { type: "text" },
            phone: { type: "text" },
            address: { type: "text" }
          }
        } as any
      },
      defaultProps: {
        company_name: "Wellness IV Drip Canberra",
        description: "Premium mobile IV vitamin therapy delivered to your doorstep.",
        contact_info: {
          email: "info@wellnessiv.com",
          phone: "0400 000 000",
          address: "Canberra, ACT"
        }
      },
      render: ({ company_name, description, social_links, contact_info }: any) => (
        <footer role="contentinfo" className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4">{company_name}</h2>
              <p className="text-gray-400 mb-6 font-medium">{description}</p>
              <div className="flex space-x-4">
                {Array.isArray(social_links) && social_links.map((social: any, idx: number) => (
                  <a
                    key={idx}
                    href={social.href || "#"}
                    aria-label={social.aria_label || `Visit our ${social.platform}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {social.platform === 'facebook' && <Facebook size={20} />}
                    {social.platform === 'instagram' && <Instagram size={20} />}
                    {social.platform === 'twitter' && <Twitter size={20} />}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4 text-white">Contact Us</h2>
              <address className="not-italic space-y-3 text-gray-400">
                <div className="flex items-center gap-2 font-medium">
                  <Mail size={16} aria-hidden="true" />
                  <a href={`mailto:${contact_info?.email}`} className="hover:text-teal-400">{contact_info?.email}</a>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Phone size={16} aria-hidden="true" />
                  <a href={`tel:${contact_info?.phone}`} className="hover:text-teal-400">{contact_info?.phone}</a>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={16} aria-hidden="true" /> {contact_info?.address}
                </div>
              </address>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4 text-white">Quick Links</h2>
              <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-2 text-gray-400">
                <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
                <Link href="/services" className="hover:text-white transition-colors font-medium">Services</Link>
                <Link href="/about" className="hover:text-white transition-colors font-medium">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors font-medium">Contact</Link>
              </nav>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} {company_name}. All rights reserved.</p>
          </div>
        </footer>
      )
    },
    CallToAction: {
      label: "CTA Section",
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        button_text: { type: "text" },
        button_href: { type: "text" },
        button_aria_label: { type: "text" },
        theme: { type: "select", options: [{ label: "Dark", value: "dark" }, { label: "Light", value: "light" }, { label: "Accent", value: "accent" }] }
      },
      defaultProps: {
        title: "Ready to Start Your Wellness Journey?",
        description: "Book your personal IV therapy session today.",
        button_text: "Book Appointment",
        button_href: "/booking",
        button_aria_label: "Book your appointment now",
        theme: "accent"
      },
      render: ({ title, description, button_text, button_href, button_aria_label, theme }: any) => {
        const themes: any = {
          dark: "bg-gray-900 text-white",
          light: "bg-white text-gray-900 border border-gray-100",
          accent: "bg-gradient-to-r from-teal-500 to-amber-500 text-white"
        };
        return (
          <section className={`${themes[theme] || themes.accent} py-20 px-6 text-center`} aria-labelledby="cta-heading">
            <div className="max-w-3xl mx-auto">
              <h2 id="cta-heading" className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
              <p className={`text-xl mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-white/80'} font-medium`}>{description}</p>
              <Link
                href={button_href}
                aria-label={button_aria_label || button_text}
                className={`inline-block px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg ${theme === 'light' ? 'bg-teal-500 text-white' : 'bg-white text-teal-600'}`}
              >
                {button_text}
              </Link>
            </div>
          </section>
        );
      }
    },
    Hero: {
      label: "Hero",
      fields: {
        heading: { type: "text" },
        subheading: { type: "text" },
        description: { type: "textarea" },
        video_src: imageField("Background Video/Image"),
        video_aria_label: { type: "text" },
        cta_primary_text: { type: "text" },
        cta_primary_link: { type: "text" },
        cta_secondary_text: { type: "text" },
      },
      defaultProps: {
        heading: "Mobile IV Vitamin Therapy Service",
        subheading: "Bespoke IV drips - Delivered in comfort",
        description: "Welcome to Wellness IV Drip Canberra. Need to have a drip today? Book in for a free consultation with our nurses.",
        video_src: "/bg-video.mp4",
        video_aria_label: "Background video showing wellness experience",
        cta_primary_text: "Book an appointment",
        cta_primary_link: "/booking",
        cta_secondary_text: "Watch Video"
      },
      render: ({ heading, subheading, description, video_src, video_aria_label, cta_primary_text, cta_primary_link, cta_secondary_text }: any) => (
        <section className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Hero Section">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            loop
            muted
            playsInline
            src={video_src}
            aria-label={video_aria_label}
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: heading || "" }} />
            <p className="text-2xl md:text-3xl font-light mb-8 text-teal-200" dangerouslySetInnerHTML={{ __html: subheading || "" }} />
            <div className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: description || "" }} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta_primary_link || "/booking"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105"
              >
                {cta_primary_text}
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
                <Play className="mr-2 w-5 h-5" aria-hidden="true" />
                {cta_secondary_text}
              </button>
            </div>
          </div>
        </section>
      ),
    },
    SectionHeader: {
      label: "Section Header",
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        },
        level: {
          type: "select",
          options: [
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" }
          ]
        }
      },
      defaultProps: {
        title: "Section Title",
        subtitle: "Enter a subtitle or description here to provide more context.",
        align: "center",
        level: "h2"
      },
      render: ({ title, subtitle, align, level }: any) => {
        const Tag = level || 'h2';
        return (
          <div className={`py-12 px-4 max-w-7xl mx-auto w-full text-${align}`}>
            <Tag className={`${Tag === 'h2' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} font-bold text-gray-900 mb-4`} dangerouslySetInnerHTML={{ __html: title || "" }} />
            {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: subtitle || "" }} />}
          </div>
        );
      }
    },
    Tabs: {
      label: "Tabs",
      fields: {
        tabs: {
          type: "array",
          getItemSummary: (item: any) => item?.label || "Tab",
          arrayFields: {
            label: { type: "text" },
            content: { type: "textarea" }
          }
        }
      },
      defaultProps: {
        tabs: [
          { label: "Tab 1", content: "Content for tab 1" },
          { label: "Tab 2", content: "Content for tab 2" }
        ]
      },
      render: ({ tabs }: any) => {
        const [activeTab, setActiveTab] = useState(0);
        return (
          <section className="py-12 max-w-7xl mx-auto px-4" aria-label="Tabbed Content">
            <div role="tablist" className="flex border-b border-gray-200 mb-8 overflow-x-auto">
              {Array.isArray(tabs) && tabs.map((tab: any, idx: number) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={activeTab === idx}
                  aria-controls={`tabpanel-${idx}`}
                  id={`tab-${idx}`}
                  onClick={() => setActiveTab(idx)}
                  className={`px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === idx ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {Array.isArray(tabs) && tabs.map((tab: any, idx: number) => (
              <div
                key={idx}
                role="tabpanel"
                id={`tabpanel-${idx}`}
                aria-labelledby={`tab-${idx}`}
                hidden={activeTab !== idx}
                className="prose prose-lg max-w-none text-gray-600 transition-all duration-300"
              >
                <div dangerouslySetInnerHTML={{ __html: tab.content || "" }} />
              </div>
            ))}
          </section>
        );
      }
    },
    Carousel: {
      label: "Carousel",
      fields: {
        items: {
          type: "array",
          getItemSummary: (item: any) => item?.title || "Slide",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            image: imageField("Slide Image"),
            image_alt: { type: "text" },
            link: { type: "text" }
          }
        }
      },
      defaultProps: {
        items: [
          { title: "Slide 1", description: "Description 1", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200", image_alt: "Professional IV drip setup" },
          { title: "Slide 2", description: "Description 2", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200", image_alt: "Customer enjoying therapy session" }
        ]
      },
      render: ({ items }: any) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % (items?.length || 1));
        const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + (items?.length || 1)) % (items?.length || 1));

        if (!items || items.length === 0) return null;

        const currentItem = items?.[currentIndex] || {};

        return (
          <section className="relative h-[500px] w-full overflow-hidden group" aria-roledescription="carousel" aria-label="Promotion Carousel">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
              style={{ backgroundImage: `url(${currentItem.image || ""})` }}
              role="img"
              aria-label={currentItem.image_alt || "Promotion Image"}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{currentItem.title || ""}</h2>
                  <p className="text-xl mb-8 font-medium">{currentItem.description || ""}</p>
                  {currentItem.link && (
                    <Link href={currentItem.link} className="inline-block px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-lg">
                      Learn More
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ChevronLeft size={32} aria-hidden="true" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ChevronRight size={32} aria-hidden="true" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {Array.isArray(items) && items.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={currentIndex === idx}
                  className={`w-3 h-3 rounded-full transition-all ${currentIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </section>
        );
      }
    },
    Gallery: {
      label: "Gallery",
      fields: {
        title: { type: "text" },
        images: {
          type: "array",
          getItemSummary: (item: any) => item?.caption || "Image",
          arrayFields: {
            url: imageField("Gallery Image"),
            caption: { type: "text" },
            alt: { type: "text" }
          }
        }
      },
      defaultProps: {
        title: "Our Gallery",
        images: [
          { url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=600", caption: "Therapy Session", alt: "Client receiving IV therapy" },
          { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600", caption: "Our Facility", alt: "Wellness IV Drip Canberra interior" },
          { url: "https://images.unsplash.com/photo-1576091160550-2173dad99988?auto=format&fit=crop&q=80&w=600", caption: "Professional Care", alt: "Nurse preparing IV drip" }
        ]
      },
      render: ({ title, images }: any) => (
        <section className="py-20 bg-white" aria-label="Image Gallery">
          <div className="max-w-7xl mx-auto px-4">
            {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(images) && images.map((img: any, idx: number) => (
                <figure key={idx} className="relative group overflow-hidden rounded-xl aspect-square">
                  <img src={img.url || ""} alt={img.alt || img.caption || "Gallery image"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <figcaption className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{img.caption || ""}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )
    },
    Table: {
      label: "Table",
      fields: {
        caption: { type: "text" },
        headers: {
          type: "array",
          getItemSummary: (item: any) => item?.text || "Header",
          arrayFields: { text: { type: "text" } }
        } as any,
        rows: {
          type: "array",
          getItemSummary: (item: any) => "Row",
          arrayFields: {
            cells: {
              type: "array",
              getItemSummary: (item: any) => item?.text || "Cell",
              arrayFields: { text: { type: "text" } }
            } as any
          }
        } as any
      },
      defaultProps: {
        caption: "Pricing and Duration Table",
        headers: [{ text: "Service" }, { text: "Price" }, { text: "Duration" }],
        rows: [
          { cells: [{ text: "Hydration" }, { text: "$150" }, { text: "45 mins" }] },
          { cells: [{ text: "Immunity" }, { text: "$200" }, { text: "60 mins" }] }
        ]
      },
      render: ({ caption, headers, rows }: any) => (
        <section className="py-12 max-w-7xl mx-auto px-4 overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {Array.isArray(headers) && headers.map((h: any, i: number) => (
                  <th key={i} scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-900">{h.text || ""}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(rows) && rows.map((row: any, ri: number) => (
                <tr key={ri} className="hover:bg-gray-50 transition-colors">
                  {Array.isArray(row.cells) && row.cells.map((cell: any, ci: number) => (
                    <td key={ci} className="px-6 py-4 text-sm text-gray-600 font-medium">{cell.text || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )
    },
    Services: {
      label: "Services Grid",
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        services: {
          type: "array",
          getItemSummary: (item: any) => item?.title || "Service",
          arrayFields: {
            icon: { type: "text" },
            title: { type: "text" },
            description: { type: "textarea" },
            link: { type: "text" },
            aria_label: { type: "text" }
          }
        }
      },
      defaultProps: {
        title: "Our Services",
        description: "We offer a comprehensive range of mobile IV infusion services tailored to meet your unique wellness needs.",
        services: [
          { icon: "💧", title: "Hydration", description: "Quick rehydration session.", link: "/services", aria_label: "Learn more about Hydration therapy" }
        ]
      },
      render: ({ title, description, services }: any) => (
        <section className="py-20 bg-gray-50" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: title || "" }} />
              <div className="text-xl text-gray-600 max-w-3xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: description || "" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.isArray(services) && services.map((service: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                >
                  <div className="text-4xl mb-4" role="img" aria-label="Service Icon" dangerouslySetInnerHTML={{ __html: service.icon || "" }} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: service.title || "" }} />
                  <div className="text-gray-600 mb-6 flex-grow font-medium" dangerouslySetInnerHTML={{ __html: service.description || "" }} />
                  <Link
                    href={service.link || "/services"}
                    aria-label={service.aria_label || `Learn more about ${service.title}`}
                    className="inline-flex items-center text-teal-500 font-bold hover:text-teal-600 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    },
    About: {
      label: "About Section",
      fields: {
        title: { type: "text" },
        content: {
          type: "array",
          getItemSummary: (item: any) => item?.paragraph?.substring(0, 30) || "Paragraph",
          arrayFields: { paragraph: { type: "textarea" } }
        } as any,
        qualifications: {
          type: "array",
          getItemSummary: (item: any) => item?.item || "Qualification",
          arrayFields: { item: { type: "text" } }
        } as any,
        contact_title: { type: "text" },
        contact_description: { type: "textarea" },
        phone: { type: "text" },
        email: { type: "text" }
      },
      render: ({ title, content, qualifications, contact_title, contact_description, phone, email }: any) => (
        <section className="py-20 bg-white" aria-labelledby="about-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" dangerouslySetInnerHTML={{ __html: title || "" }} />
                {Array.isArray(content) && content.map((para: any, idx: number) => (
                  <div key={idx} className="text-lg text-gray-600 mb-6 font-medium" dangerouslySetInnerHTML={{ __html: para.paragraph || "" }} />
                ))}
                <ul className="space-y-4 mb-8" aria-label="Qualifications">
                  {Array.isArray(qualifications) && qualifications.map((qual: any, idx: number) => (
                    <li key={idx} className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-700 font-bold" dangerouslySetInnerHTML={{ __html: qual.item || "" }} />
                    </li>
                  ))}
                </ul>
              </div>
              <aside className="relative">
                <div className="bg-gradient-to-r from-teal-400 to-amber-400 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: contact_title || "" }} />
                  <div className="mb-6 font-medium" dangerouslySetInnerHTML={{ __html: contact_description || "" }} />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" role="img" aria-label="Phone">☎️</span>
                      <a href={`tel:${phone}`} className="hover:underline font-bold text-lg">{phone}</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" role="img" aria-label="Email">📧</span>
                      <a href={`mailto:${email}`} className="hover:underline font-bold text-lg">{email}</a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )
    },
  },
};
