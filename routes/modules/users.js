const express = require('express')
const router = express.Router()
const User = require('../../models/user')

// users get
router.get('/login' , (req , res) => {
  res.render('login')
})
router.get('/register' , (req , res) => {
  res.render('register')
})
// users post
router.post('/login' , (req , res) => {

})
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