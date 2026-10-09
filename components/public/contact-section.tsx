'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface ContactSectionProps {
  contact: {
    email: string;
    phone: string;
    location: string;
    timezone: string;
    agent: string;
    availabilityStatus: string;
  };
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Commercial Campaign',
    timeline: 'Within 3 Months',
    budget: '$10k - $25k',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'Commercial Campaign',
        timeline: 'Within 3 Months',
        budget: '$10k - $25k',
        message: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white border-b border-neutral-200 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block mb-2">
              Commissions & Bookings // 2026 — 2027
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Initiate A Project
            </h2>
          </div>
          {contact.availabilityStatus && (
            <div className="inline-flex items-center space-x-2 border border-black dark:border-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-black dark:text-white">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
              <span>{contact.availabilityStatus}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              For narrative scripts, commercial treatments, fashion films, or destination wedding inquiries, please provide project scope, location, and prospective timeline below.
            </p>

            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-900 text-xs font-mono">
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Direct Inquiries</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-semibold text-black dark:text-white hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Phone / Signal</span>
                    <span className="text-black dark:text-white">{contact.phone}</span>
                  </div>
                </div>
              )}

              {contact.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Base & Travel</span>
                    <span className="text-black dark:text-white">{contact.location}</span>
                  </div>
                </div>
              )}

              {contact.agent && (
                <div className="flex items-start space-x-3 pt-2 border-t border-neutral-200 dark:border-neutral-900">
                  <Globe className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Representation</span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-normal">{contact.agent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-black dark:text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Inquiry Transmitted</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  Thank you for sharing your project details. We review treatments and production inquiries within 24 to 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  type="button"
                  className="mt-4 px-6 py-2.5 border border-black dark:border-white text-xs uppercase tracking-widest font-mono text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 border border-red-500/50 bg-red-950/20 text-red-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@studio.com"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Company / Agency */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                      Company / Studio
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Agency or Independent"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                      Project Format
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                    >
                      <option value="Commercial Campaign">Commercial Campaign</option>
                      <option value="Feature Film / Documentary">Feature Film / Documentary</option>
                      <option value="Short Film / Narrative">Short Film / Narrative</option>
                      <option value="Music Video">Music Video</option>
                      <option value="Wedding Film">Destination Wedding Film</option>
                      <option value="Post / Color Grading Only">Post / Color Grading Only</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                      Target Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                    >
                      <option value="Under $10,000">Under $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                      <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                      <option value="Private / Custom Commission">Private / Custom Commission</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
                    Project Brief & Scope *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details on project concept, shoot locations, desired aspect ratio, and key shoot dates..."
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Submit button: Strictly black in light mode, white in dark mode */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting Inquiries...' : 'Submit Project Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
