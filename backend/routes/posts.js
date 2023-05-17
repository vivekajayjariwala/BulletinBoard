const express = require("express"); // Import the Express framework
const multer = require("multer"); // Import the multer middleware for handling file uploads

const Post = require("../models/post"); // Import the Post model
const checkAuth = require("../middleware/check-auth"); // Import the check-auth middleware for authentication

const router = express.Router(); // Create an instance of the Express Router

const MIME_TYPE_MAP = { // Define a map of MIME types and their corresponding file extensions
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({ // Define the storage configuration for multer
  destination: (req, file, cb) => { // Specify the destination folder for uploaded files
    const isValid = MIME_TYPE_MAP[file.mimetype]; // Check if the MIME type of the file is valid
    let error = new Error("Invalid mime type"); // Create an error message for invalid MIME types
    if (isValid) {
      error = null; // Set the error to null if the MIME type is valid
    }
    cb(error, "backend/images"); // Call the callback function with the error and destination folder
  },
  filename: (req, file, cb) => { // Specify the filename for uploaded files
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-"); // Generate a filename by replacing spaces with hyphens
    const ext = MIME_TYPE_MAP[file.mimetype]; // Get the file extension based on the MIME type
    cb(null, name + "-" + Date.now() + "." + ext); // Call the callback function with the generated filename
  }
});

router.post(
  "", // Handle the POST request for creating a new post
  checkAuth, // Use the check-auth middleware for authentication
  multer({ storage: storage }).single("image"), // Use multer middleware for handling the "image" field in the request
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host"); // Get the base URL of the server
    const post = new Post({ // Create a new Post object
      title: req.body.title, // Set the title field of the post
      content: req.body.content, // Set the content field of the post
      imagePath: url + "/images/" + req.file.filename, // Set the imagePath field of the post to the URL of the uploaded image
      creator: req.userData.userId // Set the creator field of the post to the user's ID obtained from authentication
    });
    post // Save the post to the database
      .save()
      .then(createdPost => {
        res.status(201).json({ // Send a success response with the created post
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({ // Send an error response if post creation fails
          message: "Post creation failed!"
        });
      });
  }
);

router.put(
  "/:id", // Handle the PUT request for updating an existing post
  checkAuth, // Use the check-auth middleware for authentication
  multer({ storage: storage }).single("image"), // Use multer middleware for handling the "image" field in the request
  (req, res, next) => {
    let imagePath = req.body.imagePath; // Get the current image path from the request body
    if (req.file) { // Check if a new image is uploaded
      const url = req.protocol + "://" + req.get("host"); // Get the base URL of the server
      imagePath = url + "/images/" + req.file.filename; // Update the image path with the new image filename
    }
    const post = new Post({ // Create a new Post object
      _id: req.body.id, // Set the ID of the post to be updated
      title: req.body.title, // Set the updated title field of the post
      content: req.body.content, // Set the updated content field of the post
      imagePath: imagePath, // Set the updated image path of the post
      creator: req.userData.userId // Set the creator ID of the post
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post) // Update the post with the specified ID and owned by the authenticated user
      .then(result => {
        if (result.modifiedCount > 0) { // Check if any post was modified
          res.status(200).json({ message: "update successful!" }); // Respond with success message
        } else {
          res.status(401).json({ message: "not authorized!" }); // Respond with authorization failure message
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "failed to update post!" // Respond with error message if update fails
        });
      });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id) // Find a post by the provided ID
    .then(post => {
      if (post) {
        res.status(200).json(post); // Respond with the found post
      } else {
        res.status(404).json({ message: "post not found!" }); // Respond with post not found message
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "failed to fetch post!" // Respond with error message if fetching post fails
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }) // Delete a post by the provided ID and owned by the authenticated user
    .then(result => {
      console.log(result);
      if (result.deletedCount > 0) { // Check if any post was deleted
        res.status(200).json({ message: "deletion successful!" }); // Respond with success message
      } else {
        res.status(401).json({ message: "not authorized!" }); // Respond with authorization failure message
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "post deletion failed!" // Respond with error message if deletion fails
      });
    });
});

module.exports = router; // Export the router module for use in other files
