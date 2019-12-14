import { createEl, createBEMEl } from './helpers/createEl';
import { CHANGE_MEASURE, UPDATE_BG_IMAGE } from './constants';

export default class Actions {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
    this.updateImgBtn = null;
  }

  appendListeners() {
    // Update image
    this.updateImgBtn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent(UPDATE_BG_IMAGE));
    });

    // Change measure
    const measureInputs = this.el.querySelectorAll('input[type="radio"][name="measure"]');
    [...measureInputs].forEach((input) => {
      input.addEventListener('change', (e) => {
        document.dispatchEvent(new CustomEvent(CHANGE_MEASURE, {
          detail: { measure: e.target.value },
        }));
      });
    });
  }

  render(measure) {
    const bemEl = createBEMEl('actions');
    this.el = createEl({ className: 'actions' });

    // Change image button
    this.updateImgBtn = bemEl('update-image', {
      tag: 'button',
      appendTo: this.el,
    });

    // Change language
    bemEl('lang', {
      tag: 'select',
      appendTo: this.el,
      elements: [
        bemEl('option', {
          tag: 'option',
          attr: { value: 'en' },
          content: 'en',
        }),
        bemEl('option', {
          tag: 'option',
          attr: { value: 'ru' },
          content: 'ru',
        }),
        bemEl('option', {
          tag: 'option',
          attr: { value: 'be' },
          content: 'be',
        }),
      ],
    });

    const fahrenheitRadio = bemEl('input', {
      tag: 'input',
      attr: {
        id: 'fahrenheit-radio',
        type: 'radio',
        value: 'fahrenheit',
        name: 'measure',
      },
    });

    if (measure === 'fahrenheit') {
      fahrenheitRadio.checked = true;
    }

    const celsiusRadio = bemEl('input', {
      tag: 'input',
      attr: {
        id: 'celsius-radio',
        type: 'radio',
        value: 'celsius',
        name: 'measure',
      },
    });

    if (measure === 'celsius') {
      celsiusRadio.checked = true;
    }

    // Change measure
    bemEl('measure', {
      appendTo: this.el,
      elements: [
        bemEl('measure-item', {
          elements: [
            fahrenheitRadio,
            bemEl('label', {
              tag: 'label',
              attr: { for: 'fahrenheit-radio' },
              content: '°F',
            }),
          ],
        }),
        bemEl('measure-item', {
          elements: [
            celsiusRadio,
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
    this.appendListeners();
  }
}
