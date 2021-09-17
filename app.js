// import express
const express = require('express')
// import mongoose
const mongoose = require('mongoose') 
const app = express()
const port = 3000


// connect to mongoDB
mongoose.connect('mongodb://localhost/todo-list')

//aquire connection status
const db = mongoose.connection

//setting action for failure scenerio
db.on('error' , () => {
  console.log('mongodb error!')
}) 

//setting action for successful scenerio
db.once('open' , () => {
  console.log('mongodb connected!')
}) 

app.get( '/' , (req , res) => {
  res.send('This is an express server')
})

app.listen( 3000 , () => {
  console.log(`youre now listening http://localhost:${3000}`)
})

console.log(app)
console.log(mongoose)
