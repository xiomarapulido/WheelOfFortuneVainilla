import { MESSAGE_TEXT } from '../config/messageText.js';

export class PrizeService {
  constructor(url) {
    this.url = url;
  }

  fetchPrize() {
    return fetch(this.url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) throw new Error(MESSAGE_TEXT.NETWORK_ERROR);
        return response.json();
      })
      .then(data => data.prize);
  }
}