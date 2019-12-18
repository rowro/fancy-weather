import { createBEMEl, createEl } from '../helpers/createEl';
import { SHOW_MESSAGE } from '../constants';

export default class Search {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  appendListeners() {
    document.addEventListener(SHOW_MESSAGE, (e) => {
      const { message } = e.detail;
      this.showMessage(message);
    });
  }

  showMessage(message) {
    this.messageEl.innerHTML = message;
    this.el.classList.add('active');

    setTimeout(() => this.hideMessage(), 5000);
  }

  hideMessage() {
    this.el.classList.remove('active');
  }

  render() {
    const bemEl = createBEMEl('message');
    this.el = document.querySelector('.message');

    // Create new element or clear old element
    if (!this.el) {
      this.el = createEl({ className: 'message' });
    } else {
      this.el.innerHTML = '';
    }

    this.messageEl = bemEl('description', {
      content: 'Sorry, city not found',
      appendTo: this.el,
    });

    this.parentEl.append(this.el);
    this.appendListeners();
  }
}
