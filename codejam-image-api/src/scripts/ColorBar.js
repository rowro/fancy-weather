import {
  STORAGE_PREV_COLOR,
  STORAGE_CURRENT_COLOR,
} from './constants';

export default class ColorBar {
  constructor({ currentColorBtn, prevColorBtn, defaultColors }, canvas) {
    this.ctx = canvas.getContext('2d');
    this.currentColorEl = currentColorBtn;
    this.prevColorEl = prevColorBtn;
    this.defaultColors = defaultColors;

    this.prevColor = '';
    this.currentColor = '';
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

    localStorage.setItem(STORAGE_PREV_COLOR, this.prevColor);
    localStorage.setItem(STORAGE_CURRENT_COLOR, this.currentColor);

    this.ctx.fillStyle = this.currentColor;
    this.currentColorEl.querySelector('.color-icon').style.backgroundColor = this.currentColor;
    this.prevColorEl.querySelector('.color-icon').style.backgroundColor = this.prevColor;
  }
}
