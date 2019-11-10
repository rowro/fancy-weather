export default class Canvas {
  constructor(container, size) {
    this.container = container;
    this.el = null;
    this.ctx = null;
    this.size = size;
    this.currentColor = '';
  }

  init() {
    this.el = document.createElement('canvas');

    this.el.width = this.size;
    this.el.height = this.size;

    document.querySelector(this.container).append(this.el);

    this.ctx = this.el.getContext('2d');

    // Set initial color
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0,this.size, this.size);
  }
}