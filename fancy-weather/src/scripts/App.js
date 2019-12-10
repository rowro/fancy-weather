import API from './API';
import Search from './Search';
import Actions from './Actions';
import TodayWeather from './TodayWeather';
import ThreeDaysWeather from './ThreeDaysWeather';
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
    };

    this.api = new API(apiConfig);

    this.search = new Search(this.gridEl);
    this.actions = new Actions(this.gridEl);
    this.todayWeather = new TodayWeather(this.gridEl);
    this.threeDaysWeather = new ThreeDaysWeather(this.gridEl);
    this.location = new Location(this.gridEl, apiConfig.mapboxToken);

    this.search.render();
    this.actions.render();
    this.threeDaysWeather.render();

    this.api.getUserPosition()
      .then((data) => {
        console.log(data);
        this.location.render(data);
        this.api.getWeather(data.city)
          .then((weatherData) => {
            this.todayWeather.render({ ...weatherData.todayWeather, ...data });
          });
      })
      .catch(() => {
        this.api.getIpData()
          .then((data) => {
            console.log(data);
            this.todayWeather.render(data);
            this.location.render(data);
          });
      });
  }
}
