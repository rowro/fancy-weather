import Search from './Search';
import TodayWeather from './TodayWeather';

export default class App {
  constructor({ rootEl }) {
    this.el = rootEl;
    this.gridEl = null;
  }

  render() {
    this.gridEl = document.createElement('div');
    this.gridEl.className = 'grid';
    this.el.append(this.gridEl);

    this.search = new Search(this.gridEl);
    this.todayWeather = new TodayWeather(this.gridEl);

    this.search.render();
    this.todayWeather.render();
  }
}
