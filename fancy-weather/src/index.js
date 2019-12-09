import 'babel-polyfill';
import './styles/main.scss';
import App from './scripts/App';

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    rootEl: document.querySelector('#app'),
  };

  const app = new App(config);
  app.render();
});
