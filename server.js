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

app.set('view engine', 'ejs');

// require the Twilio module and create a REST client
const TWILIO_CLIENT = require('twilio')(config.accountSid, config.authToken);

// Require with custom API key
const GIPHY = require('giphy-api')(config.giphyAPIKey);

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

function killDeathGifs() {
    clearInterval(id);
}

function sendDeathGif(gif) {
    TWILIO_CLIENT.messages.create(
      {
        to: '+14168805435',
        from: '+16479521905',
        body: 'You never know when...or how...the end will come.',
        mediaUrl: gif,
      },
      (err, message) => {
        if(err) {
          console.log(err);
          return;
        }
        console.log(message.status);
      }
    );
}

app.get('/', (req, res) => {
    res.render('index',{});
})

app.post('/register', (req, res) => {

})

app.get('/admin', (req, res) => {
    res.send('Death.ly Admin')
})

app.get('/start', (req, res) => {
    if(!id) {
        id = setInterval(() => {
            console.log('sending death gif...' + gif_images[i])
            sendDeathGif(gif_images[i]);
            i++;
            if(i >= 5) {
                console.log('killing death gif...')
                killDeathGifs();
            }
        }, INTERVAL);
        res.send(`death gifs started. Interval is ${INTERVAL}`);
    } else {
        res.send('death gifs already started.')
    }
})

app.get('/stop', (req, res) => {
    killDeathGifs();
    res.send('Death Gifs Killed.')
})


app.listen(8080, () => {
    console.log('Death.ly listening on 8080.');
})
