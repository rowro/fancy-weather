import { createBEMEl, createEl } from '../helpers/createEl';
import i18n from '../lang';
import { SEARCH_CITY } from '../constants';
import fireEvent from '../helpers/events';

export default class Search {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
    this.speechBtn = null;
    this.searchInput = null;
  }

  async startRecognizer() {
    let recognition;
    if ('SpeechRecognition' in window) {
      recognition = new window.SpeechRecognition();
    } else {
      // eslint-disable-next-line new-cap
      recognition = new window.webkitSpeechRecognition();
    }
    recognition.lang = this.lang;
    recognition.interimResults = true;

    recognition.onstart = () => {
      this.speechBtn.classList.add('active');
    };

    recognition.onresult = (event) => {
      this.searchInput.value = event.results[event.resultIndex][0].transcript;
    };

    recognition.onend = () => {
      this.speechBtn.classList.remove('active');
    };

    recognition.start();
  }

  appendListeners() {
    if (this.speechBtn) {
      this.speechBtn.addEventListener('click', () => this.startRecognizer());
    }

    this.el.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(e.target);
      const query = data.get('city');

      if (query) {
        fireEvent(SEARCH_CITY, { query });
      }
    });
  }

  render(lang) {
    const content = i18n[lang];
    this.lang = lang;

    const bemEl = createBEMEl('search');
    this.el = document.querySelector('.search');

    // Create new element or clear old element
    if (!this.el) {
      this.el = createEl({ tag: 'form', className: 'search' });
    } else {
      this.el.innerHTML = '';
    }

    const field = bemEl('field', { appendTo: this.el });

    this.searchInput = bemEl('input', {
      tag: 'input',
      appendTo: field,
      attr: {
        type: 'text',
        name: 'city',
        placeholder: content.searchPlaceholder,
      },
    });

    this.searchInput.required = true;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      this.speechBtn = bemEl('speech-btn', {
        tag: 'button',
        appendTo: field,
        attr: { type: 'button' },
      });
    }

    bemEl('submit-btn', {
      tag: 'button',
      content: content.searchButton,
      attr: { type: 'submit' },
      appendTo: this.el,
    });

    this.parentEl.append(this.el);
    this.appendListeners();
  }
}
