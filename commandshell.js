var exec = require('child_process').exec;
var os = require('os');
var express = require('express');

class CommandShell {
	constructor() {
		this.handlers = {
			"cpustatus": {
				"handler": function(cmdArr, callback) {
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
					var retMessage = 'CPU status report from ' + os.hostname() + ': 1 minute avg - ' + normalizedLoadAverages['1'] + '%, 5 minute avg - ' + normalizedLoadAverages['5'] + '%, 15 minute avg - ' + normalizedLoadAverages['15'] + '%';
					callback(retMessage);
				}
			},
			"memstatus": {
				"handler": function(cmdArr, callback) {
					var freeBytes = os.freemem();
					var retMessage = 'Memory status report from ' + os.hostname() + ': ' + freeBytes + ' bytes free of memory.';
					callback(retMessage);
				}
			},
			"procstatus": {
				"handler": function(cmdArr, callback) {
					exec('ps -eo comm,pid,pcpu,pmem', function(error, stdout, stderror) {
						if(error) {
							console.log('ERROR: ' + error);
							callback('Could not get process list. Please contact your system administrator.');
						} else {
							var retMessage = 'Process listing for ' + os.hostname() + ':\n' + stdout;
							callback(retMessage);
						}
					});
				}
			}
		};	
	}
	
	parseCommand(cmdstr, callback) {
		var splitCmd = cmdstr.split(' ');
		if(splitCmd[0] in this.handlers) {
			this.handlers[splitCmd[0]]['handler'](splitCmd.slice(1), callback);
		} else {
			callback('Command ' + splitCmd[0] + ' not supported.');
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
};

exports.CommandShell = CommandShell;
