const mongoose = require('mongoose')
const Schema = mongoose.Schema
//create object from class Schema constuctor function
const todoSchema = new Schema({
  name:{
    type: String, 
    require: true
  }
})

module.exports = mongoose.model('Todo' , todoSchema)