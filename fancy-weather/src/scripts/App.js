import API from './API';
import Search from './components/Search';
import Actions from './components/Actions';
import TodayWeather from './components/TodayWeather';
import Forecast from './components/Forecast';
import Location from './components/Location';

import { getSeason, localDate, getDayTime } from './helpers/date';
import { CHANGE_LANGUAGE, CHANGE_MEASURE, UPDATE_BG_IMAGE } from './constants';

export default class App {
  constructor({ rootEl, apiTokens }) {
    this.el = rootEl;
    this.apiTokens = apiTokens;
    this.data = null;
    this.measure = 'celsius';
    this.lang = 'en';
  }

  async getFullData() {
    const posData = await this.api.getUserPosition(this.lang);
    const weatherData = await this.api.getWeather(posData.latitude, posData.longitude, this.lang);

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
  }

  changeMeasure(measure) {
    if (measure !== this.measure) {
      this.measure = measure;
      localStorage.setItem('measure', this.measure);

      if (this.data) {
        this.todayWeather.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });

        this.forecast.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });
      }
    }
  }

  async changeLang(lang) {
    if (lang !== this.lang) {
      this.lang = lang;
      localStorage.setItem('lang', this.lang);

      if (this.data) {
        this.search.render(this.lang);
        this.location.render(this.data, this.lang);

        const { city, latitude, longitude } = this.data;
        const cityData = await this.api.getCityData(city, this.lang);
        const weatherData = await this.api.getWeather(latitude, longitude, this.lang);

        this.data = { ...cityData, ...weatherData };

        this.todayWeather.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });

        this.forecast.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });
      }
    }
  }

  async searchCity(query) {
    const cityData = await this.api.getCityData(query, this.lang);

    if (!cityData) {
      alert('City not found!');
      return null;
    }

    const weatherData = await this.api.getWeather(cityData.latitude, cityData.longitude, this.lang);

    if (!weatherData) {
      alert('City not found!');
      return null;
    }

    this.data = { ...cityData, ...weatherData };

    this.updateBgImage();

    this.location.render(this.data, this.lang);

    this.todayWeather.render({
      ...this.data,
      measure: this.measure,
      lang: this.lang,
    });

    this.forecast.render({
      ...this.data,
      measure: this.measure,
      lang: this.lang,
    });

    return this.data;
  }

  appendListeners() {
    // Change image
    document.addEventListener(UPDATE_BG_IMAGE, () => this.updateBgImage());

    // Change measure
    document.addEventListener(CHANGE_MEASURE, (e) => this.changeMeasure(e.detail.measure));

    // Change language
    document.addEventListener(CHANGE_LANGUAGE, (e) => this.changeLang(e.detail.lang));

    // Search
    this.search.el.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(e.target);
      const query = data.get('city');

      if (query) {
        this.searchCity(query);
      }
    });
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

    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', this.lang);
    }

    this.search.render(this.lang);
    this.actions.render(this.lang, this.measure);

    this.appendListeners();

    this.actions.updateImgBtn.disabled = true;

    this.getFullData()
      .then((data) => {
        this.data = data;
        this.updateBgImage();
        this.location.render(this.data, this.lang);
        this.todayWeather.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });
        this.forecast.render({
          ...this.data,
          measure: this.measure,
          lang: this.lang,
        });
      });
  }
}
