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

//user routes
//get info from authenticated user
app.get("/api/users", async(req, res) => {
  try {
    //find currently authenticated user
    const user = await User.findAll();
    res.status(202).json({user});
  } catch(error) {
     console.log("there was an issue returning the user", error);
     res.json({error: error})
  }

})

//create a new user
app.post("/api/users", async(req, res) => {
  try {
    const user = await User.create(req.body);
    res.location("/").status(201);
  } catch (error) {
    console.log("sorry, there was an error when adding a user", error);
  }
});

//get all courses
app.get("/api/courses", async(req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses).status(200);
  } catch (error) {
    console.log("Sorry, there was an error when retrieving courses", error);
  }
})

//get specific course
app.get("/api/courses/:id", async(req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findAll({
      where: {
        id: courseId,
      }
    });
    res.json(course).status(200);
  } catch (error) {
    console.log("Sorry there was an error when retrieving this course", error)
  }
})


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







// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});



// async IIFE
//connect to database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("connection to the database successful");
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
