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

    this.el.addEventListener('click', (e) => {
      this.toolbar.applyCurrentTool(e);
    });

    document.addEventListener('changeColor', (e) => {
      this.colorbar.changeColor(e.detail);
    })
  }
}