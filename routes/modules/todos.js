// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 todo Model
const Todo = require('../../models/todo')


// render page for creating new data
router.get('/new', (req, res) => {
  res.render('new')
})

// render page detail specified by id
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => { res.render('detail', { todo: todo }) })
    .catch(error => console.log(error))
})

// render page for editing data specified by id
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo: todo }))
    .catch(error => console.log(error))
})

// create
router.post('/', (req, res) => {
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  // 方法一
  // const todo = new Todo({name}) // 從Todo產生一個實例
  // return todo.save() // 將實例存入資料庫
  //            .then(() => { res.redirect('/') })  // 新增完成後導回首頁
  //            .catch(error => console.log(error)) // 錯誤處理
  // 方法二
  return Todo.create({ name: name }) // 存入資料庫
    .then(() => { res.redirect('/') })  // 新增完成後導回首頁
    .catch(error => console.log(error)) // 錯誤處理
})

// edit
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body //解構賦值 
  return Todo.findById(id) // 用id查詢資料
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save() // 查詢成功後，修改後重新儲存資料
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router