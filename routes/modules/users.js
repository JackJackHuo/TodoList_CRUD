const express = require('express')
const router = express.Router()
const User = require('../../models/user')
// 引用 passport
const passport = require('passport')

// users get
router.get('/login' , (req , res) => {
  res.render('login')
})
router.get('/register' , (req , res) => {
  res.render('register')
})
// users post
// 加入 middleware，驗證 request 登入狀態
router.post('/login' , passport.authenticate('local' , {
  successRedirect:'/',
  failureRedirect:'/users/login'
}))

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