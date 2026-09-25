/**
 * Central content for Sunset Counseling Center, PLLC.
 *
 * Copy, contact details, and navigation live here so they can be updated
 * without touching presentation components.
 */

import type { StaticImageData } from "next/image";
import officePhoto from "../../public/images/sunset_office.jpg";
import dianaPhoto from "../../public/images/diana.jpg";

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** CSS object-position used when the photo is cropped to fit its frame. */
  position?: string;
};

const DEFAULT_SITE_URL = "https://www.sunsetcounselingcenter.com";

/**
 * Resolves the public site URL. Tolerates empty values and bare domains
 * (e.g. "example.com"), and falls back to Vercel's production domain.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      console.warn(`Ignoring invalid site URL: "${value}"`);
    }
  }
  return DEFAULT_SITE_URL;
}

export const site = {
  name: "Sunset Counseling Center, PLLC",
  shortName: "Sunset Counseling Center",
  tagline: "Compassionate Care for a Brighter Tomorrow",
  description:
    "Compassionate individual counseling in McAllen, Texas. Sunset Counseling Center, PLLC offers bilingual counseling in English and Spanish with in-person and telehealth options.",
  // Set NEXT_PUBLIC_SITE_URL in production to the live domain.
  url: resolveSiteUrl(),
  serviceArea: "Serving the Rio Grande Valley & Surrounding Areas",
  languages: ["English", "Spanish"],
  phone: {
    display: "956-601-8486",
    href: "tel:+19566018486",
    e164: "+1-956-601-8486",
  },
  address: {
    street: "5517 N McColl Rd.",
    city: "McAllen",
    state: "TX",
    zip: "78504",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=5517+N+McColl+Rd,+McAllen,+TX+78504",
  },
  year: 2026,
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Bilingual Counseling", href: "/bilingual-counseling" },
  { label: "Evaluations", href: "/evaluations" },
  { label: "For Professionals", href: "/professional-referrals" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Bilingual Counseling", href: "/bilingual-counseling" },
  { label: "Evaluations", href: "/evaluations" },
  { label: "FAQ", href: "/faq" },
  { label: "Crisis Resources", href: "/crisis-resources" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Notice of Privacy Practices", href: "/notice-of-privacy-practices" },
  { label: "Informed Consent", href: "/informed-consent" },
  { label: "Contact", href: "/contact" },
];

/** Links used by calls-to-action throughout the site. */
export const ctaLinks = {
  appointment: "/contact#request-appointment",
  telehealth: "/contact?reason=telehealth#request-appointment",
  evaluation: "/contact?reason=evaluation#request-appointment",
  referral: "/contact?reason=referral#request-appointment",
  insurance: "/contact?reason=insurance#request-appointment",
} as const;

export const hero = {
  image: {
    src: officePhoto,
    alt: "A calm counseling room at Sunset Counseling Center with a cream sofa, sage green pillows, a swivel armchair, an olive tree, and soft lamp light",
    position: "62% center",
  } satisfies Photo,
  /** Rendered as one heading; the accent portion is set in italic. */
  headline: "Compassionate Care for a",
  headlineAccent: "Brighter Tomorrow",
  subhead: "A safe, supportive space to feel heard, understood, and empowered.",
  serviceLine: ["Individual Counseling", "Bilingual Services", "In-Person & Telehealth"],
  trust: {
    status: "Now Accepting New Clients",
    area: "Serving the Rio Grande Valley & Surrounding Areas",
  },
};

export const introduction = {
  heading: "A Safe Space for Healing and Growth",
  paragraphs: [
    "At Sunset Counseling Center, PLLC, we believe everyone deserves a safe, supportive space to feel heard, understood, and empowered.",
    "Life can bring difficult seasons, unexpected changes, overwhelming emotions, and experiences that can be difficult to navigate alone. Counseling provides an opportunity to slow down, understand what you are experiencing, develop healthier coping strategies, and work toward meaningful change.",
    "Our goal is to provide compassionate, culturally responsive, and individualized mental health services while meeting each client where they are.",
  ],
};

