// import mongoose
const mongoose = require('mongoose')
// import todo model
const Todo = require('../todo')

// connect to mongoDB
mongoose.connect('mongodb://localhost/todo-list')

//aquire connection status
const db = mongoose.connection

//setting action for failure scenerio
db.on('error', () => {
  console.log('mongodb error!')
})

//setting action for successful scenerio
db.once('open', () => {
  console.log('mongodb connected!')
  // acynchronously create documents via Todo model object
  for( i = 0 ; i < 10 ; i++){
    Todo.create( {name : `name-${i}`})
  }
})