'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//import authentication library
const auth = require('basic-auth');

//import password hashing library
const bcrypt = require('bcryptjs');
//import models
const { User } = require("./models");
const { Course } = require("./models");

const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db'
})

//add JSON parser 
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

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
     console.error("there was an issue returning the user", error);
  }

})

//create a new user
app.post("/api/users", jsonParser, async(req, res) => {
  try {
    //create user entry
    const user = await User.create(req.body);
    res.location("/").status(201);
    console.log("user created successfully", user);
  } catch (error) {
    console.error("sorry, there was an error when adding a user:", error);
    //send back error message to client
    res.status(400).json(error);
  }
});

//get all courses
app.get("/api/courses", async(req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses).status(200);
  } catch (error) {
    console.error("Sorry, there was an error when retrieving courses", error);
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
    console.error("Sorry there was an error when retrieving this course", error)
  }
})

//create a new course 
app.post("/api/courses", jsonParser, async(req, res) => {
  const newCourse = req.body; 
  try {
    //create course
    const course = await Course.create(newCourse);
    //set location to the created course
    //set status to 201
    res.location(`/api/courses/${course.id}`).status(201);
    //log success message
    console.log("course has been created", newCourse);
  } catch (error) {
    console.error("Sorry there was an error when creating the course: ", error);
    //send back error message
    res.status(400).send(error);
  }
})

//update course route
app.put("/api/courses/:id", jsonParser, async (req, res) => {
  //store course id from the params
  const courseId = req.params.id;
  //update course
  try {
   const course = await Course.update(req.body, {where: {
     id: courseId,
   }})
    //return 204 status code
    res.status(204);
    //add success message
    console.log("Course has been updated:", req.body);
  } catch (error) {
    console.error("Sorry, there was an error when updating a course: ", error);
    //send back error message
    res.status(400).send(error);
  }

})

//add delete route
app.delete("/api/courses/:id", jsonParser, async (req, res) => {
  //store id from params
  const courseId = req.params.id;
  try {
    //delete course
    const course = await Course.destroy({ where: 
      {
        id: courseId,
      }
    });
    //send success message
    res.status(204);
    console.log("course has been successfully deleted", courseId);
  } catch (error) {
    console.log("Sorry there was an error deleting the course:", error);
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
