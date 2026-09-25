import type { Metadata } from "next";
import { site } from "@/content/site";

/** Page-level metadata with consistent canonical URLs and Open Graph fields. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
    },
    twitter: {
      title: `${title} | ${site.name}`,
      description,
    },
  };
}
