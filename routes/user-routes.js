const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { authenticateUser } = require("../middleware/auth-user");


//get info from authenticated user
router.get("/api/users", authenticateUser, async(req, res) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        username: user.username
    });

    try {
      //find currently authenticated user
      const user = await User.findAll();
  
      res.status(202).json({user});
    } catch(error) {
       console.error("there was an issue returning the user", error);
    }
  });
  
  //create a new user
  router.post("/api/users", jsonParser, async(req, res) => {
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

  module.exports = router;
  