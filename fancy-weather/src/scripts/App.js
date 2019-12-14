import API from './API';
import Search from './Search';
import Actions from './Actions';
import TodayWeather from './TodayWeather';
import Forecast from './Forecast';
import Location from './Location';

import { getSeason, localDate, getDayTime } from './helpers/date';

export default class App {
  constructor({ rootEl, apiTokens }) {
    this.el = rootEl;
    this.apiTokens = apiTokens;
    this.data = null;
  }

  async getData() {
    const posData = await this.api.getUserPosition();
    const weatherData = await this.api.getWeather(posData.city);

    return { ...posData, ...weatherData };
  }

  async updateBgImage() {
    const season = getSeason(localDate());
    const dayTime = getDayTime(localDate());
    const weather = this.data.todayWeather.description;
    const { country, city } = this.data;

    this.actions.changeImgBtn.disabled = true;

    const img = await this.api.getPhoto(season, dayTime, weather, country, city);
    document.body.style.backgroundImage = `url(${img.src})`;

    this.actions.changeImgBtn.disabled = false;

    return img;
  }

  appendListeners() {
    this.actions.changeImgBtn.addEventListener('click', () => this.updateBgImage());
  }

  render() {
    const grid = document.createElement('div');
    grid.className = 'grid';
    this.el.append(grid);

    this.api = new API(this.apiTokens);

    this.search = new Search(grid);
    this.actions = new Actions(grid);
    this.todayWeather = new TodayWeather(grid);
    this.forecast = new Forecast(grid);
    this.location = new Location(grid, this.apiTokens.mapbox);

    this.search.render();
    this.actions.render();

    this.appendListeners();

    this.actions.changeImgBtn.disabled = false;

    this.getData()
      .then((data) => {
        this.data = data;
        this.updateBgImage();
        this.location.render(this.data);
        this.todayWeather.render(this.data);
        this.forecast.render(this.data);
      });
  }
}
