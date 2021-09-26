// import mongoose from config and take db from module.export
const db = require('../../config/mongoose')
// import todo model
const Todo = require('../todo')


//setting action for successful scenerio
db.once('open', () => {
  console.log('mongodb connected!')
  // acynchronously create documents via Todo model object
  for( i = 0 ; i < 10 ; i++){
    Todo.create( {name : `name-${i}`})
  }
})