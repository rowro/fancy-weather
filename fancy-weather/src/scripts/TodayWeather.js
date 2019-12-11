import { createEl, createBEMEl } from './helpers/createEl';
import { formatDate, formatTime } from './helpers/date';

export default class TodayWeather {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render(data) {
    const bemEl = createBEMEl('today-weather');
    this.el = createEl({ className: 'today-weather' });

    // City
    bemEl('city', { content: `${data.city}, ${data.country}`, appendTo: this.el });

    // Date and time
    const timeEl = bemEl('time', { content: formatTime(new Date(), 'en', data.timezone) });

    bemEl('date', {
      content: formatDate(new Date(), 'en', data.timezone),
      appendTo: this.el,
      elements: [timeEl],
    });

    // Update time every minute
    setInterval(() => {
      timeEl.innerText = formatTime(new Date(), 'en', data.timezone);
    }, 1000 * 60);

    // Temperature and info
    bemEl('content', {
      appendTo: this.el,
      elements: [
        // Temperature
        bemEl('temp', {
          content: `${data.temp}`,
          elements: [
            bemEl('icon', { tag: 'i', className: `owi owi-${data.icon}` }),
          ],
        }),
        // Info
        bemEl('info', {
          elements: [
            bemEl('description', { content: data.description }),
            bemEl('feels-like', { content: `Feels like: ${data.feelsLike}°` }),
            bemEl('wind', { content: `Wind: ${data.wind} m/s` }),
            bemEl('humidity', { content: `Humidity: ${data.humidity}%` }),
          ],
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
