import API from './API';
import Search from './Search';
import Actions from './Actions';
import TodayWeather from './TodayWeather';
import Forecast from './Forecast';
import Location from './Location';

import { getSeason, localDate, getDayTime } from './helpers/date';
import { CHANGE_MEASURE, UPDATE_BG_IMAGE } from './constants';

export default class App {
  constructor({ rootEl, apiTokens }) {
    this.el = rootEl;
    this.apiTokens = apiTokens;
    this.data = null;
    this.measure = 'celsius';
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
    const { country } = this.data;

    this.actions.updateImgBtn.disabled = true;

    const img = await this.api.getPhoto(season, dayTime, weather, country);
    document.body.style.backgroundImage = `url(${img.src})`;

    this.actions.updateImgBtn.disabled = false;

    return img;
  }

  changeMeasure(measure) {
    if (measure !== this.measure) {
      this.measure = measure;
      localStorage.setItem('measure', this.measure);

      if (this.data) {
        this.todayWeather.render({
          ...this.data,
          measure: this.measure,
        });
        this.forecast.render({
          ...this.data,
          measure: this.measure,
        });
      }
    }
  }

  appendListeners() {
    // Change image
    document.addEventListener(UPDATE_BG_IMAGE, () => this.updateBgImage());

    // Change measure
    document.addEventListener(CHANGE_MEASURE, (e) => this.changeMeasure(e.detail.measure));
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

    if (localStorage.getItem('measure')) {
      this.measure = localStorage.getItem('measure');
    } else {
      localStorage.setItem('measure', this.measure);
    }

    this.search.render();
    this.actions.render(this.measure);

    this.appendListeners();

    this.actions.updateImgBtn.disabled = true;

    this.getData()
      .then((data) => {
        this.data = data;
        this.updateBgImage();
        this.location.render(this.data);
        this.todayWeather.render({
          ...this.data,
          measure: this.measure,
        });
        this.forecast.render({
          ...this.data,
          measure: this.measure,
        });
      });
  }
}
