'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const { User } = require("./models");
const { Course } = require("./models");

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db'
})

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//user routes
app.get("/api/users", async(req, res) => {
   try {
     const user = await User.findAll();
     res.status(202).json({user});
   } catch (error) {
      console.log("there was an issue returning the user", error);
   }
})

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// async IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log("connection to the database successful");
  } catch (error) {
    console.error('Error connecting to the database: ', error);

  }

})();