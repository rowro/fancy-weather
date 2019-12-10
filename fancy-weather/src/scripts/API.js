import countries from '../assets/country-names';

export default class API {
  constructor(config) {
    this.ipInfoToken = config.ipInfoToken;
    this.openCageToken = config.openCageToken;
    this.openWeatherToken = config.openWeatherToken;
  }

  /**
   * Get user position
   * @returns {Promise<{country: *, city: *, timezone: *, latitude: *, longitude: *}>}
   */
  async getUserPosition() {
    let pos = null;

    try {
      pos = await this.getGeoData();
    } catch (e) {
      // If the user did not allow geolocation, determine geolocation by IP
      pos = await this.getIpData();
    }

    return pos;
  }

  /**
   * Get user location by Geolocation API
   * @returns {Promise<{country: *, city: *, timezone: *, latitude: *, longitude: *}>}
   */
  async getGeoData() {
    const res = await new Promise((resolve, reject) => {
      // Wait for the user to allow geolocation
      const timer = setTimeout(reject, 5000);
      navigator.geolocation.getCurrentPosition((response) => {
        clearTimeout(timer);
        return resolve(response);
      }, reject, { timeout: 5000 });
    });

    const { latitude, longitude } = res.coords;

    const cityRes = await this.getCityFromCoords(latitude, longitude);
    const { city, country } = cityRes.results[0].components;
    const timezone = cityRes.results[0].annotations.timezone.name;

    return {
      latitude,
      longitude,
      city,
      country,
      timezone,
    };
  }

  /**
   * Get user location by IP data
   * @returns {Promise<{country: {}, city: {}, timezone: {}, latitude: *, longitude: *}>}
   */
  async getIpData() {
    const response = await fetch(`https://ipinfo.io/json?token=${this.ipInfoToken}`);
    const data = await response.json();

    const loc = data.loc.split(',');

    return {
      latitude: loc[0],
      longitude: loc[1],
      city: data.city,
      country: countries[data.country],
      timezone: data.timezone,
    };
  }

  /**
   * Get city and country by coords [lat, long]
   * @param latitude
   * @param longitude
   * @returns {Promise<any>}
   */
  async getCityFromCoords(latitude, longitude) {
    const lang = 'en';
    const rootUrl = 'https://api.opencagedata.com/geocode/v1/json?';
    const query = `language=${lang}&q=${latitude}+${longitude}&key=${this.openCageToken}`;

    const response = await fetch(rootUrl + query);
    const data = await response.json();

    return data;
  }

  async getWeather(city) {
    const lang = 'en';
    const rootUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
    const query = `q=${city}&lang=${lang}&units=metric&APPID=${this.openWeatherToken}`;
    const response = await fetch(rootUrl + query);
    const data = await response.json();

    const todayWeather = data.list.find(
      (item) => (Date.now() < new Date(item.dt * 1000)),
    );
    console.log(todayWeather);
    console.log(data);

    return {
      todayWeather: {
        icon: todayWeather.weather[0].icon,
        description: todayWeather.weather[0].description,
        temp: Math.floor(todayWeather.main.temp),
        wind: Math.floor(todayWeather.wind.speed),
        humidity: Math.floor(todayWeather.main.humidity),
      },
    };
  }
}
