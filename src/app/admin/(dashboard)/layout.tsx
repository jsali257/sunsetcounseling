import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { countByStatus } from "@/lib/inquiries/repository";
import { logout } from "@/app/admin/_actions/auth";
import { roleLabels } from "@/lib/db/types";
import { AdminNav } from "@/components/admin/AdminNav";
import Image from "next/image";
import { brand } from "@/content/brand";

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  // Pages repeat this check; the layout only needs the user for the shell.
  const user = await requireUser({ allowPasswordChange: true });
  const counts = await countByStatus();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-b border-sand-200 bg-cream-50 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:px-5 lg:pt-6">
          <Link href="/admin" className="flex items-center gap-2.5 rounded-lg">
            <Image src={brand.logoMark} alt="" sizes="64px" className="h-7 w-auto" />
            <span className="leading-tight">
              <span className="block font-serif text-[1.05rem] text-ink-900">Sunset Counseling</span>
              <span className="block text-xs text-ink-600">Staff dashboard</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm text-ink-700 hover:bg-sand-100"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

        <div className="px-3 py-3 lg:mt-6 lg:flex-1 lg:px-3">
          {!user.mustChangePassword && (
            <AdminNav isAdmin={user.role === "admin"} newCount={counts.new} />
          )}
        </div>

        <div className="hidden border-t border-sand-200 p-4 lg:block">
          <p className="truncate text-sm font-medium text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-ink-600">
            {roleLabels[user.role]} · {user.email}
          </p>
          <div className="mt-3 flex items-center gap-1">
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-ink-700 hover:bg-sand-100"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </form>
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-ink-700 hover:bg-sand-100"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Website
            </Link>
          </div>
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
