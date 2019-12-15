import { createEl, createBEMEl } from '../helpers/createEl';
import { formatDate, formatTime } from '../helpers/date';
import toFahrenheit from '../helpers/temperature';
import i18n from '../lang';

export default class TodayWeather {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
    this.tempEl = null;
  }

  render(data) {
    const content = i18n[data.lang];
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
    const timeEl = bemEl('time', { content: formatTime(new Date(), data.lang, data.timezone) });

    bemEl('date', {
      content: formatDate(new Date(), data.lang, data.timezone),
      appendTo: this.el,
      elements: [timeEl],
    });

    // Update time every minute
    setInterval(() => {
      timeEl.innerText = formatTime(new Date(), data.lang, data.timezone);
    }, 1000 * 60);

    // Convert Celsius to Fahrenheit if needed
    let { temp } = data.todayWeather;
    temp = (data.measure === 'fahrenheit') ? toFahrenheit(temp) : temp;

    this.tempEl = bemEl('temp', { content: `<span>${temp}</span>` });

    let weatherDescription = data.todayWeather.description;

    if (data.lang === 'be') {
      weatherDescription = content.weatherDescriptions[data.todayWeather.weatherId];
    }

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
            bemEl('description', {
              content: weatherDescription,
            }),
            bemEl('feels-like', {
              content: `${content.feelsLike}: ${data.todayWeather.feelsLike}°`,
            }),
            bemEl('wind', {
              content: `${content.wind}: ${data.todayWeather.wind} ${content.windMeasure}`,
            }),
            bemEl('humidity', {
              content: `${content.humidity}: ${data.todayWeather.humidity}%`,
            }),
          ],
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
