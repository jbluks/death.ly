const config = require('../config');
const router = require('express').Router()

/* Helper Functions */
const helpers = require('../lib/helpers');
const killDeathGifs = helpers.killDeathGifs,
      sendDeathGifs = helpers.sendDeathGif,
      formatE164 = helpers.formatE164;

/* APIs */
const TWILIO_CLIENT = require('twilio')(config.accountSid, config.authToken);
const GIPHY = require('giphy-api')(config.giphyAPIKey);

/* Globals */
let gif_images = [];
let recipients = [];
const messages = require('../messages.json');
const INTERVAL = 24*60*60*1000; //time to send gif

// Search with a plain string using callback
GIPHY.search('death', (err, res) => {
  gif_images = res.data.map((gif) => {
      return gif.images.downsized.url;
  });
  console.log(gif_images);
});

console.log(messages);

/* Routes */

router.get('/', (req, res) => {
    res.render('index',{});
})

router.post('/register', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.phone_number);

    let number = formatE164(req.body.phone_number);

    //this should be done after phone number is confirmed
    recipients.push({
        name: req.body.name,
        number: number,
        processId: 0,
        history: []
    })

    //send notification to phone number

    res.send('a message will be sent to your number to confirm');
})

router.get('/confirmation', (req, res)=> {
    //confirmation of phone number
    //add phone number to list of recipients
    recipients.push({
        name: req.body.name,
        number: req.body.phone_number
    })
    res.send('recipient confirmed')
})

router.get('/admin', (req, res) => {
    res.render('admin', {recipients: recipients});
})

router.get('/start', (req, res) => {
    let number = req.query.number;

    let recipient = recipients.find(recipient => {
        return recipient.number === number
    })

    console.log(recipient);

    if(recipient) {
        let i = 0;
        recipient.processId = setInterval(() => {
            console.log('sending death gif...' + gif_images[i])
            sendDeathGif(recipient, gif_images[i]);
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

router.get('/stop', (req, res) => {
    let number = req.query.number;

    let recipient = recipients.find(recipient => {
        return recipient.number === number
    })

    if(recipient) {
        killDeathGifs(recipient.processId);
    }

    res.send('Death Gifs Killed.')
})

module.exports = router
