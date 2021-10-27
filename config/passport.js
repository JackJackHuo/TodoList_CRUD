// import passport
const passport = require('passport')
// import passport-local
const passportLocal = require('passport-local')
// 從passport-local取出 strategy 建構子
const LocalStrategy = passportLocal.Strategy
// import user model
const User = require('../models/user')

module.exports = app => {

  // Initialize 初始化 Passport 模組
  app.use(passport.initialize()) // 初始化Passport模組 (利用middleware掛載Passport)
  app.use(passport.session()) // 將passport session交給app session使用(express-session)

  // Strategy 設定本地登入策略
  passport.use(new LocalStrategy({usernameField:'email'} , (email , password , done) => {
    User.findOne({email})
        .then( user => {
          if(!user){
            return done(null ,false, {message: 'Email not registered'})
          }
          if(user.password !== password){
            return done(null , false, { message: 'Email or Password incorrect' })
          }
          return done(null , user)
        })
        .catch( err => done(err , false))
  }))

  //Serialize and De-serialize User 設定序列化與反序列化
  // 根據session裡的user id，從資料庫查找完整user物件
  passport.serializeUser((user , done) => {
    done(null , user.id)
  })
  // 從資料庫找到完整的user物件，把user id存入session
  passport.deserializeUser((id , done) => {
    User.findById(id)
        .lean()
        .then(user => done(null , user))
        .catch(err => done(err , null))
  })
}
