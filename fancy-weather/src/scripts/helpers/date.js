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

export function getSeason(date) {
  const month = date.getMonth() + 1;

  switch (month) {
    case 12:
    case 1:
    case 2:
      return 'winter';
    case 3:
    case 4:
    case 5:
      return 'spring';
    case 6:
    case 7:
    case 8:
      return 'summer';
    case 9:
    case 10:
    case 11:
      return 'fall';
    default:
      return '';
  }
}

export function getDayTime(date) {
  const hours = date.getHours();
  const isDay = hours > 6 && hours < 20;

  return isDay ? 'day' : 'night';
}
