import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db/mongodb";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card, Notice } from "@/components/admin/ui";
import Image from "next/image";
import { brand } from "@/content/brand";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const configured = isDatabaseConfigured();
  if (configured && (await getSessionUser())) redirect("/admin");
  const { next } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src={brand.logoFull} alt="Sunset Counseling Center, PLLC" preload sizes="176px" className="h-auto w-44" />
          <p className="mt-4 text-sm text-ink-600">Staff dashboard</p>
        </div>

        <Card className="p-7 sm:p-8">
          <h1 className="mb-6 flex items-center gap-2 text-2xl text-ink-900">
            <Lock aria-hidden="true" className="h-5 w-5 text-sage-600" />
            Sign in
          </h1>
          {configured ? (
            <LoginForm next={typeof next === "string" ? next : undefined} />
          ) : (
            <Notice tone="info">
              The dashboard isn’t connected to a database yet. Set <code>MONGODB_URI</code> in the
              environment, then create the first administrator with{" "}
              <code>npm run create-admin</code>.
            </Notice>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-ink-600">
          Forgot your password? Ask an administrator to reset it.
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-terracotta-700 underline underline-offset-4">
            Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
