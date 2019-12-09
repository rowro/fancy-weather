import Search from './Search';
import Actions from './Actions';
import TodayWeather from './TodayWeather';
import ThreeDaysWeather from './ThreeDaysWeather';
import Location from './Location';

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
    this.actions = new Actions(this.gridEl);
    this.todayWeather = new TodayWeather(this.gridEl);
    this.threeDaysWeather = new ThreeDaysWeather(this.gridEl);
    this.location = new Location(this.gridEl);

    this.search.render();
    this.actions.render();
    this.todayWeather.render();
    this.threeDaysWeather.render();
    this.location.render();
  }
}
