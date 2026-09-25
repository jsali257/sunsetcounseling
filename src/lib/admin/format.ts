/** McAllen, TX is on Central Time — render every dashboard date there, regardless of server region. */
export const TIME_ZONE = "America/Chicago";

const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDateTime = (d: Date) => dateTime.format(d);
export const formatDate = (d: Date) => dateOnly.format(d);

export function formatRelative(d: Date, now = new Date()) {
  const minutes = Math.round((now.getTime() - d.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(d);
}

/** "3 hr", "2.5 days" — for response-time stats. */
export function formatDuration(ms: number) {
  const hours = ms / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(ms / 60000))} min`;
  if (hours < 48) return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)} hr`;
  const days = hours / 24;
  return `${days < 10 ? days.toFixed(1) : Math.round(days)} days`;
}
