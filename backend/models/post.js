const mongoose = require('mongoose');
// first create blueprint for how data should look like

// use a javascript object for schema
const postSchema = mongoose.Schema({
  title: {type: String, required: true}, // in node js/javascript its capitalized String, but typescript is string lowercase
  content: {type: String, required: true},
  imagePath: {type: String, required: true },
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true}
});

// model needs to start with capital letter
module.exports = mongoose.model('Post', postSchema); // collection name is lowercase and plural: 'posts'
