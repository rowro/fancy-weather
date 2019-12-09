import { createEl, createBEMEl } from './helpers/createEl';

export default class Actions {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render() {
    const bemEl = createBEMEl('actions');
    this.el = createEl({ className: 'actions' });

    // Change image button
    bemEl('change-image', { tag: 'button', appendTo: this.el });

    // Change language
    bemEl('lang', {
      tag: 'select',
      appendTo: this.el,
      elements: [
        bemEl('option', { tag: 'option', attr: { value: 'en' }, content: 'en' }),
        bemEl('option', { tag: 'option', attr: { value: 'ru' }, content: 'ru' }),
        bemEl('option', { tag: 'option', attr: { value: 'be' }, content: 'be' }),
      ],
    });

    // Change measure
    bemEl('measure', {
      appendTo: this.el,
      elements: [
        // Fahrenheit
        bemEl('measure-item', {
          elements: [
            bemEl('input', {
              tag: 'input',
              attr: {
                id: 'fahrenheit-radio',
                type: 'radio',
                value: 'F',
                name: 'measure',
              },
            }),
            bemEl('label', {
              tag: 'label',
              attr: { for: 'fahrenheit-radio' },
              content: '°F',
            }),
          ],
        }),
        // Celsius
        bemEl('measure-item', {
          elements: [
            bemEl('input', {
              tag: 'input',
              attr: {
                id: 'celsius-radio',
                type: 'radio',
                value: 'C',
                name: 'measure',
              },
            }),
            bemEl('label', {
              tag: 'label',
              attr: { for: 'celsius-radio' },
              content: '°C',
            }),
          ],
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
