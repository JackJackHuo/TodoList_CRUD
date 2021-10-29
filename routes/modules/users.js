const express = require('express')
const router = express.Router()
const User = require('../../models/user')
// 引用 passport
const passport = require('passport')
// 載入bcrypt套件
const bcrypt = require('bcryptjs')  


// USERS GET
// user login page
router.get('/login' , (req , res) => {
  const [error] = req.flash('error')
  res.render('login' , {error})
})
// user register page
router.get('/register' , (req , res) => {
  res.render('register')
})
// user logout
router.get('/logout' , (req, res) => {
  console.log(req)
  // req.logout() 是 Passport.js 提供的函式，用來清除 session
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})


// USERS POST
// 用 Passport 提供的 authenticate 方法執行認證
router.post('/login' , passport.authenticate('local' , {
  successRedirect:'/',
  failureRedirect:'/users/login',
  failureFlash: true
}))
// register user 
router.post('/register' , (req , res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword){
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if(errors.length){
    return res.render('register' , {
      errors,
      name, 
      email, 
      password, 
      confirmPassword
    })
  }
  User.findOne({email})
      .then(user => {
        if(user){
          errors.push({ message: '這個 Email 已經註冊過了。' })
          res.render('register', { //前面若加return，下面可以不必寫else(會直接跳出並執行res.render)
            name,
            email,
            password,
            confirmPassword
          })
        }else{
          return bcrypt
          .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
          .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
          .then( hash => {
            // method 1
            return User.create({
              name,
              email,
              password: hash // 用雜湊值取代原本的使用者密碼
            })
          })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
          // method 2
          // const newUser = new User({
          //   name,
          //   email,
          //   password : hash
          // })
          // newUser.save()
          // .then(() => res.redirect('/'))
          // .catch( err => console.log(err))
          
          
        }
      })
})

module.exports = router