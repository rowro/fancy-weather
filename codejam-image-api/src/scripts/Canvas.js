import ToolBar from './ToolBar';
import ColorBar from './ColorBar';

import CHANGE_COLOR from './events';

export default class Canvas {
  constructor({
    container, canvasSize, matrixSize, loadImageForm, tools, colors,
  }) {
    this.container = container;
    this.canvasSize = canvasSize;
    this.matrixSize = matrixSize;
    this.loadImageForm = loadImageForm;
    this.toolsConfig = tools;
    this.colorsConfig = colors;
  }

  get pxSize() {
    return this.canvasSize / this.matrixSize;
  }

  init() {
    this.el = this.createCanvas(this.canvasSize, this.matrixSize);
    this.ctx = this.el.getContext('2d');

    this.toolbar = new ToolBar(this.toolsConfig, this.el);
    this.colorbar = new ColorBar(this.colorsConfig, this.el);

    // Grid size
    const gridSize = this.pxSize * 4;
    this.container.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    this.loadCanvas();
    this.attachEvents();

    // this.getImageLink();
  }

  createCanvas(canvasSize, matrixSize) {
    const el = document.createElement('canvas');

    // Virtual canvas size
    el.width = matrixSize;
    el.height = matrixSize;

    // Physical canvas size
    el.style.width = `${canvasSize}px`;
    el.style.height = `${canvasSize}px`;

    this.container.append(el);
    return el;
  }

  // Save canvas to localstorage
  saveCanvas() {
    localStorage.setItem('canvasImage', this.el.toDataURL());
  }

  // Load canvas from localstorage
  loadCanvas() {
    const initial = {
      prevColor: localStorage.getItem('prevColor'),
      currentColor: localStorage.getItem('currentColor'),
      image: localStorage.getItem('canvasImage'),
    };

    // Set initial color
    if (initial.prevColor && initial.currentColor) {
      this.colorbar.changeColor(initial.prevColor);
      this.colorbar.changeColor(initial.currentColor);
    } else if (initial.currentColor) {
      this.colorbar.changeColor(initial.currentColor);
    } else {
      this.colorbar.changeColor('green');
    }

    // Restore canvas from localstorage
    if (initial.image) {
      const img = new Image();
      img.src = initial.image;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
    }
  }

  attachEvents() {
    // Event for canvas
    this.el.addEventListener('click', (e) => {
      this.toolbar.applyCurrentTool(e, true);
      this.saveCanvas();
    });

    // Events for pencil tool
    this.el.addEventListener('mousedown', () => {
      this.toolbar.mouseDown = true;

      this.el.onmousemove = (e) => {
        this.toolbar.applyCurrentTool(e);
      };
    });

    this.el.addEventListener('mouseup', () => {
      this.el.onmousemove = null;
      this.toolbar.mouseDown = false;
      this.saveCanvas();
    });

    // On change color by eyedropper
    document.addEventListener(CHANGE_COLOR, (e) => {
      this.colorbar.changeColor(e.detail);
    });

    // On submit image load
    this.loadImageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const city = new FormData(e.target).get('city');
      this.loadImage(city);
    });
  }

  async loadImage(city) {
    const rootUrl = 'https://api.unsplash.com/photos/random';
    const clientId = 'dc69a3a5c7307e69223737cc39b69f1cd4cf001aaa6d2e58b63179f0a25f702a';
    const url = `${rootUrl}?query=town,${city}&client_id=${clientId}&w=${this.canvasSize}`;

    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.urls.custom;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      this.clearCanvas();
      this.drawImage(img);
    };
  }

  drawImage(img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const size = this.canvasSize;

    const ratio = (width > height) ? width / height : height / width;

    const rect = {
      width: (width < height) ? size / ratio : size,
      height: (width > height) ? size / ratio : size,
    };

    const pos = {
      x: (width < height) ? Math.abs(size - rect.width) / this.pxSize / 2 : 0,
      y: (width > height) ? Math.abs(size - rect.height) / this.pxSize / 2 : 0,
    };

    this.ctx.drawImage(img, 0, 0,
      img.width * this.pxSize, img.height * this.pxSize,
      pos.x, pos.y, rect.width, rect.height);

    this.saveCanvas();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
  }
}
