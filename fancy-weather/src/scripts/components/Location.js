import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { createEl, createBEMEl } from '../helpers/createEl';
import formatCoords from '../helpers/coords';
import i18n from '../lang';

export default class Location {
  constructor(parentEl, mapboxToken) {
    this.parentEl = parentEl;
    this.el = null;
    this.mapboxToken = mapboxToken;
  }

  renderMap(container, long, lat) {
    mapboxgl.accessToken = this.mapboxToken;

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [long, lat],
      zoom: 9,
    });

    map.on('load', map.resize);
  }

  render(data, lang) {
    const content = i18n[lang];
    const bemEl = createBEMEl('location');
    this.el = document.querySelector('.location');

    // Create new element or clear old element
    if (!this.el) {
      this.el = createEl({ className: 'location' });
    } else {
      this.el.innerHTML = '';
    }

    // Map
    const mapEl = bemEl('map', { appendTo: this.el });
    this.renderMap(mapEl, data.longitude, data.latitude);

    // Position
    bemEl('position', {
      appendTo: this.el,
      elements: [
        bemEl('latitude', {
          content: `${content.latitude}: ${formatCoords(data.latitude)}`,
        }),
        bemEl('longitude', {
          content: `${content.longitude}: ${formatCoords(data.longitude)}`,
        }),
      ],
    });

    this.parentEl.append(this.el);
  }
}
