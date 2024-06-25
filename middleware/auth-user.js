const express = require('express');
const auth = require("basic-auth");
//import user model
const { User } = require("../models/");

//import password hashing library
const bcrypt = require("bcryptjs");

//user authentication middleware
exports.authenticateUser = async (req, res, next) => {
  let message;

  //get crendentials from authorized header
  const credentials = auth(req);
  
  try {
   
    if (credentials) {
      //get user from database with same Email address
      const user = await User.findOne({
        where: { emailAddress: credentials.name },
      });
   
      if (user) {
        //compare password with stored password
        const authenticated = await bcrypt.compareSync(
          credentials.pass,
          user.password
        );
        if (authenticated) {
          console.log(
            `Authentication for username: ${user.firstName} ${user.lastName}`
          );

          //store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.firstName} ${user.lastName}`;
        }
      } else {
        message = `User not found for username:${user.firstName} ${user.lastName}`;
      }
    } else {
      message = `Auth header not found`;
    }
    //if user is not authenticated
    if (message) {
      console.warn(message);
      res.status(401).json({ message: "Access Denied" });
    } else {
      //user has been authenticated
      next();
    }
  } catch (error) {
    console.log("Sorry there was an issue when authenticating the user:", error);
    res.status(500);
  }
};
