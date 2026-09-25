import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { roleLabels } from "@/lib/db/types";
import { Card, Notice, PageTitle } from "@/components/admin/ui";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { ProfileForm } from "@/components/admin/ProfileForm";

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
      <div className={required ? "max-w-lg space-y-6" : "grid max-w-4xl items-start gap-6 lg:grid-cols-2"}>
        {required && (
          <Notice tone="info">
            Welcome, {user.name}. Before continuing, replace your temporary password with one only
            you know.
          </Notice>
        )}
        {!required && (
          <Card className="p-6">
            <h2 className="mb-5 text-xl text-ink-900">Profile</h2>
            <ProfileForm name={user.name} email={user.email} />
          </Card>
        )}
        <Card className="p-6">
          {!required && <h2 className="mb-5 text-xl text-ink-900">Change password</h2>}
          <ChangePasswordForm required={required} />
        </Card>
      </div>
    </>
  );
}