export const counselor = {
  name: "Diana Arredondo",
  credentials: "M.S., LPC",
  title: "Licensed Professional Counselor",
  /** Set to null to show the monogram placeholder instead. */
  portrait: {
    src: dianaPhoto,
    alt: "Diana Arredondo, M.S., LPC, seated in the Sunset Counseling Center office",
    position: "42% center",
  } as Photo | null,
  bio: [
    "Diana Arredondo is a Licensed Professional Counselor providing counseling services to individuals seeking support through challenging life experiences.",
    "Her counseling style emphasizes compassion, emotional safety, collaboration, and respect. She believes that clients are more than the challenges they are experiencing and works to help individuals recognize their strengths while developing practical tools for managing difficult thoughts, emotions, and circumstances.",
    "Her clinical approach may incorporate evidence-informed techniques from Cognitive Behavioral Therapy (CBT), motivational interviewing, mindfulness, grounding, emotional regulation, and trauma-informed care based on each client’s individual needs.",
    "Diana provides services in both English and Spanish.",
  ],
  highlights: [
    "Licensed Professional Counselor",
    "English & Spanish",
    "In-Person & Telehealth",
    "Individualized Care",
  ],
  approaches: [
    "Cognitive Behavioral Therapy (CBT)",
    "Motivational interviewing",
    "Mindfulness",
    "Grounding",
    "Emotional regulation",
    "Trauma-informed care",
  ],
};

export type ServiceIcon =
  | "individual"
  | "anxiety"
  | "depression"
  | "trauma"
  | "transitions"
  | "growth"
  | "coping";

export type Service = {
  slug: string;
  title: string;
  icon: ServiceIcon;
  description: string;
};

export const services: Service[] = [
  {
    slug: "individual-counseling",
    title: "Individual Counseling",
    icon: "individual",
    description:
      "One-on-one counseling provides a confidential and supportive environment to explore emotional concerns, life experiences, relationships, behaviors, and personal goals.",
  },
  {
    slug: "anxiety-stress",
    title: "Anxiety & Stress",
    icon: "anxiety",
    description:
      "Counseling can help individuals better understand patterns of worry and stress while developing practical strategies for managing anxious thoughts, emotional overwhelm, and everyday pressures.",
  },
  {
    slug: "depression-emotional-wellness",
    title: "Depression & Emotional Wellness",
    icon: "depression",
    description:
      "Support for individuals experiencing sadness, low motivation, emotional exhaustion, difficulty enjoying activities, or other concerns affecting emotional well-being.",
  },
  {
    slug: "trauma-informed-counseling",
    title: "Trauma-Informed Counseling",
    icon: "trauma",
    description:
      "A supportive approach that recognizes how difficult or traumatic experiences can influence emotions, relationships, behaviors, and everyday functioning.",
  },
  {
    slug: "life-transitions",
    title: "Life Transitions",
    icon: "transitions",
    description:
      "Support during periods of significant change, including relationship changes, family transitions, career changes, adjustment difficulties, grief, and other major life events.",
  },
  {
    slug: "self-esteem-personal-growth",
    title: "Self-Esteem & Personal Growth",
    icon: "growth",
    description:
      "Counseling focused on developing greater self-awareness, confidence, healthy boundaries, coping skills, and emotional resilience.",
  },
  {
    slug: "coping-emotional-regulation",
    title: "Coping & Emotional Regulation",
    icon: "coping",
    description:
      "Learn practical strategies for identifying emotions, managing distress, improving coping skills, and responding to difficult situations in healthier ways.",
  },
];

export const bilingual = {
  heading: "Counseling in English & Spanish",
  english: [
    "Mental health conversations can feel deeply personal, and sometimes it is easier to express emotions in the language that feels most natural.",
    "Sunset Counseling Center, PLLC proudly offers counseling services in English and Spanish.",
  ],
  spanish: {
    heading: "Servicios de consejería disponibles en inglés y español.",
    body: "Nuestro objetivo es ofrecer un espacio seguro, respetuoso y compasivo donde cada persona pueda sentirse escuchada y apoyada durante su proceso.",
  },
};

