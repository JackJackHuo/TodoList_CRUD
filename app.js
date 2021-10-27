// import express
const express = require('express')
// impport express-handlebars
const exphbs = require('express-handlebars')
// import method-override
const methodOverride = require('method-override')
// import express-session
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')



// import express routes
//可以省略/index，因為require('資料夾')時，node會自動抓資料夾內名叫index的js檔(預設為index)
const routes = require('./routes/index') 
// import mongoose module
// 不用const變數接require，因為app.js中沒有需要用到config/mongoose.js裡面的物件
require('./config/mongoose')
// create express server
const app = express()
// 如果在 Heroku 環境則使用 process.env.PORT
// 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000


// setting template engine
app.engine('hbs' , exphbs({defaultLayout: 'main' , extname:'.hbs'}))
// setting server view engine
app.set('view engine', 'hbs')
// setting session params
app.use(session({
  secret:'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// setting body parser for post request
app.use(express.urlencoded({extended:true}))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
// 設定本地變數 res.locals
app.use((req , res , next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  next()
})
// setting routes
app.use(routes)

// setting listen port for server
// 設定應用程式監聽的埠號
app.listen(PORT , () => {
  console.log(`youre now listening http://localhost:${PORT}`)
})

