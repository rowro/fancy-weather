import { createEl, createBEMEl } from './helpers/createEl';
import { formatWeek } from './helpers/date';

export default class Forecast {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render(data) {
    const lang = 'en';
    const bemEl = createBEMEl('forecast');
    this.el = createEl({ tag: 'ul', className: 'forecast' });

    data.forecast.forEach((item) => {
      bemEl('item', {
        tag: 'li',
        appendTo: this.el,
        elements: [
          bemEl('day', { content: formatWeek(item.date, lang, data.timezone) }),
          bemEl('temp', {
            content: `${item.temp}°`,
            elements: [
              bemEl('icon', { tag: 'i', className: `owi owi-${item.icon}` }),
            ],
          }),
        ],
      });
    });

    this.parentEl.append(this.el);
  }
}
