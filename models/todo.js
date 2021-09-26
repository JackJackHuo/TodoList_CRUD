const mongoose = require('mongoose')
const Schema = mongoose.Schema
//create object from class Schema constuctor function
const todoSchema = new Schema({
  name:{
    type: String, 
    required: true
  },
  isDone:{
  type: Boolean,
  default: false
  }
})

module.exports = mongoose.model('Todo' , todoSchema)