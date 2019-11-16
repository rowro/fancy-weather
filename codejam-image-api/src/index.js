import './styles/main.scss';
import Canvas from './scripts/Canvas';
import ToolBar from './scripts/ToolBar';
import ColorBar from './scripts/ColorBar';

const matrixSize = 4;

document.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.querySelector('#canvas');
  const tools = {
    paintBucket: document.querySelector('#paint-bucket-btn'),
    eyedropper: document.querySelector('#eyedropper-btn'),
    pencil: document.querySelector('#pencil-btn'),
  };

  const currentColorBtn = document.querySelector('#current-color-btn');
  const prevColorBtn = document.querySelector('#prev-color-btn');
  const defaultColors = [
    {
      name: 'red',
      value: '#F74141',
      el: document.querySelector('#red-color-btn'),
    },
    {
      name: 'blue',
      value: '#41B6F7',
      el: document.querySelector('#blue-color-btn'),
    },
  ];

  const toolBar = new ToolBar(tools);
  const colorBar = new ColorBar(prevColorBtn, currentColorBtn, defaultColors);
  const canvas = new Canvas(canvasContainer, matrixSize, toolBar, colorBar);
  canvas.init();
});
