const config = require('../config');
const giphy = require('giphy-api')(config.giphyAPIKey);

let gif_images = [];

// Search with a plain string using callback
giphy.search('death', (err, res) => {
  gif_images = res.data.map((gif) => {
      return gif.images.downsized.url;
  });
});

const deathGifs = () => {
  return gif_images;
}

module.exports = { deathGifs };
