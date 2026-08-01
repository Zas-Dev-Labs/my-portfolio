import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you use the contact form on this website, we collect the following information you voluntarily provide:
    
• Your name
• Your email address
• The content of your message

We do not collect any other personal data. We do not use cookies, tracking pixels, or analytics tools on this website.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `The information you submit through the contact form is used solely to:

• Respond to your inquiry or project request
• Communicate with you regarding potential collaboration or freelance work

Your information is never sold, rented, or shared with third parties for marketing purposes.`,
  },
  {
    title: '3. Third-Party Services',
    content: `This website uses Resend (resend.com) to process and deliver contact form submissions via email. When you submit the contact form, your name, email address, and message are transmitted to Resend's servers for delivery purposes.

Resend operates under its own Privacy Policy, which you can review at https://resend.com/legal/privacy-policy.

No other third-party services, advertising networks, or tracking tools are used on this website.`,
  },
  {
    title: '4. Data Retention',
    content: `Contact form submissions are retained only as long as necessary to respond to your inquiry. We do not store your data in any database on this website — submissions are delivered directly to our email inbox and are subject to standard email retention practices.`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to:

• Request access to any personal data we hold about you
• Request correction or deletion of your personal data
• Withdraw consent to communication at any time

To exercise any of these rights, please contact us directly at skr@zasdevlabs.tech.`,
  },
  {
    title: '6. Data Security',
    content: `We take reasonable technical measures to protect the information transmitted through this website. Contact form data is transmitted over HTTPS and processed by Resend's secure infrastructure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `This website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has submitted personal data through this site, please contact us and we will take steps to remove it.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last Revised" date. Continued use of this website after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: '9. Contact',
    content: `If you have any questions or concerns about this Privacy Policy, please reach out:

Email: skr@zasdevlabs.tech
Website: zasdevlabs.tech`,
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white font-body">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-surface-container/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
          <Link
            to="/"
            data-testid="privacy-back-home"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Portfolio
          </Link>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo size={26} />
            <span className="font-heading font-bold text-primary text-sm hidden sm:block">ZasDevLabs</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-surface border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/40 border border-primary/20 flex items-center justify-center text-primary">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">ZasDevLabs</p>
              <h1
                data-testid="privacy-page-title"
                className="font-heading text-3xl sm:text-4xl font-bold text-white"
              >
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            This Privacy Policy explains how ZasDevLabs (operated by Sashi Kiran Rao) collects,
            uses, and protects any information you provide when using this website.
          </p>
          <p className="text-xs text-gray-600 mt-5">
            <span className="text-gray-500">Last Revised:</span> June 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-14">
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div
              key={i}
              data-testid={`privacy-section-${i}`}
              className="bg-surface rounded-3xl p-7 border border-white/5"
            >
              <h2 className="font-heading font-semibold text-white text-lg mb-4">{sec.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-8 bg-surface-container">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Sashi Kiran Rao &middot; ZasDevLabs. All rights reserved.
          </p>
          <Link
            to="/"
            data-testid="privacy-footer-home-link"
            className="text-xs text-gray-400 hover:text-primary transition-colors"
          >
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
