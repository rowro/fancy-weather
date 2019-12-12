import API from './API';
import Search from './Search';
import Actions from './Actions';
import TodayWeather from './TodayWeather';
import Forecast from './Forecast';
import Location from './Location';

export default class App {
  constructor({ rootEl }) {
    this.el = rootEl;
    this.gridEl = null;
    this.data = null;
  }

  render() {
    this.gridEl = document.createElement('div');
    this.gridEl.className = 'grid';
    this.el.append(this.gridEl);

    const apiConfig = {
      ipInfoToken: '30944dcadcf9c2',
      openCageToken: '822d82d367f44178bff7997359f2367b',
      mapboxToken: 'pk.eyJ1Ijoicm93cm8iLCJhIjoiY2szeXYxeG83MDE1ZjNscWNsdTMxazl2MiJ9.2IO5-laEKs-5i2O6JlTZXw',
      openWeatherToken: '4418d175a55a0916436fa10a6f7e1bc4',
      unsplashToken: '0edb2e37a81d23e73549fa32764fe5c969523822f0fecba9c12f0641e24f2e2c',
    };

    this.api = new API(apiConfig);

    this.search = new Search(this.gridEl);
    this.actions = new Actions(this.gridEl);
    this.todayWeather = new TodayWeather(this.gridEl);
    this.forecast = new Forecast(this.gridEl);
    this.location = new Location(this.gridEl, apiConfig.mapboxToken);

    this.search.render();
    this.actions.render();

    this.api.getUserPosition()
      .then((data) => {
        this.location.render(data);
        this.api.getWeather(data.city)
          .then((weatherData) => {
            this.api.getPhoto()
              .then((img) => {
                document.body.style.backgroundImage = `url(${img.src})`;
              });
            this.todayWeather.render({ ...weatherData.todayWeather, ...data });
            this.forecast.render({
              items: weatherData.forecast,
              timezone: data.timezone,
              lang: 'en',
            });
          });
      })
      .catch(() => {
        this.api.getIpData()
          .then((data) => {
            this.location.render(data);
            this.api.getWeather(data.city)
              .then((weatherData) => {
                this.api.getPhoto()
                  .then((img) => {
                    document.body.style.backgroundImage = `url(${img.src})`;
                  });
                this.todayWeather.render({ ...weatherData.todayWeather, ...data });
                this.forecast.render({
                  items: weatherData.forecast,
                  timezone: data.timezone,
                  lang: 'en',
                });
              });
          });
      });
  }
}
