const config = require('../config');
const twilio = require('twilio')(config.accountSid, config.authToken);
const schedule = require('node-schedule');
const messages = require('../messages.json');
const deathGifs = require('./giphy').deathGifs;

let _recipients = require('../recipients.json'); //A json file storing death.ly contacts

const scheduleDaily = (recipient) => {
  console.log("Setting Schedule");
  var j = schedule.scheduleJob('30 * * * *', () => {
      sendDeathGif(recipient);
    });
}

const killDeathGifs = id => {
      clearInterval(id);
}

const sendDeathGif = (recipient) => {
    let message = messages[Math.floor(Math.random()*messages.length)]
    const gifs = deathGifs();
    let gif;

    if(recipient.imageIndex > gifs.length) {
      gif = gifs[Math.floor(Math.random()*gifs.length)];
    } else {
      gif = gifs[recipient.imageIndex];
      recipient.imageIndex++;
    }

    twilio.messages.create(
      {
        to: recipient.number,
        from: config.sendingNumber,
        body: `${message} ${recipient.name}`,
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

const formatE164 = (number) => {
  return '+1' + number.replace(new RegExp(/(-)/g), "");
}

const recipients = {
  getRecipients: () => {
    return _recipients;
  },
  save: () => {

  }

}

module.exports = { scheduleDaily, formatE164, recipients }
