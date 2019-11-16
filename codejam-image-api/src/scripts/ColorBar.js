export default class ColorBar {
  constructor(prevColorEl, currentColorEl, defaultColors) {
    this.ctx = null;
    this.prevColorEl = prevColorEl;
    this.currentColorEl = currentColorEl;
    this.defaultColors = defaultColors;

    this.prevColor = '';
    this.currentColor = '';

    this.init();
  }

  init() {
    const colorInput = this.currentColorEl.querySelector('input[type="color"]');
    colorInput.addEventListener('input', () => {
      this.changeColor(colorInput.value);
    });

    this.prevColorEl.addEventListener('click', () => {
      this.changeColor(this.prevColor);
    });

    this.defaultColors.forEach((color) => {
      color.el.addEventListener('click', () => {
        this.changeColor(color.value);
      });
    });
  }

  changeColor(color) {
    this.prevColor = (!this.prevColor) ? color : this.currentColor;
    this.currentColor = color;

    localStorage.setItem('prevColor', this.prevColor);
    localStorage.setItem('currentColor', this.currentColor);

    this.ctx.fillStyle = this.currentColor;
    this.currentColorEl.querySelector('.color-icon').style.backgroundColor = this.currentColor;
    this.prevColorEl.querySelector('.color-icon').style.backgroundColor = this.prevColor;
  }
}