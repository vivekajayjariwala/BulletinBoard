const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create a schema for the User model
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // The email field is of type String, required, and must be unique
  password: { type: String, required: true } // The password field is of type String and required
});

// Apply the unique validator plugin to the userSchema
userSchema.plugin(uniqueValidator);

// Export the model with the name 'User'
module.exports = mongoose.model("User", userSchema);
