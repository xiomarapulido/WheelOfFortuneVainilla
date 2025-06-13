import { MESSAGE_TEXT } from '../config/messageText.js';

export class PrizeService {
  // Constructor receives the URL from which to fetch prize data
  constructor(url) {
    this.url = url;
  }

  // Method to fetch the prize data from the server
  fetchPrize() {
    // Perform a fetch request with CORS enabled
    return fetch(this.url, { mode: 'cors' })
      .then(response => {
        // Check if the response is OK (status 200-299)
        if (!response.ok) 
          // Throw an error with a network error message if not OK
          throw new Error(MESSAGE_TEXT.NETWORK_ERROR);
        // Parse and return the response JSON
        return response.json();
      })
      .then(data => 
        // Extract and return the 'prize' property from the JSON data
        data.prize
      );
  }
}
