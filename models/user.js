const mongoose = require("mongoose")
// import mongoose Schema 建構子
const Schema = mongoose.Schema
const userSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  createAt:{
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('User' , userSchema)