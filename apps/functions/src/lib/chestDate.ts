/**
 * Resolves "today" (yyyy-mm-dd) in a given IANA timezone. This is what
 * gates one-spin-per-day: a spin's chestDate is the key, not a rolling
 * 24h window, so the chest resets at local midnight regardless of when
 * a member last opened the app.
 */
export function chestDateFor(timezone: string, now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now); // en-CA formats as yyyy-mm-dd
}
