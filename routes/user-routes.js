const express = require('express');
const router = express.Router();
//import bodyparse
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//import authentication middleware
const { authenticateUser } = require("../middleware/auth-user");
//import user model
const { User } = require("../models");
const auth = require("basic-auth");




//get info from authenticated user
router.get("/", authenticateUser, async(req, res) => {
    //how to get authenticated user info?
    try {
      console.log(req.currentUser);
      //find currently authenticated user
      const user = await User.findOne({
        where: {
            emailAddress: req.currentUser.emailAddress,
           
        }
    });
    console.log(user);
  
      res.status(202).json({user});
    } catch(error) {
       console.error("There was an issue returning the user.", error);
    }
  });
  
  //create a new user
  router.post("/", authenticateUser, jsonParser, async(req, res) => {
    try {
      //create user entry
      const user = await User.create(req.body);
      res.location("/").status(201);
      console.log("User created successfully.", user);
    } catch (error) {
      console.error("Sorry, there was an error when adding a user:", error);
      //send back error message to client
      res.status(400).json(error);
    }
  });

  module.exports = router;
  