export const sessionFormats = {
  inPerson: {
    title: "In-Person Counseling",
    body: "Private, comfortable counseling sessions are available at our McAllen office.",
    officeLabel: "McAllen Office",
    cta: "Get Directions",
  },
  telehealth: {
    title: "Telehealth Counseling",
    body: [
      "Secure virtual counseling sessions are available for eligible clients located in Texas.",
      "Telehealth allows clients to attend counseling from a private location without traveling to the office.",
    ],
    cta: "Request a Telehealth Appointment",
  },
};

export const evaluations = {
  heading: "Clinical & Professional Evaluations",
  intro:
    "Sunset Counseling Center may also provide clinical evaluations and professional mental health documentation when appropriate and within the counselor’s professional scope of practice.",
  detail:
    "Evaluation services may include clinical interviews, relevant screening or assessment measures, review of available documentation, and preparation of a professional written report when indicated.",
  discussLead:
    "Individuals or attorneys seeking an evaluation are encouraged to contact the office to discuss:",
  discussItems: [
    "Purpose of the evaluation",
    "Required documentation",
    "Fees",
    "Scheduling",
    "Applicable deadlines",
  ],
  disclaimer:
    "An evaluation does not guarantee a particular diagnosis, clinical conclusion, legal finding, or case outcome.",
  cta: "Discuss an Evaluation",
};

export const referrals = {
  heading: "For Attorneys & Professional Referrals",
  paragraphs: [
    "Sunset Counseling Center welcomes referrals from attorneys, healthcare professionals, community organizations, and other professionals.",
    "For evaluation referrals, please contact the office with the type and purpose of the requested evaluation, applicable deadlines, and any documentation that may need to be reviewed.",
    "Professional collaboration is available when appropriate and with the client’s written authorization.",
  ],
  audiences: [
    "Attorneys",
    "Healthcare professionals",
    "Community organizations",
    "Other referral partners",
  ],
  checklist: [
    "Type and purpose of the requested evaluation",
    "Applicable deadlines",
    "Documentation that may need to be reviewed",
  ],
  cta: "Professional Referral Inquiry",
};

export const insurance = {
  heading: "Insurance & Payment",
  lead: "Insurance is accepted.",
  paragraphs: [
    "Coverage for behavioral health services varies depending on the client’s insurance plan, provider network, deductible, and specific service requested.",
    "Clients are encouraged to verify their behavioral health benefits before beginning services.",
    "Self-pay options may also be available.",
    "Please contact Sunset Counseling Center for current information regarding accepted insurance plans, self-pay rates, and evaluation fees.",
  ],
  cta: "Verify Insurance & Payment Information",
};

export type FAQ = { question: string; answer: string };

export const faqs: FAQ[] = [
  {
    question: "Do you offer counseling in Spanish?",
    answer: "Yes. Counseling services are available in both English and Spanish.",
  },
  {
    question: "Do you offer virtual appointments?",
    answer: "Yes. Telehealth counseling is available for eligible clients located in Texas.",
  },
  {
    question: "Do you offer in-person appointments?",
    answer: "Yes. In-person services are available at the McAllen location.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Insurance is accepted. Please contact the office to verify current insurance participation and coverage.",
  },
  {
    question: "How long are counseling sessions?",
    answer:
      "The length and frequency of sessions depend on the service provided and the client’s individual treatment needs.",
  },
  {
    question: "Is counseling confidential?",
    answer:
      "Protecting client privacy is an important part of the counseling relationship. Information discussed in counseling is generally confidential, subject to applicable laws, professional requirements, and specific exceptions that will be reviewed as part of the informed-consent process.",
  },
];

export const appointment = {
  heading: "Take the First Step",
  paragraphs: [
    "You do not have to have everything figured out before beginning counseling.",
    "Whether you are looking for emotional support, healthier coping strategies, greater self-understanding, or guidance through a difficult period, Sunset Counseling Center is here to provide compassionate professional support.",
  ],
  formPrivacyNotice:
    "Please do not use this form for emergencies or to share detailed or highly sensitive clinical information. Share only what is needed to arrange a first conversation — details can be discussed privately with the counselor.",
};

