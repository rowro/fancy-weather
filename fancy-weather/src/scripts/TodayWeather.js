import { createEl, createBEMEl } from './helpers/createEl';
import { formatDate, formatTime } from './helpers/format';
import { apparentTemp } from './helpers/temperature';

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
            bemEl('feels-like', { content: `Feels like: ${apparentTemp(data.temp, data.wind)}°` }),
            bemEl('wind', { content: `Wind: ${data.wind} m/s` }),
            bemEl('humidity', { content: `Humidity: ${data.humidity}%` }),
          ],
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
