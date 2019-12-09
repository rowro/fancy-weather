import { createEl, createBEMEl } from './helpers/createEl';

export default class ThreeDaysWeather {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render() {
    const data = [
      { day: 'Tuesday', temp: 7, icon: 'few-clouds' },
      { day: 'Wednesday', temp: 6, icon: 'clouds' },
      { day: 'Thursday', temp: 3, icon: 'clouds' },
    ];

    const bemEl = createBEMEl('three-days-weather');
    this.el = createEl({ tag: 'ul', className: 'three-days-weather' });

    data.forEach((item) => {
      bemEl('item', {
        tag: 'li',
        appendTo: this.el,
        elements: [
          bemEl('day', { content: item.day }),
          bemEl('temp', {
            content: `${item.temp}°`,
            elements: [
              bemEl('icon', { className: `icon icon--${item.icon}` }),
            ],
          }),
        ],
      });
    });

    this.parentEl.append(this.el);
  }
}
