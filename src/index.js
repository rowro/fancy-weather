import 'babel-polyfill';
import './styles/main.scss';
import App from './scripts/App';

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    rootEl: document.querySelector('#app'),
    apiTokens: {
      ipInfo: '30944dcadcf9c2',
      openCage: '822d82d367f44178bff7997359f2367b',
      mapbox: 'pk.eyJ1Ijoicm93cm8iLCJhIjoiY2szeXYxeG83MDE1ZjNscWNsdTMxazl2MiJ9.2IO5-laEKs-5i2O6JlTZXw',
      openWeather: '4418d175a55a0916436fa10a6f7e1bc4',
      unsplash: '0edb2e37a81d23e73549fa32764fe5c969523822f0fecba9c12f0641e24f2e2c',
    },
  };

  const app = new App(config);
  app.render();
});
