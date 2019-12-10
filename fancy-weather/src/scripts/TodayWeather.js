import { createEl, createBEMEl } from './helpers/createEl';

export default class TodayWeather {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render(locationData) {
    const data = {
      city: 'Minsk, Belarus',
      date: 'Mon 28 October',
      time: '17:23',
      temp: 10,
      icon: 'clouds',
      description: 'overcast',
      feelsLike: 7,
      wind: 2,
      humidity: 83,
    };

    const bemEl = createBEMEl('today-weather');
    this.el = createEl({ className: 'today-weather' });

    // City
    bemEl('city', { content: data.city, appendTo: this.el });

    // Date and time
    bemEl('date', {
      content: data.date,
      appendTo: this.el,
      elements: [
        bemEl('time', { content: data.time }),
      ],
    });

    // Temperature and info
    bemEl('content', {
      appendTo: this.el,
      elements: [
        // Temperature
        bemEl('temp', {
          content: `<span>${data.temp}</span>`,
          elements: [
            bemEl('icon', { className: `icon icon--${data.icon}` }),
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
