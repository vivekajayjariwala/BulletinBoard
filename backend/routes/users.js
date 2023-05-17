const express = require("express"); // Import the express module
const bcrypt = require("bcrypt"); // Import the bcrypt module for password hashing
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken module for token generation

const User = require("../models/user"); // Import the User model

const router = express.Router(); // Create an instance of the express Router

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => { // Hash the password using bcrypt with a salt factor of 10
    const user = new User({
      email: req.body.email,
      password: hash // Store the hashed password in the user object
    });
    user
      .save() // Save the user object to the database
      .then(result => {
        res.status(201).json({
          message: "User created!", // Respond with a success message
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "invalid authentication credentials!" // Respond with an error message if saving the user fails
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }) // Find a user by the provided email
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed" // Respond with an authentication failure message if user is not found
        });
      }
      fetchedUser = user; // Store the fetched user object
      return bcrypt.compare(req.body.password, user.password); // Compare the provided password with the stored hashed password
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed" // Respond with an authentication failure message if password comparison fails
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, // Create a JWT payload with the user's email and ID
        "secret_this_should_be_longer", // Secret key used for signing the token (should be longer and more secure)
        { expiresIn: "1h" } // Set the token expiration time to 1 hour
      );
      res.status(200).json({
        token: token, // Respond with the generated token
        expiresIn: "3600", // duration in seconds until it expires
        userId: fetchedUser._id // Respond with the user ID
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "invalid authentication credentials!" // Respond with an error message if authentication fails
      });
    });
});

module.exports = router; // Export the router module for use in other files
