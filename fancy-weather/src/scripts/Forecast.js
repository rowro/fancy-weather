import { createEl, createBEMEl } from './helpers/createEl';
import { formatWeek } from './helpers/date';
import toFahrenheit from './helpers/temperature';

export default class Forecast {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
    this.tempElems = [];
  }

  render(data) {
    const lang = 'en';
    const bemEl = createBEMEl('forecast');

    this.el = document.querySelector('.forecast');

    // Create new element or clear old element
    if (!this.el) {
      this.el = createEl({ tag: 'ul', className: 'forecast' });
    } else {
      this.el.innerHTML = '';
    }

    data.forecast.forEach((item) => {
      let { temp } = item;
      temp = (data.measure === 'fahrenheit') ? toFahrenheit(temp) : temp;

      const tempEl = bemEl('temp', {
        content: `${temp}°`,
        elements: [
          bemEl('icon', { tag: 'i', className: `owi owi-${item.icon}` }),
        ],
      });

      this.tempElems.push(tempEl);

      bemEl('item', {
        tag: 'li',
        appendTo: this.el,
        elements: [
          bemEl('day', { content: formatWeek(item.date, lang, data.timezone) }),
          tempEl,
        ],
      });
    });

    this.parentEl.append(this.el);
  }
}
