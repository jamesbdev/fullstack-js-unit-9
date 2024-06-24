//import express
const express = require('express');
//create router instance
const router = express.Router();
//import body-parser 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//import authentication middleware
const { authenticateUser } = require("../middleware/auth-user");

//get all courses
router.get("/api/courses", async(req, res) => {
    try {
      const courses = await Course.findAll();
      res.json(courses).status(200);
    } catch (error) {
      console.error("Sorry, there was an error when retrieving courses", error);
    }
  })
  
  //get specific course
  router.get("/api/courses/:id", async(req, res) => {
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
  router.post("/api/courses", authenticateUser, jsonParser, async(req, res) => {
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
  router.put("/api/courses/:id", authenticateUser, jsonParser, async (req, res) => {
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
  router.delete("/api/courses/:id", authenticateUser, jsonParser, async (req, res) => {
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
  });

  
  module.exports = router;
  