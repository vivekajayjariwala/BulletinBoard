const mongoose = require('mongoose');

// Create a blueprint for how the data should be structured
const postSchema = mongoose.Schema({
  title: { type: String, required: true }, // The title field is of type String and is required
  content: { type: String, required: true }, // The content field is of type String and is required
  imagePath: { type: String, required: true }, // The imagePath field is of type String and is required
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // The creator field is a reference to the User model and is required
});

// Export the model with the name 'Post'
module.exports = mongoose.model('Post', postSchema);
