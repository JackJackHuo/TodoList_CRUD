if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// import mongoose from config and take db from module.export
const db = require('../../config/mongoose')
// import todo model
const Todo = require('../todo')
const User = require('../user')
const bcrypt = require('bcryptjs')

//建立一筆假的使用者資料
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

//setting action for successful scenerio
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    // 取得User.create完回傳的user
    .then(user => {
      const userId = user._id
      // // 此時for迴圈透過Todo.create這個mongoose API 10次，呼叫MongoDB建立10 筆資料，但是for迴圈跑完時，MongoDB還來不及在資料庫建立動作就跳到下一個then，並且被process.exit()關閉這段 Node 執行程序，導致新增資料失敗。此時可以利用promise.all語法，等到所有動作結束才能輸出結果。     
      // for (let i = 0; i < 10; i++) {
      //   Todo.create({ name: `name-${i}`, userId })
      // }
      return Promise.all(Array.from(
        { length: 10 }, //Array.from 第一個參數是類陣列（array-like）或是可迭代（iterable）物件
        (_, i) => Todo.create({ name: `name-${i}`, userId })//Array.from 第二個參數是array.map中的callback function
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})