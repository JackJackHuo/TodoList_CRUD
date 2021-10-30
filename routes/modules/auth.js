// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 passport
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'] //向 Facebook 要求的資料
}))

// facebook提供使用者是否同意按鈕的redirect路由
// 功能相當於本地認證的 POST /users/login 路由
// 如果能用傳回來的資料順利登入，就放 request 進場，如果登入失敗，就再導向登入頁
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// 匯出路由器
module.exports = router