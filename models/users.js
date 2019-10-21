const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("users", UserSchema);



// avoid circular referencing
var Recipes = require('./recipes.js');
function removeRecipes (id, next) {
  // console.log('removing recipes');
  Recipes.removeAllforUser(id)
    .then(recipes => next())
    .catch(err => next(err));
}