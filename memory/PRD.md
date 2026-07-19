# ZasDevLabs Portfolio — PRD

## Original Problem Statement
Build a personal portfolio website for Sashi Kiran Rao — Web & Mobile Developer and 3D Print Designer with 12+ years of corporate experience, now freelancing under the brand "ZasDevLabs".

## Owner
- **Name**: Sashi Kiran Rao
- **Brand**: ZasDevLabs
- **Email**: skr@zasdevlabs.tech
- **Website**: zasdevlabs.tech

## Architecture
- **Frontend**: React 18 (CRA), Tailwind CSS, Lucide React icons
- **Backend**: FastAPI (minimal health endpoint)
- **Database**: MongoDB (not actively used yet — future contact form)
- **Design**: Google Material Design 3, Dark theme, Blue (#A8C7FA) + Green (#7DDA9A)
- **Fonts**: Outfit (headings), Roboto (body) via Google Fonts

## Sections Built
1. **Navbar** — Floating pill, ZasDevLabs brand, smooth scroll nav links, mobile hamburger
2. **Hero** — Gradient name, role pills, bio, View Projects + Get in Touch CTAs, ambient orbs
3. **About** — Bio text, 4 stats cards (12+ Years, AI-First, MVC & SPA, Freelance Open)
4. **Skills** — 6 categories: AI/ML, Full Stack, Frontend, Mobile, 3D Design, Dev Tools
5. **Projects** — Tab toggle (Dev Projects | 3D Printing), 3 placeholder cards each with images
6. **Experience** — 4-item vertical timeline (2012–Present)
7. **Contact** — Email + website cards, Start a Conversation CTA
8. **Footer** — Brand, quick links, contact info, scroll-to-top

## What's Implemented (Jun 23, 2025)
- [x] Full single-page portfolio MVP
- [x] Dark Material Design 3 aesthetic
- [x] Floating pill navigation with Z logo mark + social icons
- [x] Responsive (mobile-first)
- [x] All sections with real content
- [x] Project placeholders (Dev + 3D, 3 each)
- [x] Logo placeholder (Z mark, blue-green gradient) in Navbar + Footer
- [x] GitHub and Instagram placeholder social links (Navbar, Contact, Footer)
- [x] Contact form with Resend email integration
- [x] Emails route to mskiranrao@gmail.com (temporary — pending zasdevlabs.tech domain verification)

## Resend Domain Setup (Pending)
To receive form submissions at skr@zasdevlabs.tech:
1. Go to https://resend.com/domains
2. Add zasdevlabs.tech → add DNS records to your domain registrar
3. Once verified, update backend/.env:
   - SENDER_EMAIL=noreply@zasdevlabs.tech
   - OWNER_EMAIL=skr@zasdevlabs.tech
4. Restart backend: sudo supervisorctl restart backend

## Backlog / Next Steps
### P0 (High Priority)
- [ ] Add real project links once launched
- [ ] Finalize ZasDevLabs logo and update brand colors to exact hex values

### P1 (Nice to Have)
- [ ] Contact form with email sending (Resend or SendGrid integration)
- [ ] Add profile photo
- [ ] Social links (GitHub, LinkedIn)
- [ ] Smooth entrance animations (Framer Motion)

### P2 (Future)
- [ ] Blog / articles section
- [ ] Testimonials section
- [ ] 3D printing gallery with real photos
- [ ] SEO optimization (meta tags, OG images)
- [ ] Dark/light mode toggle
