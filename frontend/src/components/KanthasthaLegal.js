import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  Mic,
  Volume2,
  BookOpen,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  UserCheck,
  Lock,
  Mail,
  Globe
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function KanthasthaLegal({ initialTab = 'privacy' }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('terms') || initialTab === 'terms' ? 'terms' : 'privacy'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname.includes('terms')) {
      setActiveTab('terms');
      document.title = 'Terms of Use — Kantastha: Recite & Memorize | ZasDevLabs';
    } else if (location.pathname.includes('privacy')) {
      setActiveTab('privacy');
      document.title = 'Privacy Policy — Kantastha: Recite & Memorize | ZasDevLabs';
    } else {
      document.title = activeTab === 'terms'
        ? 'Terms of Use — Kantastha: Recite & Memorize | ZasDevLabs'
        : 'Privacy Policy — Kantastha: Recite & Memorize | ZasDevLabs';
    }
    return () => {
      document.title = 'Sashi Kiran Rao | ZasDevLabs';
    };
  }, [location.pathname, activeTab]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const privacySections = [
    {
      id: 'overview',
      title: '1. Overview & Scope',
      icon: <Shield size={18} className="text-primary" />,
      content: `This Privacy Policy governs the Kanthastha ("Kantastha: Recite & Memorize") Android application ("the App", "our App"), created and maintained by ZasDevLabs (developed by Sashi Kiran Rao). 

Kanthastha is designed to help users, students, and spiritual practitioners learn, recite, and memorize sacred Slokas, Stotras, and Vedic chants. It features a curated Base Library of standard Slokas, an interface to build a personalized Custom Sloka Library, intelligent stanza chunking for pronunciation, Text-to-Speech (TTS) playback, and microphone-based voice recording for pronunciation self-verification and practice.

We prioritize your privacy above all else. Our App follows a strict local-first, privacy-by-design architecture: your custom slokas, audio recordings, and learning progress remain securely on your device.`
    },
    {
      id: 'information-collected',
      title: '2. Information We Process & Collect',
      icon: <Database size={18} className="text-primary" />,
      content: `We collect and process minimal data strictly required to deliver the core chanting and pronunciation features:

• User-Created Sloka Library: Any custom slokas, verses, transliterations, translations, notes, tags, and categories you add through the app's interface are stored locally on your Android device in the application's internal database (e.g., SQLite / Room / local storage). We do not transmit or store your custom library on remote cloud servers unless you explicitly configure an optional backup service.

• Voice Recordings & Audio Data (Microphone): When you use the pronunciation practice feature to record your voice and verify your chanting cadence against chunked phrases, the audio is recorded directly through your device microphone.
  - Local Processing: Audio files are processed and saved locally in your app-specific internal directory.
  - No Voice Harvesting: Your voice recordings are NEVER uploaded to external servers, never sold, never shared with third parties, and NEVER used to train public AI voice models or biometric tracking systems.
  - User Deletion: You can review, play back, re-record, or delete your recordings at any time.

• Text-to-Speech (TTS) Processing: When you listen to chunked stanzas, the text phrases are passed to the device's native on-device Android Text-To-Speech engine (such as Google TTS or device default speech synthesis) to render spoken audio. No personal user data is attached to these TTS rendering requests.

• Device & Non-Personal Diagnostic Data: To ensure stability across thousands of Android device models and OS versions, the app may collect anonymous technical diagnostics (e.g., device model, Android OS version, crash stack traces, and app version) via standard Google Play Console reports. This data cannot be used to personally identify you.`
    },
    {
      id: 'permissions',
      title: '3. Android Device Permissions & Justification',
      icon: <Lock size={18} className="text-primary" />,
      content: `The App requests only the essential Android runtime permissions required for its educational and pronunciation functionality:

1. RECORD_AUDIO (Microphone Permission):
   - Purpose: Enables you to record your voice while practicing chunked sloka stanzas to verify and improve your pronunciation, rhythm, and intonation.
   - Control: You are prompted at runtime to grant or deny this permission. You may revoke it at any time in Android Settings > Apps > Permissions. If revoked, audio recording will be disabled, but you can still use the base library, custom library builder, and TTS playback.

2. Internal Storage & File Access:
   - Purpose: Saves your custom slokas, stanzas, phonetic chunk configurations, bookmarks, and audio practice clips within the app's private internal sandbox.
   - Security: Sandboxed so other third-party apps on your device cannot access your private recordings or custom sloka notes without authorization.

3. INTERNET (Network Access):
   - Purpose: Used solely for checking standard library updates, downloading optional audio pronunciation packs/fonts, and loading this privacy policy or support pages.`
    },
    {
      id: 'data-storage',
      title: '4. Data Storage, Retention & Security',
      icon: <CheckCircle2 size={18} className="text-secondary" />,
      content: `• Local-First Storage: All personal slokas, recordings, and learning metrics are retained on your physical device. 
• Complete Data Deletion: Because data is stored locally, clearing the app's data in Android Settings or uninstalling the app permanently deletes all custom slokas, practice logs, and audio recordings from your device.
• Security Measures: We follow Android platform security best practices, utilizing private internal storage, secure scoped storage APIs, and HTTPS encryption for any network communications.`
    },
    {
      id: 'third-party',
      title: '5. Third-Party Services & Dependencies',
      icon: <Layers size={18} className="text-primary" />,
      content: `The App relies on trusted, standard Android operating system modules:

• Android Text-To-Speech (TTS) Engine: Operates subject to Google Play / Android system privacy policies. Most modern devices process TTS entirely offline.
• Google Play Services: Used for app delivery, license validation, and automatic in-app updates in accordance with Google Play Developer Policies (https://policies.google.com/privacy).
• No Third-Party Ad Networks: The App does not integrate third-party advertising SDKs, data brokers, or behavioral analytics trackers.`
    },
    {
      id: 'children',
      title: '6. Children’s Privacy (COPPA & Family Compliance)',
      icon: <UserCheck size={18} className="text-secondary" />,
      content: `Our Sloka Learning application is family-friendly, educational, and suitable for learners of all ages, including children learning traditional cultural chants and hymns under the guidance of parents, schools, or spiritual instructors.

We do not knowingly collect, solicit, or store personal identifiable information from children under the age of 13 (or under the applicable age limit in your jurisdiction). Because the app operates locally without mandatory account registration, children can safely use the pronunciation tools without risk of data harvesting.`
    },
    {
      id: 'user-rights',
      title: '7. User Rights & Data Control',
      icon: <Sparkles size={18} className="text-primary" />,
      content: `You maintain complete sovereignty over your data:

• Right to Access & Edit: You can view and edit all custom slokas, stanzas, translations, and notes directly inside the application.
• Right to Erase: You can delete individual audio recordings or custom slokas at any time from the app UI, or wipe all data via Android Settings.
• Right to Export: Future updates may include JSON/Text export options for your custom library so you never lose your curated chants.`
    },
    {
      id: 'policy-changes',
      title: '8. Changes to This Privacy Policy',
      icon: <FileText size={18} className="text-primary" />,
      content: `We may periodically update this Privacy Policy to reflect new features (such as cloud synchronization, new audio analysis tools, or regulatory updates). Any changes will be posted on this page with an updated "Last Revised" date. We recommend checking this page periodically.`
    },
    {
      id: 'contact',
      title: '9. Developer Contact & Inquiries',
      icon: <Mail size={18} className="text-primary" />,
      content: `If you have questions, feedback, or privacy-related requests regarding the Sloka Learning Android app, please reach out to us:

Developer: Sashi Kiran Rao (ZasDevLabs)
Email: skr@zasdevlabs.tech / mskiranrao@gmail.com
Website: https://zasdevlabs.tech
Location: Bengaluru / Karnataka, India`
    }
  ];

  const termsSections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText size={18} className="text-primary" />,
      content: `By downloading, installing, accessing, or using the Kanthastha ("Kantastha: Recite & Memorize") Android application ("the App"), you agree to be bound by these Terms of Use ("Terms"). These Terms constitute a binding legal agreement between you ("User" or "you") and ZasDevLabs (operated by Sashi Kiran Rao).

If you do not agree with any part of these Terms, please do not download, install, or use the App.`
    },
    {
      id: 'license',
      title: '2. License Grant & Permitted Use',
      icon: <Shield size={18} className="text-primary" />,
      content: `ZasDevLabs grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the App on compatible Android devices strictly for your personal, educational, non-commercial devotional study and pronunciation practice.

You agree that you will not:
• Reverse engineer, decompile, disassemble, or attempt to derive the source code or proprietary chunking algorithms of the App.
• Modify, adapt, translate, rent, lease, loan, sell, distribute, or create derivative software based on the App.
• Use the App for any unlawful, disruptive, or infringing purpose.`
    },
    {
      id: 'content-disclaimer',
      title: '3. Base Library & Cultural Content Disclaimer',
      icon: <BookOpen size={18} className="text-primary" />,
      content: `• Cultural & Spiritual Heritage: The classical Sanskrit Slokas, Stotras, Mantras, and verses provided in the App's Base Library belong to the public domain and represent rich traditional, philosophical, and spiritual literature.
• Transliteration & Phonetic Division: ZasDevLabs provides syllabic chunking, Romanized IAST transliteration, and Text-to-Speech phonetic guidance in good faith to assist learners.
• Regional & Traditional Nuances: Traditional chanting styles, meter (Chandas), intonation (Svara), and pronunciation rules may vary across different Vedic schools, Sampradayas, and regional traditions. The App is an educational aid and does not substitute for personalized instruction from an authorized Acharya, Guru, or Sanskrit scholar.`
    },
    {
      id: 'user-library',
      title: '4. User-Generated Content & Custom Library',
      icon: <Database size={18} className="text-primary" />,
      content: `• User Responsibility: You are solely responsible for any text, translations, transliterations, stanzas, audio clips, and notes that you create, import, or store in your personal Custom Sloka Library.
• Prohibited Content: You agree not to input content that is defamatory, hateful, abusive, infringing on third-party copyrights, or otherwise unlawful.
• Local Ownership: You retain ownership of your user-authored notes and custom arrangements. ZasDevLabs claims no intellectual property ownership over your personal creations.`
    },
    {
      id: 'voice-practice',
      title: '5. Voice Recording & Pronunciation Features',
      icon: <Mic size={18} className="text-secondary" />,
      content: `• Practice Tool Only: The microphone recording and playback tools are intended solely for self-reflection and pronunciation improvement.
• Automated Evaluation: Any automated score, waveform comparison, or speech evaluation provided by the App is algorithmically generated and provided for instructional guidance only.`
    },
    {
      id: 'intellectual-property',
      title: '6. Intellectual Property Rights',
      icon: <Sparkles size={18} className="text-primary" />,
      content: `All rights, title, and interest in and to the App — including but not limited to the software code, interface design, graphic assets, animations, icons, chunking logic, sound synthesis arrangements, and brand trademarks ("ZasDevLabs") — are the exclusive property of ZasDevLabs / Sashi Kiran Rao. All rights not expressly granted to you are reserved.`
    },
    {
      id: 'warranties',
      title: '7. Disclaimer of Warranties ("AS IS")',
      icon: <AlertCircle size={18} className="text-amber-400" />,
      content: `THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

ZasDevLabs does not guarantee that the App will be uninterrupted, error-free, compatible with every Android device or OS custom skin, or that TTS voices generated by third-party Android engines will meet your specific aesthetic expectations.`
    },
    {
      id: 'liability',
      title: '8. Limitation of Liability',
      icon: <Lock size={18} className="text-primary" />,
      content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ZASDEVLABS, SASHI KIRAN RAO, OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF DATA, DEVICE DAMAGE, OR BUSINESS INTERRUPTION) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE APP.`
    },
    {
      id: 'termination',
      title: '9. Updates, Termination & Governing Law',
      icon: <FileText size={18} className="text-primary" />,
      content: `• Updates: We may update the App periodically via Google Play to introduce new features, expand the base library, or fix bugs.
