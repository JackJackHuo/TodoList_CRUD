// import mongoose
const mongoose = require('mongoose')
// 如果在 Heroku 環境則使用 process.env.MONGODB_URI
// MONGODB_URI已經在Heroku網站上setting/Config Vars設定好
// 否則為本地環境，使用 mongodb://localhost/todo-list
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/todo-list'

// connect to mongoDB
mongoose.connect(MONGODB_URI,  { useNewUrlParser: true, useUnifiedTopology: true })

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