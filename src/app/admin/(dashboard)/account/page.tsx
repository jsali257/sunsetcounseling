import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { roleLabels } from "@/lib/db/types";
import { Card, Notice, PageTitle } from "@/components/admin/ui";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser({ allowPasswordChange: true });
  const required = user.mustChangePassword;

  return (
    <>
      <PageTitle
        title={required ? "Choose your password" : "My account"}
        description={required ? undefined : `${user.name} · ${roleLabels[user.role]} · ${user.email}`}
      />
      <div className="max-w-lg space-y-6">
        {required && (
          <Notice tone="info">
            Welcome, {user.name}. Before continuing, replace your temporary password with one only
            you know.
          </Notice>
        )}
        <Card className="p-6">
          {!required && <h2 className="mb-5 text-xl text-ink-900">Change password</h2>}
          <ChangePasswordForm required={required} />
        </Card>
      </div>
    </>
  );
}
