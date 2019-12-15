import i18n from '../lang';

export function localDate(timezone, lang = 'en') {
  return new Date(new Date().toLocaleString(lang, { timeZone: timezone }));
}

export function formatDate(date, lang, timezone) {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    hour12: false,
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  // Intl Belarus language doesn't support in Chrome
  if (lang === 'be') {
    const week = i18n.be.weekShortNames[date.getDay()];
    const month = i18n.be.monthNames[date.getMonth()];
    return `${week}, ${date.getDate()} ${month}`;
  }

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

  // Intl Belarus language doesn't support in Chrome
  if (lang === 'be') {
    return i18n.be.weekNames[new Date(date).getDay()];
  }

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
