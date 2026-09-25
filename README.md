# Sunset Counseling Center, PLLC — Website

Website and staff dashboard for a counseling practice in McAllen, Texas. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and MongoDB. Public pages are prerendered as static HTML; the dashboard at `/admin` is rendered on demand behind sign-in.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
npm run create-admin         # create the first dashboard administrator
```

## Editing content

Nearly all copy lives in **`src/content/site.ts`**: contact details, navigation, services, FAQ, bilingual copy, evaluation and referral text, insurance text, and form options. Change it there. Components only handle presentation.

Photos live in `public/images/` and are imported in `site.ts`: `hero.image` (the office) and `counselor.portrait` (Diana). To swap a photo, replace the file or change the import. Each photo has an `alt` description and a `position` that controls how it is cropped in its frame. `next/image` resizes the photos, serves modern formats, and shows a blurred preview while they load.

### Brand assets

The original logo is `public/sunsetlogo.png`. Crops of it in `public/brand/` are used across the site (imported through `src/content/brand.ts`):

| File | Used for |
|---|---|
| `brand/logo-full.png` | Footer, staff login, link-preview image |
| `brand/logo-mark.png` + `brand/logo-script.png` | Header and menu: sunburst plus the "Sunset" script, with "Counseling Center, PLLC" set as real text so it stays legible |
| `src/app/icon.png`, `src/app/apple-icon.png` | Browser tab and home-screen icons (sunburst with slightly thickened rays, so it reads at 16–32px) |

If the logo changes, regenerate them with ImageMagick:

```bash
cd public
magick sunsetlogo.png -trim +repage -resize 900x brand/logo-full.png
magick sunsetlogo.png -crop 1254x640+0+0 +repage -trim +repage -resize 400x brand/logo-mark.png
magick sunsetlogo.png -crop 1254x330+0+640 +repage -trim +repage -resize 480x brand/logo-script.png
```

(The crop offsets assume the current 1254×1254 layout: sunburst on top, script below.)

## Project structure

```
scripts/create-admin.ts    Creates or resets an administrator (npm run create-admin)
src/
  proxy.ts                Redirects signed-out visitors away from /admin
  app/
    (site)/               Public pages (share the site header and footer)
    admin/                Staff dashboard: login, inquiries, stats, team, audit log, account, CSV export
      _actions/           Server actions for sign-in, inquiries, and team management
    actions/appointment.ts  Server action for the inquiry form
  components/
    admin/                Dashboard UI, forms, and charts
    layout/               Navbar, MobileNavigation, MobileCTABar, EmergencyNotice, Footer, Logo
    sections/             Hero, Introduction, CounselorProfile, Services (ServiceCard),
                          BilingualSection, SessionFormats (LocationCard, TelehealthCard),
                          EvaluationSection, ProfessionalReferralSection, InsuranceSection,
                          FAQAccordion, AppointmentCTA, PageHeader, LegalPage
    forms/ContactForm.tsx Appointment inquiry form
    ui/                   Button, Container, SectionHeading, Reveal, decorative SVGs
  content/site.ts         All site copy and settings
  lib/
    auth/                 Password hashing, sessions, and authorization checks
    db/                   MongoDB connection, collections, and document types
    inquiries/            Inquiry queries and stats
                          (plus validation, notification, metadata and structured-data helpers)
```

Design tokens (colors, fonts, shadows, and the `nav` breakpoint) are defined in `src/app/globals.css` under `@theme`.

## Appointment form

The form validates on the server. When `MONGODB_URI` is set, every inquiry is **saved to MongoDB** and appears in the staff dashboard. An optional alert can also go out through one of these:

- **Resend email:** `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL` from a verified domain)
- **Webhook:** `CONTACT_WEBHOOK_URL` (JSON POST)

With the database connected, the alert is privacy-minimal: only the inquiry type and a dashboard link, never the person's name, contact details, or message. Without a database, the full inquiry is emailed or posted instead. With neither configured, inquiries are logged to the console in development, and in production visitors see a message asking them to call. The form includes a honeypot field for spam, a privacy notice, and a required acknowledgement that it is not for emergencies or sensitive clinical details.

> **Compliance:** the site does not claim to be HIPAA-compliant. Before going live, the practice should choose its hosting and form-delivery providers deliberately. That includes confirming whether a Business Associate Agreement is needed and whether the provider will sign one. Don't add compliance claims to the site unless the deployed systems and agreements support them.

## Staff dashboard (`/admin`)

**Setup**
1. Create a MongoDB database (for example, MongoDB Atlas). Set `MONGODB_URI` (and optionally `MONGODB_DB`, default `sunset_counseling`) in `.env.local` and in your host's environment settings.
2. Run `npm run create-admin -- --email you@example.com --name "Your Name"`. It prints a one-time temporary password.
3. Sign in at `/admin/login`. You'll be asked to choose your own password.
4. Add employees under **Team**. Each gets a temporary password to share privately, and chooses their own at first sign-in.

Running `create-admin` again with an existing email resets that account to an active administrator with a new temporary password. It's the recovery path if every admin is locked out.

**Roles**

| | Staff | Administrator |
|---|:-:|:-:|
| View inquiries, search, filter | ✓ | ✓ |
| Update status, add notes | ✓ | ✓ |
| Stats dashboard | | ✓ |
| Add, deactivate, reset team members | | ✓ |
| Audit log, CSV export, delete inquiries | | ✓ |

**Security design**
- Passwords are hashed with scrypt (Node's built-in crypto). Minimum 12 characters.
- Sessions are random tokens stored hashed in MongoDB, in an httpOnly, SameSite=Lax cookie (`__Host-` prefixed and Secure in production). They expire after 12 hours.
- Every page and action re-checks the session against the database, so deactivating someone or changing their role takes effect immediately. `proxy.ts` is only a convenience redirect.
- Sign-in is rate-limited: 5 failed attempts per email, or 20 per IP, per 15 minutes.
- Changing or resetting a password signs out the account's other sessions.
- The system prevents removing the last active administrator, and admins can't demote or deactivate themselves.
- Sign-ins and all changes are recorded in the audit log.
- `/admin` responses are sent with `Cache-Control: no-store`, `X-Robots-Tag: noindex`, and `X-Frame-Options: DENY`, and `/admin` is disallowed in robots.txt.
- CSV export neutralizes spreadsheet formulas.

> **Health-information privacy:** stored inquiries (names, contact details, and the fact someone is seeking counseling) may be protected health information. Before storing real inquiries, confirm with your compliance advisor whether Business Associate Agreements are needed with MongoDB and your host, and that your database plan supports one. Restrict database network access and enable backups.

## Before launch: checklist for the practice

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain. The default, `www.sunsetcounselingcenter.com`, is a placeholder.
- [ ] Connect MongoDB, create the first administrator, and send a test inquiry through the website.
- [ ] Optionally configure the email or webhook alert for new inquiries.
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
