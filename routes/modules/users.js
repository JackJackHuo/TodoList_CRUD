const express = require('express')
const router = express.Router()
const User = require('../../models/user')
// 引用 passport
const passport = require('passport')

// USERS GET
// user login page
router.get('/login' , (req , res) => {
  res.render('login')
})
// user register page
router.get('/register' , (req , res) => {
  res.render('register')
})
// user logout
router.get('/logout' , (req, res) => {
  // req.logout() 是 Passport.js 提供的函式，用來清除 session
  req.logout()
  res.redirect('/users/login')
})


// USERS POST
// 用 Passport 提供的 authenticate 方法執行認證
router.post('/login' , passport.authenticate('local' , {
  successRedirect:'/',
  failureRedirect:'/users/login'
}))
// register user 
router.post('/register' , (req , res) => {
  const {name, email, password, confirmPassword} = req.body
  User.findOne({email})
      .then(user => {
        if(user){
          console.log('User already exists.')
          res.render('register', {
            name,
            email,
            password,
            confirmPassword
          })
        }else{
          // method 1
          return User.create({
            name,
            email,
            password
          })
              .then(() => res.redirect('/'))
              .catch( err => console.log(err))
          // method 2
          // const newUser = new User({
          //   name,
          //   email,
          //   password,
          //   confirmPassword
          // })
          // newUser.save()
          // .then(() => res.redirect('/'))
          // .catch( err => console.log(err))
        }
      })
})

module.exports = router