• Termination: Your right to use the App terminates automatically if you violate any provision of these Terms.
• Governing Law: These Terms shall be governed by and construed in accordance with the laws of Karnataka, India, without regard to conflict of law principles.
• Inquiries: For questions regarding these Terms, contact skr@zasdevlabs.tech.`
    }
  ];

  const currentSections = activeTab === 'privacy' ? privacySections : termsSections;
  const filteredSections = currentSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-white font-body selection:bg-primary/20 selection:text-primary">
      {/* Top sticky navigation */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
          <Link
            to="/"
            data-testid="sloka-legal-back-home"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Portfolio</span>
          </Link>

          <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <Logo size={28} />
            <span className="font-heading font-bold text-primary text-sm hidden sm:inline-block">
              ZasDevLabs
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Banner with Feature Badges */}
      <div className="bg-surface border-b border-white/5 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container/80 text-secondary border border-secondary/30">
                  <Sparkles size={12} />
                  Publishing Soon on Google Play
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                  Android Application Legal Documentation
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/kanthastha_icon.jpg"
                  alt="Kanthastha App Icon"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 shadow-xl object-cover shrink-0"
                />
                <div>
                  <h1
                    data-testid="kanthastha-legal-title"
                    className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
                  >
                    Kantastha: Recite &amp; Memorize
                  </h1>
                  <p className="text-secondary text-xs sm:text-sm font-medium tracking-wide">
                    Android Sloka Learning &amp; Pronunciation Companion by ZasDevLabs
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-6">
                Official Privacy Policy and Terms of Use for <strong className="text-white font-medium">Kanthastha</strong> ("Kantastha: Recite &amp; Memorize") — featuring pre-defined &amp; custom Sloka libraries, phonetic stanza chunking, Text-to-Speech playback, and microphone-based pronunciation practice.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface-container group">
                <img
                  src="/kanthastha_banner.jpg"
                  alt="Kanthastha Feature Graphic"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
                  <span>Kanthastha Feature Graphic</span>
                  <span className="text-secondary">v1.0 Preview</span>
                </div>
              </div>
            </div>
          </div>

          {/* App Core Architectural Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-6 border-t border-white/5">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BookOpen size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Base &amp; Custom Library</p>
                <p className="text-[11px] text-gray-500">Curated &amp; user chants</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Layers size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Stanza Chunking</p>
                <p className="text-[11px] text-gray-500">Phonetic breakdowns</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Volume2 size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Text-to-Speech</p>
                <p className="text-[11px] text-gray-500">On-device cadence audio</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Mic size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Voice Practice</p>
                <p className="text-[11px] text-gray-500">Local audio recording</p>
              </div>
            </div>
          </div>

          {/* Tab Selector & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 p-1 bg-surface-container rounded-2xl border border-white/10">
              <button
                data-testid="tab-privacy-policy"
                onClick={() => {
                  setActiveTab('privacy');
                  window.history.replaceState(null, '', '/kanthastha/privacy-policy');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'privacy'
                    ? 'bg-primary text-primary-fg shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield size={16} />
                Privacy Policy
              </button>

              <button
                data-testid="tab-terms-of-use"
                onClick={() => {
                  setActiveTab('terms');
                  window.history.replaceState(null, '', '/kanthastha/terms-of-use');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'terms'
                    ? 'bg-primary text-primary-fg shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={16} />
                Terms of Use
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                data-testid="btn-share-legal"
                title="Copy shareable link"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={handlePrint}
                data-testid="btn-print-legal"
                title="Print or Save as PDF"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
              >
                <Download size={14} />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Navigation & Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            {/* Search Filter */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'privacy' ? 'Privacy' : 'Terms'} sections...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick TOC */}
            <div className="bg-surface rounded-3xl p-5 border border-white/5">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
                {activeTab === 'privacy' ? 'Privacy Policy Sections' : 'Terms of Use Sections'}
              </p>
              <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {currentSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center justify-between p-2 rounded-xl text-xs text-gray-400 hover:text-primary hover:bg-white/[0.03] transition-colors group"
                  >
                    <span className="truncate pr-2">{sec.title}</span>
                    <ChevronRight size={13} className="text-gray-600 group-hover:text-primary shrink-0" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Direct Static HTML URLs Box for Google Play Console */}
            <div className="bg-surface rounded-3xl p-5 border border-white/5 text-xs text-gray-400 space-y-3">
              <div className="flex items-center gap-2 text-white font-medium">
                <Globe size={14} className="text-primary" />
                <span>Direct URLs for Store Listings</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Direct static HTML files are also available for Google Play Console submission:
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <a
                  href="/kanthastha-privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-black/30 hover:bg-black/50 text-primary border border-primary/20 transition-colors"
                >
                  <span className="truncate">/kanthastha-privacy.html</span>
                  <ExternalLink size={12} className="shrink-0 ml-1" />
                </a>
                <a
                  href="/kanthastha-terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-black/30 hover:bg-black/50 text-primary border border-primary/20 transition-colors"
                >
                  <span className="truncate">/kanthastha-terms.html</span>
                  <ExternalLink size={12} className="shrink-0 ml-1" />
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Policy Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500 pb-2">
              <span>
                Document Status: <span className="text-secondary font-medium">Active</span>
              </span>
              <span>Effective Date: August 2026</span>
            </div>

            {filteredSections.length === 0 ? (
              <div className="bg-surface rounded-3xl p-10 text-center border border-white/5">
                <Search size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-300 font-medium mb-1">No matching sections found</p>
                <p className="text-xs text-gray-500">Try searching for keywords like "microphone", "audio", "library", or "license"</p>
              </div>
            ) : (
              filteredSections.map((sec, index) => (
                <article
                  key={sec.id}
                  id={sec.id}
                  data-testid={`legal-section-${sec.id}`}
                  className="bg-surface rounded-3xl p-6 sm:p-8 border border-white/5 hover:border-white/10 transition-colors scroll-mt-24 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {sec.icon}
                    </div>
                    <h2 className="font-heading font-semibold text-white text-lg sm:text-xl">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line space-y-3 font-normal">
                    {sec.content}
                  </div>
                </article>
              ))
            )}

            {/* Quick Footer summary card */}
            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Need assistance or have feedback?</p>
                <p className="text-xs text-gray-400">Our developer team is available to help with any inquiries.</p>
              </div>
              <a
                href="mailto:skr@zasdevlabs.tech"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-fg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
              >
                <Mail size={14} />
                Contact Developer
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer strip */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-8 bg-surface-container mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Sashi Kiran Rao &middot; ZasDevLabs. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Website Privacy
            </Link>
            <span>&middot;</span>
            <Link to="/kanthastha/privacy-policy" className="hover:text-primary transition-colors">
              Kanthastha Privacy
            </Link>
            <span>&middot;</span>
            <Link to="/kanthastha/terms-of-use" className="hover:text-primary transition-colors">
              Kanthastha Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
