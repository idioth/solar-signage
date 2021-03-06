//Preparing the application to start'

var express = "";
var bodyParser = "";
var cors = "";

//Prepare For Logging

var logConfig = {
	appenders: {
		everything: { type: 'file', filename: './log/logging.log' }
	  },
	  categories: {
		default: { appenders: [ 'everything' ], level: 'debug' }
	  }
};
var log = require('log4js').configure(logConfig);
const logger = log.getLogger();


//Load Configuration File
var appConfig = "";
var loadingApp = false;

var port = "";
var requestHeader = "";
var diURL = [];
var pgURL = [];
var conURL = [];
var battURL = [];
var warnURL = "";

//MQTT
var mqtt = "";
var clientMqtt = "";
var mqttURL = 'tcp://localhost:1883';
var mqttTopic = "solarSignage/solardata/power";

//Socket.io
var io = "";

try{

	appConfig = require('./config/app_config.js');
	express = require('express');
	cors = require('cors');
	bodyParser = require('body-parser');
	
	io = require('socket.io')(19997);

	//PORT
	port = appConfig.port;

	//MQTT
	mqtt = require ('mqtt');
	clientMqtt  = mqtt.connect(mqttURL);

	if(clientMqtt == false){
		console.log(" ----- Failed to Connect to Mosquitto Broker");
	}else{
		console.log(" ----- Successfully Connected to Mosquitto Broker");
	}
	
	/*try{
		clientMqtt.subscribe(mqttTopic, function (err) {
			if(!err){
				console.log("----- Successfully subcscribed to "+mqttTopic);
			}
		});	
	}catch(e){
		console.log("----- Failed subcscribed to "+mqttTopic);
	}*/
	

	requestHeader = {
		
			"Accept" : "application/json",
			"X-M2M-RI" : "dashboard",
			"X-M2M-Origin" : "admin:admin",
			"Content-Type" : "application/json;ty=28"
		
	};
	
	//Flag for running the application
	loadingApp = true;

}catch(e){
	console.log("Application is failed to start. "+e);
	logger.error("Application is failed to start. "+e);
}



