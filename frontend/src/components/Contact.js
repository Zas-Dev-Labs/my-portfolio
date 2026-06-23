import React from 'react';
import { Mail, Globe, ArrowUpRight, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-surface"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label mb-3">Let's Work Together</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-4">
          Got a project in mind?
        </h2>
        <p className="text-gray-400 text-base max-w-xl mx-auto mb-14">
          I'm open to freelance projects, collaborations, and exciting opportunities. Reach out
          and let's build something great together.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {/* Email card */}
          <a
            href="mailto:skr@zasdevlabs.tech"
            data-testid="contact-email-link"
            className="group bg-surface-container rounded-3xl p-8 border border-white/5 hover:border-primary/30 hover:scale-[1.03] transition-all duration-300 text-left flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-container/40 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
              <p className="font-heading font-semibold text-white text-base group-hover:text-primary transition-colors">
                skr@zasdevlabs.tech
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Send an email <ArrowUpRight size={12} />
            </div>
          </a>

          {/* Website card */}
          <a
            href="https://zasdevlabs.tech"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-website-link"
            className="group bg-surface-container rounded-3xl p-8 border border-white/5 hover:border-secondary/30 hover:scale-[1.03] transition-all duration-300 text-left flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-200">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Website</p>
              <p className="font-heading font-semibold text-white text-base group-hover:text-secondary transition-colors">
                zasdevlabs.tech
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              Visit website <ArrowUpRight size={12} />
            </div>
          </a>
        </div>

        {/* CTA button */}
        <a
          href="mailto:skr@zasdevlabs.tech"
          data-testid="contact-cta-btn"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-primary-fg font-semibold hover:brightness-110 transition-all duration-200 shadow-xl shadow-primary/20 text-sm"
        >
          <MessageSquare size={16} />
          Start a Conversation
        </a>
      </div>
    </section>
  );
}
