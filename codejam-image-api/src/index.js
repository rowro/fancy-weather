import 'babel-polyfill';

import './styles/main.scss';
import netlifyIdentity from 'netlify-identity-widget';

import ImageLoader from './scripts/ImageLoader';
import Canvas from './scripts/Canvas';

document.addEventListener('DOMContentLoaded', () => {
  const canvasConfig = {
    container: document.querySelector('#canvas'),
    canvasSize: 512,
    matrixSize: 128,
    loadImageForm: document.querySelector('#load-image-form'),
    tools: {
      paintBucket: document.querySelector('#paint-bucket-btn'),
      eyedropper: document.querySelector('#eyedropper-btn'),
      pencil: document.querySelector('#pencil-btn'),
    },
    colors: {
      currentColorBtn: document.querySelector('#current-color-btn'),
      prevColorBtn: document.querySelector('#prev-color-btn'),
      defaultColors: [
        {
          name: 'red',
          value: '#F74141',
          el: document.querySelector('#red-color-btn'),
        },
        {
          name: 'blue',
          value: '#41B6F7',
          el: document.querySelector('#blue-color-btn'),
        },
      ],
    },
  };

  netlifyIdentity.init();

  window.canvas = new Canvas(canvasConfig);
  window.canvas.init();

  const imageLoaderConfig = {
    apiService: 'unsplash',
    apiKey: 'dc69a3a5c7307e69223737cc39b69f1cd4cf001aaa6d2e58b63179f0a25f702a',
  };

  const unsplashImageLoader = new ImageLoader(imageLoaderConfig);
  const loadImageForm = document.querySelector('#load-image-form');

  loadImageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = new FormData(e.target).get('city');
    unsplashImageLoader.loadCityImage(city)
      .then((img) => {
        window.canvas.clearCanvas();
        window.canvas.isImageLoaded = true;
        window.canvas.drawImage(img);
      });
  });
});
