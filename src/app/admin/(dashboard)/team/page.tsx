import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { collections } from "@/lib/db/mongodb";
import { roleLabels } from "@/lib/db/types";
import { formatRelative, formatDateTime } from "@/lib/admin/format";
import { Card, PageTitle } from "@/components/admin/ui";
import { CreateUserForm, TeamMemberRow } from "@/components/admin/TeamForms";

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
            {members.map((m) => (
              <TeamMemberRow
                key={String(m._id)}
                id={String(m._id)}
                name={m.name}
                email={m.email}
                role={m.role}
                active={m.active}
                isMe={m._id.equals(me._id)}
                meta={
                  <>
                    {roleLabels[m.role]}
                    {!m.active && " · Deactivated"}
                    {m.mustChangePassword && m.active && " · Awaiting first sign-in"}
                    {" · "}
                    {m.lastLoginAt ? (
                      <span title={formatDateTime(m.lastLoginAt)}>Last sign-in {formatRelative(m.lastLoginAt)}</span>
                    ) : (
                      "Never signed in"
                    )}
                  </>
                }
              />
            ))}
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
