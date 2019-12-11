export function localDate(timezone) {
  return new Date(new Date().toLocaleString('en', { timeZone: timezone }));
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

export function formatWeek(date, lang, timezone) {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    weekday: 'long',
  });

  return formatter.format(date);
}
