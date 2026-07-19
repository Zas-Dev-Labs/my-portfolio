import React, { useState } from 'react';
import { Mail, Globe, ArrowUpRight, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.detail || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-surface"
    >
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">Let's Work Together</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-4">
          Got a project in mind?
        </h2>
        <p className="text-gray-400 text-base max-w-xl mb-12">
          I'm open to freelance projects, collaborations, and exciting opportunities. Drop a
          message and I'll get back to you.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — contact info */}
          <div className="flex flex-col gap-4">
            <a
              href="mailto:skr@zasdevlabs.tech"
              data-testid="contact-email-link"
              className="group bg-surface-container rounded-3xl p-6 border border-white/5 hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container/40 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200 shrink-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
                <p className="font-heading font-semibold text-white text-sm group-hover:text-primary transition-colors truncate">
                  skr@zasdevlabs.tech
                </p>
              </div>
              <ArrowUpRight size={14} className="text-gray-600 group-hover:text-primary ml-auto shrink-0 transition-colors" />
            </a>

            <a
              href="https://zasdevlabs.tech"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-website-link"
              className="group bg-surface-container rounded-3xl p-6 border border-white/5 hover:border-secondary/30 hover:scale-[1.02] transition-all duration-300 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-200 shrink-0">
                <Globe size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Website</p>
                <p className="font-heading font-semibold text-white text-sm group-hover:text-secondary transition-colors truncate">
                  zasdevlabs.tech
                </p>
              </div>
              <ArrowUpRight size={14} className="text-gray-600 group-hover:text-secondary ml-auto shrink-0 transition-colors" />
            </a>

            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 mt-1">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Find me on</p>
              <div className="flex gap-3">
                {/* TODO: Replace # with actual GitHub URL */}
                <a
                  href="#"
                  data-testid="contact-github-link"
                  aria-label="GitHub — Coming Soon"
                  title="GitHub — Coming Soon"
                  className="flex items-center gap-2.5 bg-surface px-4 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 transition-all duration-200 text-sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                  GitHub
                  <span className="text-[10px] text-gray-600 bg-surface-container px-1.5 py-0.5 rounded-full">Soon</span>
                </a>
                {/* TODO: Replace # with actual Instagram URL */}
                <a
                  href="#"
                  data-testid="contact-instagram-link"
                  aria-label="Instagram — Coming Soon"
                  title="Instagram — Coming Soon"
                  className="flex items-center gap-2.5 bg-surface px-4 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-secondary hover:border-secondary/30 transition-all duration-200 text-sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  Instagram
                  <span className="text-[10px] text-gray-600 bg-surface-container px-1.5 py-0.5 rounded-full">Soon</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="bg-surface-container rounded-3xl p-7 border border-white/5">
            {status === 'success' ? (
              <div
                data-testid="contact-success-message"
                className="h-full flex flex-col items-center justify-center text-center py-8 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-secondary-container/40 border border-secondary/30 flex items-center justify-center text-secondary">
                  <CheckCircle size={28} />
                </div>
                <h3 className="font-heading font-semibold text-white text-xl">Message Sent!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Thanks for reaching out. I'll get back to you at{' '}
                  <span className="text-primary">{form.email || 'your email'}</span> as soon as possible.
                </p>
                <button
                  data-testid="contact-send-another-btn"
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-sm text-gray-400 hover:text-primary transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                data-testid="contact-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <h3 className="font-heading font-semibold text-white text-lg mb-1">
                  Send a Message
                </h3>

                <div>
                  <label htmlFor="name" className="block text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    data-testid="contact-name-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full bg-surface border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    data-testid="contact-email-input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-surface border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    data-testid="contact-message-input"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className="w-full bg-surface border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div
                    data-testid="contact-error-message"
                    className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm"
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  data-testid="contact-submit-btn"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-primary-fg font-semibold hover:brightness-110 transition-all duration-200 shadow-lg shadow-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
