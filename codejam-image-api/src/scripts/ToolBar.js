import CHANGE_COLOR from './events';

export default class ToolBar {
  constructor(tools, canvas) {
    this.canvas = canvas;
    this.tools = tools;
    this.ctx = canvas.getContext('2d');

    this.currentTool = '';
    this.mouseDown = false;
  }

  init() {
    // Set initial tool
    if (localStorage.getItem('currentTool')) {
      this.changeTool(localStorage.getItem('currentTool'));
    } else {
      this.changeTool('pencil');
    }

    Object.keys(this.tools).forEach((key) => {
      this.tools[key].addEventListener('click', () => {
        this.changeTool(key);
      });
    });

    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyB':
          this.changeTool('paintBucket');
          break;

        case 'KeyC':
          this.changeTool('eyedropper');
          break;

        case 'KeyP':
          this.changeTool('pencil');
          break;

        default:
          break;
      }
    });
  }

  getPixelPosition({ x, y }) {
    const pxSize = parseInt(this.canvas.style.width, 10) / this.canvas.width;
    const roundToPxSize = (num) => Math.round(num / pxSize) * pxSize;

    return {
      x: roundToPxSize(x / pxSize - (pxSize / 2)),
      y: roundToPxSize(y / pxSize - (pxSize / 2)),
    };
  }

  changeTool(tool) {
    this.currentTool = tool;
    localStorage.setItem('currentTool', this.currentTool);

    Object.values(this.tools).forEach((item) => {
      item.classList.remove('toolbar__btn--active');
    });

    this.tools[tool].classList.add('toolbar__btn--active');
  }

  applyCurrentTool(e, clicked) {
    const pos = {
      x: e.clientX - e.target.offsetLeft,
      y: e.clientY - e.target.offsetTop,
    };

    switch (this.currentTool) {
      case 'paintBucket':
        this.paintBucket();
        break;

      case 'eyedropper':
        this.eyedropper(pos);
        break;

      case 'pencil':
        if (this.mouseDown || clicked) {
          this.pencil(pos);
        }
        break;

      default:
        break;
    }
  }

  paintBucket() {
    const size = parseInt(this.canvas.style.width, 10);
    this.ctx.fillRect(0, 0, size, size);
  }

  eyedropper(pos) {
    const currentPos = this.getPixelPosition(pos);

    let color = this.ctx.getImageData(currentPos.x, currentPos.y, 1, 1).data;
    color = `rgba(${color.join(', ')})`;
    document.dispatchEvent(new CustomEvent(CHANGE_COLOR, { detail: color }));
  }

  pencil(pos) {
    const pxSize = parseInt(this.canvas.style.width, 10) / this.canvas.width;
    const currentPos = this.getPixelPosition(pos);
    this.ctx.fillRect(currentPos.x, currentPos.y, pxSize, pxSize);
  }
}
