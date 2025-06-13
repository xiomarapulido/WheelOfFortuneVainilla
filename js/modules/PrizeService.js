// js/modules/PrizeService.js
export class PrizeService {
  constructor(url) {
    this.url = url;
  }

  fetchPrize() {
    return fetch(this.url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => data.prize);
  }
}