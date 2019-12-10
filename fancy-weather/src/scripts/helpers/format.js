/**
 * Format latitude and longitude
 * Example: 32.4544 => 32°45
 * @param coords
 * @returns {string}
 */
export function formatCoords(coords) {
  return Number(coords).toFixed(2).replace('.', '°');
}

export function formatDate(date, lang, timezone) {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    hour12: false,
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  return formatter.format(date);
}

export function formatTime(date, lang, timezone) {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

  return formatter.format(date);
}
