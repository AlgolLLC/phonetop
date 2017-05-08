var fs = require('fs');
var monitor = require('os-monitor');
var Twilio = require('./node_modules/twilio/lib');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var token = process.env.TWILIO_AUTH_TOKEN;
var twilio = new Twilio(accountSid, token);

var messageSent = false;

var config = JSON.parse(fs.readFileSync('phonetopconfig.json', 'utf8'));

monitor.start({
    critical1: config.events.monitorconfig.critical1
});

monitor.on('loadavg1', function(event) {
    console.log(event.type, ' Load average is exceptionally high!!!');
    var from = process.env.FROM_NUMBER;
    var to = process.env.TO_NUMBER;

    if(!messageSent) {
	// Send message using callback
	twilio.messages.create({
	    from: from,
	    to: to,
	    body: config.events.critical1.message
	}, function(err, result) {
	    if(err){
		console.log("ERROR: " + JSON.stringify(err));
	    } else {
		console.log('Created message using callback');
		console.log(result.sid);
	    }
	});
	messageSent = true;
    }
});

