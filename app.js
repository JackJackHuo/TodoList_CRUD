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

// setting body parser for post request
app.use(express.urlencoded({extended:true}))

// setting routes
// view all data stored via Todo model
app.get( '/' , (req , res) => {
  return Todo.find() // 取出 Todo model 裡的所有資料
             .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
             .then(todos => res.render('index', { todos: todos })) // 將資料傳給 index 樣板
             .catch(error => console.log(error)) // 錯誤處理
})

// render page for creating  new data
app.get('/todos/new' , (req ,res) => {
  res.render('new')
})

// view data specified by id
app.get('/todos/:id' , (req , res) => {
  const id = req.params.id
  return Todo.findById(id)
             .lean()
             .then(todo => { res.render('detail' , {todo : todo})})
             .catch(error => console.log(error))
})

// edit data specified by id
app.get('/todos/:id/edit' , (req , res) => {
  const id = req.params.id
  return Todo.findById(id)
             .lean()
             .then(todo =>  res.render('edit' , {todo : todo}))
             .catch(error => console.log(error))
})

// create
app.post('/todos' , (req ,res) => {
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  // 方法一
  // const todo = new Todo({name}) // 從Todo產生一個實例
  // return todo.save() // 將實例存入資料庫
  //            .then(() => { res.redirect('/') })  // 新增完成後導回首頁
  //            .catch(error => console.log(error)) // 錯誤處理
  // 方法二
  return Todo.create({ name: name}) // 存入資料庫
             .then(() => { res.redirect('/') })  // 新增完成後導回首頁
             .catch(error => console.log(error)) // 錯誤處理
})

// edit
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id) // 用id查詢資料
    .then(todo => {
      todo.name = name
      return todo.save() // 查詢成功後，修改後重新儲存資料
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// delete
app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// setting listen port for server
app.listen( 3000 , () => {
  console.log(`youre now listening http://localhost:${3000}`)
})

