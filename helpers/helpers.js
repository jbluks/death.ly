function killDeathGifs(id) {
    clearInterval(id);
}

function sendDeathGif(recipient, message, gif) {
    TWILIO_CLIENT.messages.create(
      {
        to: recipient.number,
        from: config.sendingNumber,
        body: `${message} ${recipient.name}.`,
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

export { killDeathGifs, sendDeathGif }
