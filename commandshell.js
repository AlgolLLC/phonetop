var exec = require('child_process').exec;
var os = require('os');

var CommandShell = class {
	constructor() {
		this.handlers = {
			"cpustatus": {
				"handler": function(cmdArr, res) {
					var numCPUs = os.cpus().length;
					var loadaverages = os.loadavg();
					var loadaverage_1 = ((loadaverages[0] / numCPUs) * 100).toFixed(1);
					var loadaverage_5 = ((loadaverages[1] / numCPUs) * 100).toFixed(1);
					var loadaverage_15 = ((loadaverages[2] / numCPUs) * 100).toFixed(1);
					// Catch bugs with calculations and lower precision for shorter text messages..
					loadaverage_1 = isFinite(loadaverage_1) ? loadaverage_1 : "ERR";
					loadaverage_5 = isFinite(loadaverage_5) ? loadaverage_5 : "ERR";
					loadaverage_15 = isFinite(loadaverage_15) ? loadaverage_15 : "ERR";
					var normalizedLoadAverages = {
						"1": loadaverage_1,
						"5": loadaverage_5,
						"15": loadaverage_15
					};
					var retMessage = 'CPU status report from ' + hostname + ': 1 minute avg - ' + normalizedLoadAverages['1'] + '%, 5 minute avg - ' + normalizedLoadAverages['5'] + '%, 15 minute avg - ' + normalizedLoadAverages['15'] + '%';
					twiMsg(retMessage, res);
				}
			},
			"memstatus": {
				"handler": function(cmdArr, res) {
					var freeBytes = monitor.os.freemem();
					var retMessage = 'Memory status report from ' + hostname + ': ' + freeBytes + ' bytes free of memory.';
					twiMsg(retMessage, res);
				}
			},
			"procstatus" {
				"handler": function(cmdArr, res) {
					exec.cmd('ps -eo comm,pid,pcpu,pmem', function(error, stdout, stderror) {
						if(error) {
							console.log('ERROR: ' + error);
							twiMsg('Could not get process list. Please contact your system administrator.', res);
						} else {
							twiMsg('Process listing for ' + hostname + ':\n' + stdout, res);
						}
					});
				}
			}
		};	
	}
	
	parseCommand(cmdstr) {
		var splitCmd = cmdstr.split(' ');
		if(splitCmd[0] in handlers) {
			return splitCmd;
		} else {
			return null;
		}
	}
	
	addHandler(cmd, func) {
		this.handlers[cmd]['handler'] = func;
	}
	
	remHandler(cmd) {
		delete this.handlers[cmd];
	}
	
	getHandlers() {
		return this.handlers;
	}
	
	static twiMsg(msg, res) {
		var twistr = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + msg + '</Message></Response>';
		res.send(twiStr);
	}
};
