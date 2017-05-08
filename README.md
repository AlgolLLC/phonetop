# What is this?
phonetop is a revolutionary new way for you to run up your Twilio bill. It's also a resource monitor for servers that sends notifications to you when resource usage exceeds certain thresholds.

If you enjoy using phonetop, please check us out on [github](https://github.com/Longlius/phonetop) or follow me on [twitter](https://twitter.com/Longlius).

# How do I use it?

Download the zipped release or clone the repo where you want to run phonetop from. Then run:

```$ npm install```

Once all the dependencies are installed, edit phonetopconfig.json to set the various thresholds and messages. Be sure to include a to and from number associated with your twilio account to send messages to and from.

Twilio credentials are passed through environment variables, so before running for the first time, export your twilio SID and auth token using:

```$ export TWILIO_ACCOUNT_SID=<twilio SID here>```

and

```$ export TWILIO_AUTH_TOKEN=<twilio auth token here>```

These values can be found on your twilio account dashboard.

Once everything is set, run the program:

```$ node phonetop.js```
