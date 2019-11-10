import './styles/main.scss';
import Canvas from "./scripts/Canvas";

const canvasSize = 512;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas('#canvas', canvasSize);
  canvas.init();
});
