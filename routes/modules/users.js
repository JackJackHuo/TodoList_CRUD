const express = require('express')
const router = express.Router()

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

})

module.exports = router