if(loadingApp){

		const util = require('util');
		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		app.use(cors());

		var solarEntityName = ["current", "voltage","power", "daily", "monthly", "annual", "total"];
		var solarEventName = ["solarCurrent", "solarVoltage","solarPower", "solarDaily", "solarMonthly", "solarAnnual", "solarTotal"];
		/*var solarSubscribedTopic = ["solarSignage/solardata/current", "solarSignage/solardata/voltage",
									"solarSignage/solardata/power", "solarSignage/solardata/daily", 
									"solarSignage/solardata/monthly", "solarSignage/solardata/annual", "solarSignage/solardata/total"];*/
		var solarTopicPattern = "solarSignage/solardata/";

		var batteryEntityName = ["level", "current","voltage", "power"];
		var batteryEventName = ["battLevel", "battCurrent","battVoltage","battPower"];
		var batteryTopicPattern = "solarSignage/batterydata/";

		var loadEntityName = ["current", "voltage","power", "daily", "monthly", "annual", "total"];
		var loadEventName = ["loadCurrent", "loadVoltage","loadPower", "loadDaily", "loadMonthly", "loadAnnual", "loadTotal"];
		var loadTopicPattern = "solarSignage/loaddata/";

		var getRequestedDataWithoutMQTT = {
				doWork : function (req, res, activityName, entityName, eventName, time, eventTime)	{
				
				//var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['current'];
				
				//io.of(channelName).on('connection', function(socket){
				/*io.on('connection', function(socket){	
					console.log("Send!");
					socket.emit('incomingData', sentData);	
				});*/
				//	//{"m2m:sgn":{"m2m:vrq":true,"m2m:sud":false}
				var sampleCharging = req.body['m2m:sgn']['m2m:vrq'];
				
				
				if(sampleCharging == undefined){
					//console.log("it should be void ---> "+req.body['m2m:sgn']['m2m:vrq']);

					
					for(i=0; i<entityName.length; i++){

						var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt'][entityName[i]];
						io.sockets.emit(eventName[i], sentData);
						logger.debug("Activity = "+activityName + "|| retrieved data = "+entityName[i]+" || "+sentData+" || Event Name = "+eventName[i]);
						console.log("["+time+"]Activity ="+activityName + "|| retrieved data = "+entityName[i]+" || "+sentData+" || Event Name = "+eventName[i]);
					}
					io.sockets.emit(eventTime, time);
				}
				else{
					console.log("["+time+"]Connection Checking.");
					logger.debug("Connection Checking.");
				}

				
				
			}
		};
		
		var getRequestedData = {
			
			doWork : function (req, res, activityName, entityName, eventName, time, eventTime, subcribeTopicPattern)	{
			
			var sampleCharging = req.body['m2m:sgn']['m2m:vrq'];
			
			
			if(sampleCharging == undefined){
				
				for(i=0; i<entityName.length; i++){

					
					var sentData = "";
					sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt'][entityName[i]];
					//sentData = getDataFromJSON(req, entityName, i);
					
					try{
						//Push socket to web
						//Push Message to MQTT Broker
						io.sockets.emit(eventName[i], sentData);
						clientMqtt.publish(subcribeTopicPattern+entityName[i], sentData);
							
					}
					catch(e){
						console.log("Failed to publish MQTT Message "+e);
					}

					logger.debug("Activity = "+activityName + "|| retrieved data = "+entityName[i]+" || "+sentData+" || Event Name = "+eventName[i]);
					console.log("["+time+"]Activity ="+activityName + "|| retrieved data = "+entityName[i]+" || "+sentData+" || Event Name = "+eventName[i]);
				}
				io.sockets.emit(eventTime, time);
			}
			else{
				console.log("["+time+"]Connection Checking.");
				logger.debug("Connection Checking.");
			}

			
			
		}
	};

		var pushCommandToServer = {
			doWork : function (sentData, time)	{
				
				const request = require("request");
				console.log("["+time+"]Push to server, data --> "+sentData);
				logger.debug("Push to server, data --> "+sentData);
				
		
					var data = JSON.parse(sentData);
					request({
						method: "PUT",
						uri: 'http://192.168.0.21:8080/~/in-cse/fcnt-548319540',
						headers: requestHeader,
						json: data
					},
					function(error, request, body){
						var status = request.statusCode;
						//logger.debug(
						console.log("["+time+"]Error Here --> "+error+" || Status Code --> "+status+" || body -->"+body);
						logger.debug("Error Here --> "+error+" || Status Code --> "+status+" || body --> "+body);
						
					 });
			
			}
		};

		app.post('/solar', (req, res) => {

			var time = getTime();
			console.log("["+time+"]Incoming Solar Data = "+JSON.stringify(req.body));
			logger.debug("Incoming Solar Data = "+JSON.stringify(req.body));

			//subcribeMqtt();

			sendSuccessfulResponse(res, time);

				var worker = getRequestedData;
				
				try{
					console.log("["+time+"]Push Solar Data.");
					logger.debug("Push Solar Data.");
					worker.doWork(req, res, "Solar", solarEntityName, solarEventName, time, "solarTime", solarTopicPattern);
				
				}catch(e){
					console.log("["+time+"]Failed to Retrieve and to Push Solar Data " +e);
					logger.debug("Failed to Retrieve and to Push Solar Data " +e);
				}
				finally{
					delete worker;
					
				}
				
			
		});
		
		app.post('/battery', (req, res) => {

			var time = getTime();
			console.log("["+time+"]Incoming Battery Data = "+JSON.stringify(req.body));
			logger.debug("Incoming Battery Data = "+JSON.stringify(req.body));

			sendSuccessfulResponse(res, time);

			var worker = getRequestedData;
			
			try{
				console.log("["+time+"]Push Battery Data.");
				logger.debug("Push Battery Data.");
				
				var sampleCharging = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['charging'];
				var sampleDischarging = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['discharging'];
				var sampleConnectionChecking = 	req.body['m2m:sgn']['m2m:vrq'];

				
				if(sampleCharging == undefined){
					if(sampleDischarging == undefined){
						if(sampleConnectionChecking == undefined){
							//worker.doWork(req, res, "Battery", batteryEntityName, batteryEventName, time, "batteryTime");
							//worker.doWork(req, res, "Battery", batteryEntityName, batteryEventName, time, "batteryTime");
							worker.doWork(req, res, "Battery", batteryEntityName, batteryEventName, time, "batteryTime", batteryTopicPattern);
						}
						else{
							
							console.log("["+time+"]-------- Connection Checking [Ignore!!] -------- ");
							logger.debug("-------- Connection Checking [Ignore!!] -------- ");
						}
						
					}
					
					else{
						console.log("["+time+"]-------- Discharging Status [Ignore!!] -------- ");
						logger.debug("-------- Discharging Status [Ignore!!] -------- ");
					}
				}
				else{
					console.log("["+time+"]-------- Charging Status [Ignore!!] -------- ");
					logger.debug("-------- Charging Status [Ignore!!] -------- ");
				}
				
			}catch(e){
				console.log("["+time+"]Failed to Retrieve and to Push Battery Data "+e);
				logger.debug("Failed to Retrieve and to Push Battery Data "+e);
			}
			finally{
				delete worker;
				
			}
		
		});

		app.post('/load', (req, res) => {
			
			var time = getTime();
			console.log("["+time+"]Incoming Load Data = "+JSON.stringify(req.body));
			logger.debug("Incoming Load Data = "+JSON.stringify(req.body));
			
			sendSuccessfulResponse(res, time);

			var worker = getRequestedData;
			
			try{
				console.log("["+time+"]Push Load Data.");
				logger.debug("Push Load Data.");
				//worker.doWork(req, res, "Load", loadEntityName, loadEventName, time, "loadTime");
				worker.doWork(req, res, "Load", loadEntityName, loadEventName, time, "loadTime", loadTopicPattern);
			
			}catch(e){
				console.log("["+time+"]Failed to Retrieve and to Push Load Data "+e);
				logger.debug("Failed to Retrieve and to Push Load Data "+e);
			}
			finally{
				delete worker;
				
			}
	
		});

		app.post('/charging', (req, res) => {
			var time = getTime();
			console.log("["+time+"]Charging Command "+ req.body['command']);
			logger.debug("Charging Command "+ req.body['command']);

			sendSuccessfulResponse(res, time);

			var worker = pushCommandToServer;
			var sentData = '{ "m2m:fcnt" : { "charging" : 1 } }';

			if(req.body['command']== "0"){
				sentData = '{ "m2m:fcnt" : { "charging" : 0 } }';	
			}
			
			try{
				console.log("["+time+"]Push Charging Command to Server.");
				logger.debug("Push Charging Command to Server.");

				worker.doWork(sentData, time);
			
			}catch(e){
				console.log("["+time+"]Failed Push Charging Command to Server "+e);
				logger.debug("Failed Push Charging Command to Server "+e);
			}
			finally{
				delete worker;
				
			}
	
		});

		app.post('/discharging', (req, res) => {
			var time = getTime();
			console.log("["+time+"]Discharging Command "+ req.body['command']);
			logger.debug("Discharging Command "+ req.body['command']);
			
			
			sendSuccessfulResponse(res, time);

			var worker = pushCommandToServer;
			var sentData = '{ "m2m:fcnt" : { "discharging" : 1 } }';

			if(req.body['command']== "0"){
				sentData = '{ "m2m:fcnt" : { "discharging" : 0 } }';	
			}
			
			try{
				console.log("["+time+"]Push Discharging Command to Server.");
				logger.debug("Push Discharging Command to Server.");
				worker.doWork(sentData, time);
			
			}catch(e){
				console.log("["+time+"]Failed Push Discharging Command to Server "+e);
				logger.debug("Failed Push Discharging Command to Server "+e);
			}
			finally{
				delete worker;
				
			}
	
		});

		function getTime(){

				
				var today = new Date();
				var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
				var dateTime = date+' '+time;
	  
				return dateTime;
			  
		}
		function sendSuccessfulResponse(res, time){
			console.log("["+time+"]Return Successful Response");
			logger.debug("Return Successful Response");
			res = setReponseHeader(res);
			res.statusCode = 200 ; 
			res.send("Successful");
		}

		function setReponseHeader(res){
			
			res.setHeader('Content-Type', 'application/json');
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			
			return res;
		
		}	

		function getDataFromJSON(req, entityName, i) {
			
			// Return new promise 
			return new Promise(function(resolve) {
				// Do async job
				resolve( req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt'][entityName[i]]);
				
			})
		
		}
			
		function getMobiusData(options) {
			const request = require("request");
			// Return new promise 
			return new Promise(function(resolve, reject) {
				// Do async job
				request.get(options, function(err, resp, body) {
					if (err) {
						reject(err);
					} else {
						resolve(JSON.parse(body));
					}
				})
			})
		
		}



		function subcribeMqttVersi1(){

			//var mqtt = require('mqtt');
			//var mqttURL = "mqtt://223.195.37.170:1883/monitor/";
			//var mqttURL = 'mqtt://localhost:1883';
			//var clientMqtt  = mqtt.connect('mqtt://localhost:1883');
			//var clientMqtt  = mqtt.connect('mqtt://test.mosquitto.org');
			//var clientMqtt  = mqtt.connect(mqttURL);
			
			console.log("------------ Sending MQTT ------------");
			console.log("Topic == "+mqttTopic);
			console.log("MQTT  == "+mqttURL);
			var dummyMessage = "Hello moto";
			
			try{
				console.log("Trying to publish message on a connection.");

				try{
	
					console.log("Trying to subscribe!!!");	
					clientMqtt.subscribe(mqttTopic, function (err) {
						
						if (!err) {
							console.log("Successfully Subcribe! mqtt url ="+mqttURL);
							try{
								clientMqtt.publish(mqttTopic, dummyMessage);
								
							}
							catch(e){
								console.log("Failed to publish "+e);
							}
						}else{
							console.log("Failed to subscribe");
						}


					});

				}catch(e){	
					console.log("Failed to subscribe --> "+e);
				}

			}catch(e){
				console.log("Failed to publish message on a connection. "+e);
			}
			
		}

		function subcribeMqtt(){

			
			console.log("------------ Sending MQTT ------------");
			console.log("Topic == "+mqttTopic);
			console.log("MQTT  == "+mqttURL);
			var dummyMessage = "Hello moto";
			

			try{
	
				console.log("Trying to subscribe!!!");	
				clientMqtt.subscribe(mqttTopic, function (err) {
						
				if (!err) {
					console.log("Successfully Subcribe! mqtt url ="+mqttTopic);
						try{
							clientMqtt.publish(mqttTopic, dummyMessage);
								
						}
						catch(e){
							console.log("Failed to publish "+e);
						}
				}else{
					console.log("Failed to subscribe");
				}


				});

				}catch(e){	
					console.log("Failed to subscribe --> "+e);
			}

		}

		app.listen(port, () => console.log('This app is listening on port 19998! and with POST listening and web socket is on port 19997!'));
		
}


