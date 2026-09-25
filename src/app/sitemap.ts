import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/structured-data";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/contact", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/bilingual-counseling", priority: 0.8 },
  { path: "/evaluations", priority: 0.7 },
  { path: "/professional-referrals", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/crisis-resources", priority: 0.6 },
  { path: "/privacy", priority: 0.2 },
  { path: "/notice-of-privacy-practices", priority: 0.2 },
  { path: "/informed-consent", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority,
  }));
}
