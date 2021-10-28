// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 todo Model
const Todo = require('../../models/todo')


// view all data stored via Todo model
router.get('/', (req, res) => {
  const userId = req.user._id
  return Todo.find({ userId }) // 取出 Todo model 裡相對應登入者的的資料
             .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
             .sort({ name: 'asc' }) //在MongoDB將name屬性作正排序(acs)，反之(desc)
             .then(todos => res.render('index', { todos: todos })) // 將資料傳給 index 樣板
             .catch(error => console.log(error)) // 錯誤處理
})

// 匯出路由器
module.exports = router