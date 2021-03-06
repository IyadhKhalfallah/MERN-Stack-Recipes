#!/usr/bin/env node
require('babel-register');
require('dotenv').config();

// Dependencies
const http = require('http');
const App = require('../server');
const mongoose = require('mongoose');
const util = require('util');
const morgan = require('morgan');
const config = require('../config');



// connect to mongoose
let mongoUri = undefined;
mongoUri = require('../config/keys').mongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  useMongoClient: true
}).then(
  () => {
    util.log(`Connected to Mongo on ${mongoUri}`)
  },
  (err) => {
    util.log(err);
    throw err;
  }
);

/* Logic to start the application */
const app = App(config);
const port = process.env.PORT || '8080';
app.set('port', port);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ?
    `Pipe ${port}` :
    `Port  ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      util.log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      util.log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}



function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    `pipe ${addr}` :
    `port ${addr.port}`;

  util.log(`App listening on ${bind}`);
}

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);