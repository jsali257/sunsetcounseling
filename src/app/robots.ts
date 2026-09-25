import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/structured-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
