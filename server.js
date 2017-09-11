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
-- Create some random text message to include with gifs

*/

const config = require('./config');
const app = require('express')();
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const recipients = require('./lib/helpers').recipients;
const jsonfile = require('jsonfile')

const file = './recipients.json'


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', routes)

app.listen(config.port, () => {
    console.log(`Death.ly listening on ${config.port}.`);
})

/* Clean up in the event of server exiting/crashing */
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function exitHandler(options, err) {
    if (options.cleanup) {
        console.log(recipients.getRecipients());
        jsonfile.writeFileSync(file, recipients.getRecipients());
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}
