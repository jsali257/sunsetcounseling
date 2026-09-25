import { site, counselor, faqs, type FAQ } from "@/content/site";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** Renders JSON-LD safely (escapes `<` to prevent script injection). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Practice details for search engines. Only verified facts are included —
 * add opening hours, geo coordinates, or accepted plans once confirmed.
 */
export function practiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "ProfessionalService"],
    "@id": absoluteUrl("/#practice"),
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: absoluteUrl("/"),
    telephone: site.phone.e164,
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "McAllen, Texas" },
      { "@type": "Place", name: "Rio Grande Valley, Texas" },
      { "@type": "State", name: "Texas" },
    ],
    availableLanguage: site.languages.map((name) => ({ "@type": "Language", name })),
    knowsLanguage: site.languages,
    employee: {
      "@type": "Person",
      name: counselor.name,
      honorificSuffix: counselor.credentials,
      jobTitle: counselor.title,
      knowsLanguage: site.languages,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: "en-US",
    publisher: { "@id": absoluteUrl("/#practice") },
  };
}

export function faqSchema(items: FAQ[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
