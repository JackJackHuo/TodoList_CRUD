// import mongoose
const mongoose = require('mongoose')

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
})

module.exports = db