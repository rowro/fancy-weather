const urlTemplates = {
  unsplash: (apiKey, city) => {
    const rootUrl = 'https://api.unsplash.com/photos/random';
    return `${rootUrl}?query=town,${city}&client_id=${apiKey}`;
  },
};

export default class ImageLoader {
  constructor({ apiKey, apiService = 'unsplash' }) {
    this.apiKey = apiKey;
    this.apiService = apiService;

    this.urlTemplates = urlTemplates;
  }

  async loadCityImage(city) {
    let url;
    try {
      url = this.urlTemplates[this.apiService](this.apiKey, city);
    } catch (e) {
      throw new Error(`Unknown API service: ${this.apiService}`);
    }

    const res = await fetch(url);
    const data = await res.json();

    return new Promise((resolve) => {
      const img = new Image();
      if (this.apiService === 'unsplash') {
        img.src = data.urls.small;
      }
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
    });
  }
}
