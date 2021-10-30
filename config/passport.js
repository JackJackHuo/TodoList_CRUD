// import passport
const passport = require('passport')
// import passport-local
const passportLocal = require('passport-local')
// 從passport-local取出 strategy 建構子
const LocalStrategy = passportLocal.Strategy
// 引用 Facebook 登入策略
const FacebookStrategy = require('passport-facebook').Strategy
// import user model
const User = require('../models/user')
// 載入bcrypt套件
const bcrypt = require('bcryptjs')

module.exports = app => {

  // Initialize 初始化 Passport 模組
  app.use(passport.initialize()) // 初始化Passport模組 (利用middleware掛載Passport)
  app.use(passport.session()) // 將passport session交給app session使用(express-session)

  // Strategy 設定本地登入策略
  //new LocalStrategy(config , callback())
  passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true // request object is now first argument of callback function if set true
  }, 
  (req , email , password , done) => {
    User.findOne({email})
        .then( user => {
          if(!user){
            return done(null ,false, {message: 'Email not registered'})
          }
          //user.password為hash形式，透過bcrypt.compare解碼並跟使用者傳入req的password做比對
          return bcrypt.compare( password , user.password) 
                       .then(isMatch => {
                          if(!isMatch){
                            return done(null, false, { message: 'Email or Password incorrect' })
                          }
                          return done(null , user)
                        })
        })
        .catch( err => done(err , false))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,//Fackbook for developer中取得「應用程式編號」
    clientSecret: process.env.FACEBOOK_SECRET, //Fackbook for developer中取得「應用程式密鑰」
    callbackURL: process.env.FACEBOOK_CALLBACK, //在用戶端 OAuth 設定的重新導向 URI
    profileFields: ['email', 'displayName'] //設定跟Facebook 要求開放的資料
    // mail：這是必要的，需要拿回來當成帳號
    // displayName：Facebook 上的公開名稱，也許能和 User 的 name 屬性對應起來
  },
    // facebook將資料回傳到profile
    function (accessToken, refreshToken, profile, done) {
      const { email , name } = profile._json
      User.findOne({email})
          .then(user => {
            // 假如facebook用戶已經有註冊過的todolist user, 則直接將user往外拋
            if (user) return done(null, user)
            // 假如facebook用戶沒有註冊過的todolist user, 則直接產生隨機密碼並註冊帳號
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword , salt ))
            .then(hash => User.create({
              name,
              email,
              password: hash
              }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
      })    
    }
  ));

  //Serialize and De-serialize User 設定序列化與反序列化
  // 從資料庫找到完整的user物件，把user id存入session
  passport.serializeUser((user , done) => {
    done(null , user._id)
  })
  // 根據session裡的user id，從資料庫查找完整user物件
  passport.deserializeUser((id , done) => {
    User.findById(id)
        .lean()
        .then(user => done(null , user))
        .catch(err => done(err , null))
  })
}
