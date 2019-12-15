import { createBEMEl, createEl } from './helpers/createEl';

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
    recognition.lang = 'en';
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
    this.speechBtn.addEventListener('click', () => this.startRecognizer());
  }

  render() {
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
        placeholder: 'Search city or ZIP',
      },
    });

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      this.speechBtn = bemEl('speech-btn', {
        tag: 'button',
        appendTo: field,
        attr: { type: 'button' },
      });
    }

    bemEl('submit-btn', {
      tag: 'button',
      content: 'Search',
      attr: { type: 'submit' },
      appendTo: this.el,
    });

    this.parentEl.append(this.el);
    this.appendListeners();
  }
}
