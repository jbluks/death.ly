const config = require('../config');
const router = require('express').Router()

/* Helper Functions */
const helpers = require('../lib/helpers');
const formatE164 = helpers.formatE164,
      scheduleDaily = helpers.scheduleDaily,
      recipients = helpers.recipients;

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
        status: stopped,
        frequency: 'daily',
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
    let number = formatE164(req.query.number);

    let recipient = recipients.getRecipients().find(recipient => {
        return recipient.number === number
    })

    if(recipient) {
        scheduleDaily(recipient);
        res.send('Scheduled Daily');
    } else {
        res.send(`${number} not found.`);
    }
})

router.get('/stop', (req, res) => {
    let number = req.query.number;

    let recipient = recipients.find(recipient => {
        return recipient.number === number
    })

    if(recipient) {
        //killDeathGifs(recipient.processId);
    }

    res.send('Death Gifs Killed.')
})

module.exports = router
