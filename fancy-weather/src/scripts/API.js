export default class API {
  constructor(config) {
    this.ipInfoToken = config.ipInfoToken;
    this.openCageToken = config.openCageToken;
  }

  async getUserPosition() {
    let pos = {};
    try {
      pos = await new Promise((resolve, reject) => {
        // Wait for the user to allow geolocation
        const timer = setTimeout(reject, 5000);
        navigator.geolocation.getCurrentPosition((response) => {
          clearTimeout(timer);
          return resolve(response);
        }, reject, { timeout: 5000 });
      });

      const cityRes = await this.getCityFromCoords(pos.coords.latitude, pos.coords.longitude);
      const { city, country } = cityRes.results[0].components;

      pos.city = city;
      pos.country = country;
    } catch (e) {
      // If user not allow geolocation, determine geolocation by IP
      pos = await this.getIpData();
    }

    return {
      ...pos,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  }

  async getIpData() {
    const response = await fetch(`https://ipinfo.io/json?token=${this.ipInfoToken}`);
    const data = await response.json();

    const loc = data.loc.split(',');

    return {
      city: data.city,
      latitude: loc[0],
      longitude: loc[1],
      country: data.country,
      timezone: data.timezone,
    };
  }

  async getCityFromCoords(latitude, longitude) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${this.openCageToken}`);
    const data = await response.json();

    return data;
  }
}
