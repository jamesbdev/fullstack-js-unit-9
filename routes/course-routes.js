//import express
const express = require("express");
//create router instance
const router = express.Router();
//import body-parser
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
//import authentication middleware
const { authenticateUser } = require("../middleware/auth-user");
const { Course } = require("../models");
const { User } = require("../models");

//get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    });

    res.json(courses).status(200);
  } catch (error) {
    console.error("Sorry, there was an error when retrieving courses", error);
  }
});

//get specific course
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findAll({
      where: {
        id: courseId,
      },
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    });
    res.json(course).status(200);
  } catch (error) {
    console.error(
      "Sorry there was an error when retrieving this course",
      error
    );
  }
});

//create a new course
router.post("/", authenticateUser, jsonParser, async (req, res) => {
  const newCourse = req.body;
  try {
    //create course
    const course = await Course.create(newCourse);
    //set location to the created course
    //set status to 201
    res.location(`/courses/${course.id}`).status(201).end();
    //log success message
    console.log("course has been created", { newCourse });
  } catch (error) {
    //store error messages in array
    const errors = error.errors.map(err => err.message);
    console.error("Sorry there was an error when creating the course: ", { errors });
    //send back error message
    res.status(400).send({ errors });
  }
});

//UPDATE course route
router.put("/:id", authenticateUser, jsonParser, async (req, res) => {
  //store course id from the params
  const courseId = req.params.id;
  //update course with same ID as params
  try {
    //get course with id in the params
    const course = await Course.findByPk(Number(courseId));

    //check if course exists
    if (course === null) {
      return res.status(404).send({ "message": "course not found" });
    }

    //check if authenticated user is owner of the course
    const userId = req.currentUser.id;
    const foreignKey = course.userId;
    if (userId !== foreignKey) {
      return res.status(403).send({ "message": "Access denied" });
    }
    //update course
    await course.update(req.body);
    //send 204 status code
    res.status(204).end();
  } catch (error) {
    //store error messages 
    const errors = error.errors.map(err => err.message);
    console.error(
      "Sorry, there was an error when updating a course: ",
      { errors }
    );
    //send back error message
    res.status(400).send({ errors });
  }
});

// DELETE course route
router.delete("/:id", authenticateUser, jsonParser, async (req, res) => {
  //store id from params
  const courseId = req.params.id;
  try {
    //find course with ID from the params
    const course = await Course.findByPk(Number(courseId));
    //check if course exists
    if (course === null) {
      console.log("course not found");
      //send message to client
      return res.send({"message": "Course doesn't exist"});
    } 
    //check if logged user is owner of course
    const foreignKey = course.userId;
    const currentUser = req.currentUser.id;
    if (currentUser !== foreignKey) {
      return res.status(403).send({"message": "Access denied"});
    } 
    //delete course
    await course.destroy();
    //send success message
    res.status(204).send({"message": "Course has been deleted"});
  } catch (error) {
    console.log("Sorry there was an error deleting the course:", error);
    res.status(500).json({error});
  }
});

module.exports = router;
