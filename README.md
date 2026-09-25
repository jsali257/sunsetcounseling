# Sunset Counseling Center, PLLC — Website

Marketing site for a counseling practice in McAllen, Texas. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Every page is prerendered as static HTML.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
```

## Editing content

Nearly all copy lives in **`src/content/site.ts`**: contact details, navigation, services, FAQ, bilingual copy, evaluation and referral text, insurance text, and form options. Change it there. Components only handle presentation.

Photos live in `public/images/` and are imported in `site.ts`: `hero.image` (the office) and `counselor.portrait` (Diana). To swap a photo, replace the file or change the import. Each photo has an `alt` description and a `position` that controls how it is cropped in its frame. `next/image` resizes the photos, serves modern formats, and shows a blurred preview while they load.

## Project structure

```
src/
  app/                    Routes, metadata, sitemap, robots, OG image, icon
    actions/appointment.ts  Server action for the inquiry form
  components/
    layout/               Navbar, MobileNavigation, MobileCTABar, EmergencyNotice, Footer, Logo
    sections/             Hero, Introduction, CounselorProfile, Services (ServiceCard),
                          BilingualSection, SessionFormats (LocationCard, TelehealthCard),
                          EvaluationSection, ProfessionalReferralSection, InsuranceSection,
                          FAQAccordion, AppointmentCTA, PageHeader, LegalPage
    forms/ContactForm.tsx Appointment inquiry form
    ui/                   Button, Container, SectionHeading, Reveal, decorative SVGs
  content/site.ts         All site copy and settings
  lib/                    Validation, delivery, metadata and structured-data helpers
```

Design tokens (colors, fonts, shadows, and the `nav` breakpoint) are defined in `src/app/globals.css` under `@theme`.

## Appointment form

The form validates on the server and delivers the inquiry through one of these, configured in `.env.local` or your host's environment settings:

- **Resend email:** `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL` from a verified domain)
- **Webhook:** `CONTACT_WEBHOOK_URL` (JSON POST to a form service or CRM)

With neither configured, inquiries are logged to the console in development. In production, visitors see a message asking them to call. The form includes a honeypot field for spam, a privacy notice, and a required acknowledgement that it is not for emergencies or sensitive clinical details.

> **Compliance:** the site does not claim to be HIPAA-compliant. Before going live, the practice should choose its hosting and form-delivery providers deliberately. That includes confirming whether a Business Associate Agreement is needed and whether the provider will sign one. Don't add compliance claims to the site unless the deployed systems and agreements support them.

## Before launch: checklist for the practice

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain. The default, `www.sunsetcounselingcenter.com`, is a placeholder.
- [ ] Configure form delivery (see above) and send a test inquiry.
- [ ] Have the practice's compliance or legal advisor review `/privacy`, `/notice-of-privacy-practices`, and `/informed-consent`. These pages are general overviews that point to the official documents given at intake.
- [ ] Optionally add confirmed office hours, accepted insurance plans, or map coordinates to `src/content/site.ts` and to the structured data in `src/lib/structured-data.tsx`. These were left out on purpose because they haven't been verified.
- [ ] If analytics are added, update the Privacy Policy's "Cookies and analytics" section.

## Accessibility and performance

- Semantic landmarks, a skip link, one `h1` per page, and a logical heading order
- Visible focus states and keyboard-operable navigation. The mobile drawer uses native `<dialog>` for focus containment and Escape to close.
- The FAQ uses native `<details>`/`<summary>`, so it works without JavaScript
- Form fields have labels, `aria-invalid`/`aria-describedby` error wiring, and focus moves to the result
- Text colors meet WCAG AA contrast on their backgrounds
- Scroll reveals are subtle, respect `prefers-reduced-motion`, and content stays visible without JavaScript and when printing
- Photos are optimized with `next/image`, and the hero photo is preloaded. Decorative art is inline SVG. Fonts are self-hosted through `next/font`.
