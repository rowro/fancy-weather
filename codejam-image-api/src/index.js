import 'babel-polyfill';

import './styles/main.scss';
import netlifyIdentity from 'netlify-identity-widget';

import Canvas from './scripts/Canvas';

document.addEventListener('DOMContentLoaded', () => {
  netlifyIdentity.init();

  const config = {
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

  window.canvas = new Canvas(config);
  window.canvas.init();
});
