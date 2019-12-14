import countries from '../assets/country-names';

export default class API {
  constructor(tokens) {
    this.tokens = tokens;
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

    const { city, country, timezone } = await this.getCityFromCoords(latitude, longitude);

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
    const response = await fetch(`https://ipinfo.io/json?token=${this.tokens.ipInfo}`);
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
    const query = `language=${lang}&q=${latitude}+${longitude}&key=${this.tokens.openCage}`;

    const response = await fetch(rootUrl + query);
    const data = await response.json();

    const { city, country, state } = data.results[0].components;

    return {
      city: city || state,
      country,
      timezone: data.results[0].annotations.timezone.name,
    };
  }

  async getWeather(city) {
    const lang = 'en';
    const rootUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
    const query = `q=${city}&lang=${lang}&units=metric&APPID=${this.tokens.openWeather}`;
    const response = await fetch(rootUrl + query);
    const data = await response.json();

    const todayWeather = data.list.find(
      (item) => (Date.now() < new Date(item.dt * 1000)),
    );

    const currentDay = new Date().getDate();

    // Get three days weather from array
    const forecast = data.list
      .filter((item) => {
        const itemDay = new Date(item.dt * 1000).getDate();
        return (itemDay > currentDay) && (itemDay < (currentDay + 3));
      })
      .slice(-12)
      .reduce((res, item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!res[chunkIndex]) res[chunkIndex] = [];
        res[chunkIndex].push(item);

        return res;
      }, [])
      .map((day, index) => ({
        date: new Date().setDate(currentDay + index + 1),
        // Calc average temp
        temp: Math.floor(day.reduce((res, item) => res + item.main.temp, 0) / day.length),
        icon: day[0].weather[0].icon,
      }));

    return {
      forecast,
      todayWeather: {
        icon: todayWeather.weather[0].icon,
        description: todayWeather.weather[0].description,
        temp: Math.floor(todayWeather.main.temp),
        feelsLike: Math.floor(todayWeather.main.feels_like),
        wind: Math.floor(todayWeather.wind.speed),
        humidity: Math.floor(todayWeather.main.humidity),
      },
    };
  }

  async getPhoto(...params) {
    const rootUrl = 'https://api.unsplash.com/photos/random';
    const query = `?orientation=landscape&per_page=1&query=${params.join(',')}&client_id=${this.tokens.unsplash}`;
    const response = await fetch(rootUrl + query);
    const data = await response.json();

    return new Promise((resolve) => {
      const img = new Image();
      img.src = data.urls.regular;
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
    });
  }
}
