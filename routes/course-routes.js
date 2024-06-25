//import express
const express = require('express');
//create router instance
const router = express.Router();
//import body-parser 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//import authentication middleware
const { authenticateUser } = require("../middleware/auth-user");
const { Course } = require("../models");

//get all courses
router.get("/", async(req, res) => {
    try {
      const courses = await Course.findAll({
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
      });
      res.json(courses).status(200);
    } catch (error) {
      console.error("Sorry, there was an error when retrieving courses", error);
    }
  })
  
  //get specific course
  router.get("/:id", async(req, res) => {
    const courseId = req.params.id;
    try {
      const course = await Course.findAll({
        where: {
          id: courseId,
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
      });
      res.json(course).status(200);
    } catch (error) {
      console.error("Sorry there was an error when retrieving this course", error)
    }
  })
  
  //create a new course 
  router.post("/", authenticateUser, jsonParser, async(req, res) => {
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
  
  //UPDATE course route
  router.put("/:id", authenticateUser, jsonParser, async (req, res) => {
    //store course id from the params
    const courseId = req.params.id;
    //update course with same ID as params
    try {
     const course = await Course.update(req.body, {where: {
       id: courseId,
     }})
     //check if authenticated user is owner of this course
     //get id of authenticated user
     //check with course foreign key userId
     const foreignKey = req.body.userId;
     const userId = req.currentUser.id;
  
     if(userId !== foreignKey) {
       res.status(403).send(`unauthorized: your id: ${userId}, course user id: ${foreignKey}`);
     } else {
      //return 204 status code
      res.status(204).send("Course has been updated");
      //add success message
      console.log("Course has been updated:", req.body);
     }
    } catch (error) {
      console.error("Sorry, there was an error when updating a course: ", error);
      //send back error message
      res.status(400).send(error);
    }
  
  })
  
  // DELETE course route
  router.delete("/:id", authenticateUser, jsonParser, async (req, res) => {
    //store id from params
    const courseId = req.params.id;
    try {
      //delete course
      const course = await Course.destroy({ where: 
        {
          id: courseId,
        }
      });
      
      const userId = req.currentUser.id;
      const foreignKey = req.body.userId;
      //check if logged user is owner of course
      if (userId !== foreignKey) {
        res.status(403).send(`Authorisation denied.`);
      } else {
        //send success message
        res.status(204).send("Course has been deleted");
        console.log("course has been successfully deleted", courseId);
      }
    
    } catch (error) {
      console.log("Sorry there was an error deleting the course:", error);
    }
  });

  
  module.exports = router;
  