// import express
const express = require('express')
// import mongoose
const mongoose = require('mongoose') 
// impport express-handlebars
const exphbs = require('express-handlebars')
// import todo model
const Todo = require('./models/todo')
const app = express()
const port = 3000

// MODEL
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


// VIEW
// setting template engine
app.engine('hbs' , exphbs({defaultLayout: 'main' , extname:'.hbs'}))

// setting server view engine
app.set('view engine', 'hbs')

// setting routes
app.get( '/' , (req , res) => {
  Todo.find()
      .lean()
      .then(todos => res.render('index', {todos : todos}))
      .catch(error => console.log(error))
    })

// seting listen port for server
app.listen( 3000 , () => {
  console.log(`youre now listening http://localhost:${3000}`)
})

