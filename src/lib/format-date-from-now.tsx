const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatDateFromNow(date: Date) {
  const diff = Date.now() - date.getTime();

  if (diff >= DAY) {
    return date.toLocaleString("en-us", {
      day: "numeric",
      month: "short",
    });
  }

  if (diff >= HOUR) {
    return `${Math.round(diff / HOUR)}h`;
  }

  if (diff >= MINUTE) {
    return `${Math.round(diff / MINUTE)}m`;
  }

  return `${Math.max(1, Math.round(diff / SECOND))}s`;
}
