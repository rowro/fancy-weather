import ToolBar from './ToolBar';
import ColorBar from './ColorBar';

import {
  CHANGE_COLOR,
  STORAGE_MATRIX_SIZE,
  STORAGE_CANVAS_IMAGE,
  STORAGE_PREV_COLOR,
  STORAGE_CURRENT_COLOR,
} from './constants';

export default class Canvas {
  constructor({
    container, canvasSize, matrixSize, grayscaleBtn, sizes, tools, colors,
  }) {
    this.container = container;
    this.canvasSize = canvasSize;
    this.matrixSize = matrixSize;
    this.sizes = sizes;
    this.grayscaleBtn = grayscaleBtn;
    this.toolsConfig = tools;
    this.colorsConfig = colors;
    this.isImageLoaded = false;

    this.el = null;
    this.ctx = null;
    this.toolbar = null;
    this.colorbar = null;
  }

  get pxSize() {
    return this.canvasSize / this.matrixSize;
  }

  init() {
    this.matrixSize = localStorage.getItem(STORAGE_MATRIX_SIZE) || this.matrixSize;

    this.el = this.createCanvas(this.canvasSize, this.matrixSize);
    this.ctx = this.el.getContext('2d');

    this.toolbar = new ToolBar(this.toolsConfig, this.el);
    this.toolbar.init();

    this.colorbar = new ColorBar(this.colorsConfig, this.el);
    this.colorbar.init();

    this.loadCanvas();
    this.attachEvents();
    this.drawGrid();
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

  drawGrid() {
    const gridSize = (this.pxSize === 4) ? this.pxSize * 4 : this.pxSize * 2;
    this.container.style.backgroundSize = `${gridSize}px ${gridSize}px`;
  }

  // Save canvas to localstorage
  saveCanvas() {
    const imageData = this.el.toDataURL();
    localStorage.setItem(STORAGE_CANVAS_IMAGE, imageData);
  }

  // Load canvas from localstorage
  loadCanvas() {
    const initial = {
      prevColor: localStorage.getItem(STORAGE_PREV_COLOR),
      currentColor: localStorage.getItem(STORAGE_CURRENT_COLOR),
      image: localStorage.getItem(STORAGE_CANVAS_IMAGE),
      matrixSize: localStorage.getItem(STORAGE_MATRIX_SIZE),
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

    // Set canvas size
    if (initial.matrixSize) {
      this.matrixSize = initial.matrixSize;
    }

    // Restore canvas from localstorage
    if (initial.image) {
      const img = new Image();
      img.src = initial.image;
      img.onload = () => {
        this.isImageLoaded = true;
        this.drawImage(img);
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

    // On change size
    this.sizes.forEach((item) => {
      item.el.addEventListener('click', () => {
        this.changeMatrixSize(item.size);
      });
    });

    // B&W
    this.grayscaleBtn.addEventListener('click', () => {
      this.toGrayScale();
    });
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

  toGrayScale() {
    if (!this.isImageLoaded) {
      window.alert('Загрузите изображение');
      return;
    }

    const imageData = this.ctx.getImageData(0, 0, this.canvasSize, this.canvasSize);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.saveCanvas();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
  }

  changeMatrixSize(size) {
    localStorage.setItem(STORAGE_MATRIX_SIZE, size);
    this.saveCanvas();

    this.matrixSize = size;
    this.el.width = size;
    this.el.height = size;
    this.drawGrid();

    this.loadCanvas();
  }
}
