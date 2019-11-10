export default class Canvas {
  constructor(container, size, toolbar, colorbar) {
    this.container = container;
    this.el = null;
    this.ctx = null;
    this.size = size;
    this.toolbar = toolbar;
    this.colorbar = colorbar;
  }

  init() {
    this.el = document.createElement('canvas');

    this.el.width = this.container.clientWidth;
    this.el.height = this.container.clientHeight;

    this.container.append(this.el);

    this.ctx = this.el.getContext('2d');

    // Fill canvas
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.el.width, this.el.height);

    this.toolbar.ctx = this.ctx;
    this.toolbar.canvasSize = this.el.width;
    this.toolbar.matrixSize = this.size;

    this.colorbar.ctx = this.ctx;

    // Set initial color
    const initialColors = {
      prev: localStorage.getItem('prevColor'),
      current: localStorage.getItem('currentColor'),
    };

    if (initialColors.prev && initialColors.current) {
      this.colorbar.changeColor(initialColors.prev);
      this.colorbar.changeColor(initialColors.current);
    } else if (initialColors.current) {
      this.colorbar.changeColor(initialColors.current);
    } else {
      this.colorbar.changeColor('green');
    }

    // Restore canvas from localstorage
    if (localStorage.getItem('canvasImage')) {
      const img = new Image;
      img.src = localStorage.getItem('canvasImage');
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
    }

    this.el.addEventListener('click', (e) => {
      this.toolbar.applyCurrentTool(e);
      this.saveCanvas();
    });

    // Events for pencil tool
    this.el.addEventListener('mousedown', () => {
      this.toolbar.mouseDown = true;

      this.el.onmousemove = (e) => {
        this.toolbar.applyCurrentTool(e);
      }
    });

    this.el.addEventListener('mouseup', () => {
      this.el.onmousemove = null;
      this.toolbar.mouseDown = false;
      this.saveCanvas();
    });

    document.addEventListener('changeColor', (e) => {
      this.colorbar.changeColor(e.detail);
    })
  }

  saveCanvas() {
    localStorage.setItem('canvasImage', this.el.toDataURL());
  }
}