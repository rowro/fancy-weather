import { createEl, createBEMEl } from './helpers/createEl';

export default class Search {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render() {
    const bemEl = createBEMEl('search');
    this.el = createEl({ tag: 'form', className: 'search' });

    bemEl('input', {
      tag: 'input',
      attr: { type: 'search', placeholder: 'Search city or ZIP' },
      appendTo: this.el,
    });

    bemEl('btn', {
      tag: 'button',
      content: 'Search',
      attr: { type: 'submit' },
      appendTo: this.el,
    });

    this.parentEl.append(this.el);
  }
}
