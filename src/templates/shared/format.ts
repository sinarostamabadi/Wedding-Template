export function formatEventDate(
  iso?: string | null,
  timezone = "Asia/Tehran",
): string {
  if (!iso) return "تاریخ به‌زودی اعلام می‌شود";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString("fa-IR");
  }
}

export function formatEventDay(
  iso?: string | null,
  timezone = "Asia/Tehran",
): string {
  if (!iso) return "تاریخ به‌زودی اعلام می‌شود";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString("fa-IR");
  }
}

export function formatEventTimeRange(
  startIso?: string | null,
  endIso?: string | null,
  timezone = "Asia/Tehran",
): string | null {
  if (!startIso) return null;
  try {
    const start = new Intl.DateTimeFormat("fa-IR", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(startIso));
    if (!endIso) return `ساعت ${start}`;
    const end = new Intl.DateTimeFormat("fa-IR", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(endIso));
    return `ساعت ${start} الی ${end}`;
  } catch {
    return null;
  }
}

export function coupleLabel(one: string, two: string): string {
  return `${one} و ${two}`;
}

export function coupleMonogram(one: string, two: string): string {
  const a = [...one.trim()][0] || "";
  const b = [...two.trim()][0] || "";
  return `${a}&${b}`;
}

export function googleCalendarUrl(input: {
  title: string;
  startIso?: string | null;
  endIso?: string | null;
  location?: string | null;
  details?: string | null;
}): string | null {
  if (!input.startIso) return null;
  const start = new Date(input.startIso);
  const end = input.endIso
    ? new Date(input.endIso)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (input.location) params.set("location", input.location);
  if (input.details) params.set("details", input.details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
