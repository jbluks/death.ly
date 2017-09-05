'use strict';

/*
TODO:
-- Get random list of Gifs, minimize sending same ones a second time
-- Generate Random Death messages
-- Send at 7 am everyday
-- Setting for sending at random times of month
-- Setting for max times per month
-- Add Web Admin Front end
-- Add client front-end to sign up/confirm
-- Provide unsubscribe option
-- Handle unsubscribe message from SMS
-- Install on Heroku

*/

const config = require('./config');
const app = require('express')();
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', routes)

/* APIs */
const TWILIO_CLIENT = require('twilio')(config.accountSid, config.authToken);
const GIPHY = require('giphy-api')(config.giphyAPIKey);

/* Globals */
let gif_images = [];
let i = 0;
let id;
const INTERVAL = 24*60*60*1000; //time to send gif

// Search with a plain string using callback
GIPHY.search('death', (err, res) => {
    gif_images = res.data.map((gif) => {
        return gif.images.original.url;
    });
});

app.listen(config.port, () => {
    console.log(`Death.ly listening on ${config.port}.`);
})
