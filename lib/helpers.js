module.exports = {
  killDeathGifs(id) {
      clearInterval(id);
  },
  sendDeathGif(recipient ,gif) {
      TWILIO_CLIENT.messages.create(
        {
          to: recipient.number,
          from: config.sendingNumber,
          body: `You never know when...or how...the end will come ${recipient.name}`,
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
  },
  formatE164(number) {
    return '+1' + number.replace(new RegExp(/(-)/g), "");
  }
}
