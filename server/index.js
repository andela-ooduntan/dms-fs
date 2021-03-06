(function() {
  'use strict';

  var env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    require('dotenv').load();
  }

  var express = require('express');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var apiRoutes = require('./routes');
  var app = express();
  var path = require('path');


  require('./config/initdb')();

  // configure middleware
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  app.use('/api', apiRoutes);

  app.use(express.static(path.join(process.env.PWD, '/public')));

  app.get('/*', function(req, res) {
    res.sendFile('index.html', {
      root: 'public/'
    });
  });

  app.use('/', function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status).json(err);
  });

  module.exports = app;

})();
