import './styles/main.scss';

const canvasSize = 512;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#canvas');

  // Set canvas size
  canvas.width = canvasSize;
  canvas.height = canvasSize;
});
