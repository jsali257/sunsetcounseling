import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { collections } from "@/lib/db/mongodb";
import { roleLabels } from "@/lib/db/types";
import { formatRelative, formatDateTime } from "@/lib/admin/format";
import { Card, PageTitle } from "@/components/admin/ui";
import { CreateUserForm, UserRowActions } from "@/components/admin/TeamForms";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const me = await requireAdmin();
  const { users } = await collections();
  const members = await users
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ active: -1, role: 1, name: 1 })
    .toArray();

  return (
    <>
      <PageTitle
        title="Team"
        description="Manage who can sign in to the dashboard. New members get a temporary password and choose their own at first sign-in."
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <h2 className="sr-only">Team members</h2>
          <ul className="divide-y divide-sand-200">
            {members.map((m) => {
              const isMe = m._id.equals(me._id);
              return (
                <li key={String(m._id)} className={cn("p-5", !m.active && "bg-sand-100/60")}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900">
                        {m.name} {isMe && <span className="text-sm font-normal text-ink-600">(you)</span>}
                      </p>
                      <p className="truncate text-sm text-ink-600">{m.email}</p>
                      <p className="mt-1 text-xs text-ink-600">
                        {roleLabels[m.role]}
                        {!m.active && " · Deactivated"}
                        {m.mustChangePassword && m.active && " · Awaiting first sign-in"}
                        {" · "}
                        {m.lastLoginAt ? (
                          <span title={formatDateTime(m.lastLoginAt)}>Last sign-in {formatRelative(m.lastLoginAt)}</span>
                        ) : (
                          "Never signed in"
                        )}
                      </p>
                    </div>
                    {!isMe && (
                      <UserRowActions userId={String(m._id)} name={m.name} role={m.role} active={m.active} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="mb-5 text-xl text-ink-900">Add a team member</h2>
          <CreateUserForm />
        </Card>
      </div>
    </>
  );
}
