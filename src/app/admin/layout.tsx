import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Staff Dashboard", template: "%s | Staff Dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-dvh flex-col bg-sand-100">{children}</div>;
}
