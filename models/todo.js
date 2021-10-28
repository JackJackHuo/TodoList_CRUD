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
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true, //將userId設成索引條件，使用索引來查詢資料能夠增加讀取效能
    required: true
  }
})

module.exports = mongoose.model('Todo' , todoSchema)