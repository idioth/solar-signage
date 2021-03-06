//Preparing the application to start'

var om2mServer = "http://13.209.74.2:8080";

var om2mServer_BATTERY = om2mServer + "/~/in-cse/fcnt-858130858";
var om2mServer_GPS = om2mServer + "/~/in-cse/fcnt-69748236";
var om2mServer_AD = om2mServer + "/~/in-cse/fcnt-814260740";

var default_AD_URL = "https://www.youtube.com/embed/xLD8oWRmlAE";

var express = "";
var bodyParser = "";
var cors = "";

//Prepare For Logging

var logConfig = {
    appenders: {
        everything: { type: 'file', filename: './log/logging.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
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

//Socket.io
var io = "";

try {

    appConfig = require('./config/app_config.js');
    express = require('express');
    cors = require('cors');
    bodyParser = require('body-parser');

    io = require('socket.io')(19997);

    //PORT
    port = appConfig.port;


    requestHeader = {

        "Accept": "application/json",
        "X-M2M-RI": "dashboard",
        "X-M2M-Origin": "admin:admin",
        "Content-Type": "application/json;ty=28"

    };


    //Flag for running the application
    loadingApp = true;

} catch (e) {
    console.log("Application is failed to start. " + e);
    logger.error("Application is failed to start. " + e);
}



if (loadingApp) {

    const util = require('util');
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    var solarEntityName = ["current", "voltage", "power", "daily", "monthly", "annual", "total", "maxvolt", "minvolt"];
    var solarEventName = ["solarCurrent", "solarVoltage", "solarPower", "solarDaily", "solarMonthly", "solarAnnual", "solarTotal", "solarMaxvolt", "solarMinvolt"];

    var batteryEntityName = ["level", "current", "voltage", "power", "maxvolt", "minvolt", "temp"];
    var batteryEventName = ["battLevel", "battCurrent", "battVoltage", "battPower", "battMaxvolt", "battMinvolt", "battTemp"];

    var loadEntityName = ["current", "voltage", "power", "daily", "monthly", "annual", "total"];
    var loadEventName = ["loadCurrent", "loadVoltage", "loadPower", "loadDaily", "loadMonthly", "loadAnnual", "loadTotal"];

    // add device info
    var deviceInfoEntityName = ["name", "lat", "long", "starttime"];
    var deviceIfnoEventName = ["deviceName", "deviceLat", "deviceLong", "deviceStartTime"];
    // add device info

    var getRequestedData = {
        doWork: function(req, res, activityName, entityName, eventName, time, eventTime) {

            //var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['current'];

            //io.of(channelName).on('connection', function(socket){
            /*io.on('connection', function(socket){	
            	console.log("Send!");
            	socket.emit('incomingData', sentData);	
            });*/
            //	//{"m2m:sgn":{"m2m:vrq":true,"m2m:sud":false}
            var sampleCharging = req.body['m2m:sgn']['m2m:vrq'];


            if (sampleCharging == undefined) {
                //console.log("it should be void ---> "+req.body['m2m:sgn']['m2m:vrq']);


                for (i = 0; i < entityName.length; i++) {

                    var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt'][entityName[i]];
                    console.log("[" + time + "]Activity =" + activityName + "|| retrieved data = " + entityName[i] + " || " + sentData + " || Event Name = " + eventName[i]);
                    console.log("[" + sentData + "]");
                    io.sockets.emit(eventName[i], sentData);
                    logger.debug("Activity = " + activityName + "|| retrieved data = " + entityName[i] + " || " + sentData + " || Event Name = " + eventName[i]);
                    console.log("[" + time + "]Activity =" + activityName + "|| retrieved data = " + entityName[i] + " || " + sentData + " || Event Name = " + eventName[i]);
                }
                io.sockets.emit(eventTime, time);
            } else {
                console.log("[" + time + "]Connection Checking.");
                logger.debug("Connection Checking.");
            }



        }
    };

    var pushCommandToServer = {
        doWork: function(sentData, time) {

            const request = require("request");
            console.log("[" + time + "]Push to server, data --> " + sentData);
            logger.debug("Push to server, data --> " + sentData);


            var data = JSON.parse(sentData);
            request({
                    method: "PUT",
                    uri: om2mServer_BATTERY,
                    headers: requestHeader,
                    json: data
                },
                function(error, request, body) {
                    var status = request.statusCode;
                    //logger.debug(
                    console.log("[" + time + "]Error Here --> " + error + " || Status Code --> " + status + " || body -->" + body);
                    logger.debug("Error Here --> " + error + " || Status Code --> " + status + " || body --> " + body);

                });

        }
    };

    var getGPSDataFromServer = {
        doWork: function(time, res) {

            const request = require("request");
            console.log("[" + time + "]get to server");
            logger.debug("get to server");

            request({
                    method: "GET",
                    uri: om2mServer_GPS,
                    headers: requestHeader,
                },
                function(error, response, body) {
                    if (response != undefined && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        console.log("[getGPSLat] data", data);

                        var lat = data["m2m:fcnt"]["lat"];
                        var long = data["m2m:fcnt"]["long"];
                        var name = data["m2m:fcnt"]["name"];

                        var gps = { name: name, lat: lat, long: long };
                        res.send(gps);

                    }
                    console.log("[getGPSLat] error : " + error + "--> status code :" + response);
                });


        }
    };

    var getStartTimeDataFromServer = {
        doWork: function(time, res) {

            const request = require("request");
            console.log("[" + time + "]get to server");
            logger.debug("get to server");

            request({
                    method: "GET",
                    uri: om2mServer_GPS,
                    headers: requestHeader,
                },
                function(error, response, body) {
                    if (response != undefined && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        console.log("[getStartTime] data", data);

                        var starttime = data["m2m:fcnt"]["starttime"];
                        res.send(starttime);

                    }
                    console.log("[getStartTime] error : " + error + "--> status code :" + response);
                });


        }
    };

    var getAdDataFromServer = {
        doWork: function(time, res) {

            const request = require("request");
            console.log("[" + time + "]get to server");
            logger.debug("get to server");

            request({
                    method: "GET",
                    uri: om2mServer_AD,
                    headers: requestHeader,
                },
                function(error, response, body) {
                    //default ad url
                    var adUrl = default_AD_URL;
                    if (response != undefined && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        console.log("[getAdUrl] data", data);

                        adUrl = data["m2m:fcnt"]["adUrl"];
                    }
                    console.log("[getAdUrl] error : " + error + "--> status code :" + response);
                    res.send(adUrl);
                });


        }
    };

    app.post('/solar', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]Incoming Solar Data = " + JSON.stringify(req.body));
        logger.debug("Incoming Solar Data = " + JSON.stringify(req.body));

        sendSuccessfulResponse(res, time);

        var worker = getRequestedData;

        try {
            console.log("[" + time + "]Push Solar Data.");
            logger.debug("Push Solar Data.");
            worker.doWork(req, res, "Solar", solarEntityName, solarEventName, time, "solarTime");

        } catch (e) {
            console.log("[" + time + "]Failed to Retrieve and to Push Solar Data " + e);
            logger.debug("Failed to Retrieve and to Push Solar Data " + e);
        } finally {
            delete worker;

        }


    });

    app.post('/battery', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]Incoming Battery Data = " + JSON.stringify(req.body));
        logger.debug("Incoming Battery Data = " + JSON.stringify(req.body));

        sendSuccessfulResponse(res, time);

        var worker = getRequestedData;

        try {
            console.log("[" + time + "]Push Battery Data.");
            logger.debug("Push Battery Data.");

            var sampleCharging = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['charging'];
            var sampleDischarging = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['discharging'];
            var sampleConnectionChecking = req.body['m2m:sgn']['m2m:vrq'];
            //var sampleCharging = undefined;
            //var sampleDischarging = undefined;
            //var sampleConnectionChecking = undefined;

            if (sampleCharging == undefined) {
                if (sampleDischarging == undefined) {
                    if (sampleConnectionChecking == undefined) {
                        worker.doWork(req, res, "Battery", batteryEntityName, batteryEventName, time, "batteryTime");
                    } else {

                        console.log("[" + time + "]-------- Connection Checking [Ignore!!] -------- ");
                        logger.debug("-------- Connection Checking [Ignore!!] -------- ");
                    }

                } else {
                    console.log("[" + time + "]-------- Discharging Status [Ignore!!] -------- ");
                    logger.debug("-------- Discharging Status [Ignore!!] -------- ");
                }
            } else {
                console.log("[" + time + "]-------- Charging Status [Ignore!!] -------- ");
                logger.debug("-------- Charging Status [Ignore!!] -------- ");
            }

        } catch (e) {
            console.log("[" + time + "]Failed to Retrieve and to Push Battery Data " + e);
            logger.debug("Failed to Retrieve and to Push Battery Data " + e);
        } finally {
            delete worker;

        }

    });

    app.post('/load', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]Incoming Load Data = " + JSON.stringify(req.body));
        logger.debug("Incoming Load Data = " + JSON.stringify(req.body));

        sendSuccessfulResponse(res, time);

        var worker = getRequestedData;

        try {
            console.log("[" + time + "]Push Load Data.");
            logger.debug("Push Load Data.");
            worker.doWork(req, res, "Load", loadEntityName, loadEventName, time, "loadTime");

        } catch (e) {
            console.log("[" + time + "]Failed to Retrieve and to Push Load Data " + e);
            logger.debug("Failed to Retrieve and to Push Load Data " + e);
        } finally {
            delete worker;

        }

    });

    app.post('/charging', (req, res) => {
        var time = getTime();
        console.log("[" + time + "]Charging Command " + req.body['command']);
        logger.debug("Charging Command " + req.body['command']);

        sendSuccessfulResponse(res, time);

        var worker = pushCommandToServer;
        
        var sentData = '{ "m2m:fcnt" : { "charging" : 1 } }';

        if (req.body['command'] == "0") {
            sentData = '{ "m2m:fcnt" : { "charging" : 0 } }';
        }

        try {
            console.log("[" + time + "]Push Charging Command to Server.");
            logger.debug("Push Charging Command to Server.");

            worker.doWork(sentData, time);

        } catch (e) {
            console.log("[" + time + "]Failed Push Charging Command to Server " + e);
            logger.debug("Failed Push Charging Command to Server " + e);
        } finally {
            delete worker;

        }
        

    });

    app.post('/discharging', (req, res) => {
        var time = getTime();
        console.log("[" + time + "]Discharging Command " + req.body['command']);
        logger.debug("Discharging Command " + req.body['command']);


        sendSuccessfulResponse(res, time);

        var worker = pushCommandToServer;
        var sentData = '{ "m2m:fcnt" : { "discharging" : 1 } }';

        if (req.body['command'] == "0") {
            sentData = '{ "m2m:fcnt" : { "discharging" : 0 } }';
        }

        try {
            console.log("[" + time + "]Push Discharging Command to Server.");
            logger.debug("Push Discharging Command to Server.");
            worker.doWork(sentData, time);

        } catch (e) {
            console.log("[" + time + "]Failed Push Discharging Command to Server " + e);
            logger.debug("Failed Push Discharging Command to Server " + e);
        } finally {
            delete worker;

        }

    });

    // add device info
    app.post('/deviceinfo', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]Incoming Device Data = " + JSON.stringify(req.body));
        logger.debug("Incoming Device Data = " + JSON.stringify(req.body));

        sendSuccessfulResponse(res, time);

        var worker = getRequestedData;

        try {
            console.log("[" + time + "]Push Device Data.");
            logger.debug("Push Device Data.");
            worker.doWork(req, res, "Device", deviceInfoEntityName, deviceIfnoEventName, time, "loadTime");

        } catch (e) {
            console.log("[" + time + "]Failed to Retrieve and to Push Device Data " + e);
            logger.debug("Failed to Retrieve and to Push Device Data " + e);
        } finally {
            delete worker;

        }

    });
    // add device info

    app.get('/gps', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]gps Command " + req.body['command']);

        //sendSuccessfulResponse(res, time);

        var worker = getGPSDataFromServer;

        try {
            console.log("[" + time + "]gps Command");
            worker.doWork(time, res);

        } catch (e) {
            console.log("[" + time + "]gps Command" + e);
        } finally {
            delete worker;

        }
    });

    app.get('/starttime', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]starttime Command " + req.body['command']);

        //sendSuccessfulResponse(res, time);

        var worker = getStartTimeDataFromServer;

        try {
            console.log("[" + time + "]starttime Command");
            worker.doWork(time, res);

        } catch (e) {
            console.log("[" + time + "]starttime Command" + e);
        } finally {
            delete worker;

        }
    });

    app.get('/ad', (req, res) => {

        var time = getTime();
        console.log("[" + time + "]ad Command " + req.body['command']);

        //sendSuccessfulResponse(res, time);

        var worker = getAdDataFromServer;

        try {
            console.log("[" + time + "]Ad Command");
            worker.doWork(time, res);

        } catch (e) {
            console.log("[" + time + "]Ad Command" + e);
        } finally {
            delete worker;

        }
    });




    function getTime() {

        var moment = require('moment');
        require('moment-timezone');
        moment.tz.setDefault("Asia/Seoul");
        var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(dateTime);

        //var today = new Date();
        //var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
        //var dateTime = date + ' ' + time;

        return dateTime;

    }

    function sendSuccessfulResponse(res, time) {
        console.log("[" + time + "]Return Successful Response");
        logger.debug("Return Successful Response");
        res = setReponseHeader(res);
        res.statusCode = 200;
        res.send("Successful");
    }

    function setReponseHeader(res) {

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        return res;

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

    app.listen(port, () => console.log('This app is listening on port 19998! and with POST listening and web socket is on port 19997!'));

}
