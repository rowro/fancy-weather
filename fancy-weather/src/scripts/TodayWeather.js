import { createEl, createBEMEl } from './helpers/createEl';
import { formatDate, formatTime } from './helpers/date';
import toFahrenheit from './helpers/temperature';

export default class TodayWeather {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
    this.tempEl = null;
  }

  render(data) {
    const bemEl = createBEMEl('today-weather');

    this.el = document.querySelector('.today-weather');

    // Create new element or clear old element
    if (!this.el) {
      this.el = createEl({ className: 'today-weather' });
    } else {
      this.el.innerHTML = '';
    }

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

    // Convert Celsius to Fahrenheit if needed
    let { temp } = data.todayWeather;
    temp = (data.measure === 'fahrenheit') ? toFahrenheit(temp) : temp;

    this.tempEl = bemEl('temp', { content: `<span>${temp}</span>` });

    // Temperature and info
    bemEl('content', {
      appendTo: this.el,
      elements: [
        // Temperature
        this.tempEl,
        // Weather icon
        bemEl('icon', { tag: 'i', className: `owi owi-${data.todayWeather.icon}` }),
        // Info
        bemEl('info', {
          elements: [
            bemEl('description', { content: data.todayWeather.description }),
            bemEl('feels-like', { content: `Feels like: ${data.todayWeather.feelsLike}°` }),
            bemEl('wind', { content: `Wind: ${data.todayWeather.wind} m/s` }),
            bemEl('humidity', { content: `Humidity: ${data.todayWeather.humidity}%` }),
          ],
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
