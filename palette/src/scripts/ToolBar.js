export default class ToolBar {
  constructor(tools) {
    this.el = null;
    this.ctx = null;
    this.tools = tools;
    this.currentTool = '';
    this.matrixSize = null;
    this.canvasSize = null;

    this.init();
  }

  init() {
    // Set initial tool
    if (localStorage.getItem('currentTool')) {
      this.changeTool( localStorage.getItem('currentTool') );
    } else {
      this.changeTool('pencil');
    }

    Object.keys(this.tools).forEach((key) => {
      this.tools[key].addEventListener('click', () => {
        this.changeTool(key);
        console.log(key);
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
      }
    });
  }

  changeTool(tool) {
    this.currentTool = tool;
    localStorage.setItem('currentTool', this.currentTool);

    Object.values(this.tools).forEach(item => {
      item.classList.remove('toolbar__btn--active');
    });

    this.tools[tool].classList.add('toolbar__btn--active');
  }

  applyCurrentTool(e) {
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
        this.pencil(pos);
        break;

      default:
        break;
    }
  }

  paintBucket() {
    let size = this.canvasSize;
    this.ctx.fillRect(0, 0, size, size);
  }

  eyedropper(pos) {
    let color = this.ctx.getImageData(pos.x, pos.y, 1, 1).data;
    color = `rgba(${color.join(', ')})`;
    document.dispatchEvent(new CustomEvent('changeColor', { detail: color }));
  }

  pencil(pos) {
    const pxSize = this.canvasSize / this.matrixSize;
    let currentPos = {
      x: Math.floor((pos.x - this.canvasSize) / pxSize) + this.matrixSize,
      y: Math.floor((pos.y - this.canvasSize) / pxSize) + this.matrixSize,
    };

    this.ctx.fillRect(currentPos.x * pxSize, currentPos.y * pxSize, pxSize, pxSize);
  }
}