/** The emergency guidance itself is rendered with tel: links in EmergencyNotice.tsx. */
export const emergencyNotice = {
  disclaimer:
    "Information provided on this website is for general informational purposes and is not a substitute for individualized mental health care, medical advice, diagnosis, or emergency services.",
};

export type CrisisContact = {
  kind: "call" | "text";
  /** Button label, e.g. "Call 988" or "Text HOME to 741741". */
  label: string;
  href: string;
};

export type CrisisResource = {
  name: string;
  description: string;
  contacts: CrisisContact[];
  /** Short extra line, e.g. Spanish-language access. */
  note?: string;
};

// `sms:NUMBER?&body=WORD` pre-fills the keyword on both iPhone and Android.
export const crisisResources: CrisisResource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description:
      "Available 24/7 for suicidal thoughts, self-harm, emotional distress, and mental health crises.",
    contacts: [
      { kind: "call", label: "Call 988", href: "tel:988" },
      { kind: "text", label: "Text 988", href: "sms:988" },
    ],
    note: "En español: llame al 988 y presione 2.",
  },
  {
    name: "Tropical Texas Behavioral Health (TTBH) Crisis Line",
    description: "24/7 crisis support serving Hidalgo, Cameron, and Willacy counties.",
    contacts: [{ kind: "call", label: "Call 1-877-289-7199", href: "tel:+18772897199" }],
  },
  {
    name: "Crisis Text Line",
    description: "Free, confidential crisis support available 24/7.",
    contacts: [{ kind: "text", label: "Text HOME to 741741", href: "sms:741741?&body=HOME" }],
  },
  {
    name: "Texas 2-1-1",
    description:
      "Connects individuals and families with local mental health, housing, food, healthcare, and community resources.",
    contacts: [{ kind: "call", label: "Dial 211", href: "tel:211" }],
  },
  {
    name: "Veterans Crisis Line",
    description:
      "24/7 confidential crisis support for veterans, service members, and their loved ones.",
    contacts: [
      { kind: "call", label: "Call 988, then press 1", href: "tel:988" },
      { kind: "text", label: "Text 838255", href: "sms:838255" },
    ],
  },
  {
    name: "The Trevor Project — LGBTQ+ Youth & Young Adults",
    description: "Crisis support for LGBTQ+ young people.",
    contacts: [
      { kind: "call", label: "Call 1-866-488-7386", href: "tel:+18664887386" },
      { kind: "text", label: "Text START to 678678", href: "sms:678678?&body=START" },
    ],
  },
  {
    name: "Childhelp National Child Abuse Hotline",
    description: "Call, text, or chat for support related to child abuse, neglect, or safety concerns.",
    contacts: [
      { kind: "call", label: "Call 1-800-422-4453", href: "tel:+18004224453" },
      { kind: "text", label: "Text 1-800-422-4453", href: "sms:+18004224453" },
    ],
  },
  {
    name: "National Domestic Violence Hotline",
    description:
      "Confidential support for individuals experiencing domestic or intimate partner violence.",
    contacts: [
      { kind: "call", label: "Call 1-800-799-7233", href: "tel:+18007997233" },
      { kind: "text", label: "Text START to 88788", href: "sms:88788?&body=START" },
    ],
  },
];

/** Options for the appointment inquiry form. Keep values stable — they are sent with submissions. */
export const formOptions = {
  reason: [
    { value: "counseling", label: "Counseling appointment" },
    { value: "telehealth", label: "Telehealth appointment" },
    { value: "evaluation", label: "Evaluation inquiry" },
    { value: "referral", label: "Professional referral" },
    { value: "insurance", label: "Insurance & payment question" },
  ],
  contactMethod: [
    { value: "phone", label: "Phone call" },
    { value: "text", label: "Text message" },
    { value: "email", label: "Email" },
  ],
  format: [
    { value: "in-person", label: "In-person" },
    { value: "telehealth", label: "Telehealth" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  language: [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "either", label: "Either" },
  ],
} as const;
