const express = require("express");
const appConfig = require("./config/appConfig")
const fs = require('fs');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const routeLoggerMiddleware = require('./App/middlewares/routeLogger');
const globalErrorMiddleware  = require('./App/middlewares/appErrorHandler');
const logger = require('./App/libs/loggerLib');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

const modelPath = './App/models';
const routePath = './App/routes';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
  });


  fs.readdirSync(modelPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelPath + '/' + file)
  });
// end Bootstrap models

// Bootstrap route
fs.readdirSync(routePath).forEach(function (file) {
    if (~file.indexOf('.js')) {
      let route = require(routePath + '/' + file);
      route.setRouter(app);
    }
  });

app.use(globalErrorMiddleware.globalNotFoundHandler)

  const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
      logger.captureError(error.code + 'not equal listen', 'serverOnErrorHandler', 10)
      throw error;
    }
  
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.captureError(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.captureError(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      default:
        logger.captureError(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
        throw error;
    }
  }

function onListening() {
  
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    ('Listening on ' + bind);
    logger.captureInfo('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
    mongoose.connect(appConfig.db.uri, {useNewUrlParser: true});
  }
  
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });
   
   mongoose.connection.on('error', function(err){
       console.log('database connection error');
       console.log(err)
   });
   
   mongoose.connection.on('open', function(err){
       if(err){
           console.log('database error');
           console.log(err);
       } else{
           console.log('database connection open success')
       }
   })