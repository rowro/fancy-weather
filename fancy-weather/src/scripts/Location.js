import { createEl, createBEMEl } from './helpers/createEl';
import img from '../assets/images/map.png';

export default class Location {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.el = null;
  }

  render() {
    const data = {
      img,
      latitude: '53°54',
      longitude: '27°34',
    };

    const bemEl = createBEMEl('location');
    this.el = createEl({ className: 'location' });

    // Map
    bemEl('map', { tag: 'img', attr: { src: data.img }, appendTo: this.el });

    // Position
    bemEl('position', {
      appendTo: this.el,
      elements: [
        bemEl('latitude', { content: `Latitude: ${data.latitude}` }),
        bemEl('longitude', { content: `Longitude: ${data.longitude}` }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
