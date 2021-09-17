const express = require('express')
const app = express()
const port = 3000

app.get( '/' , (req , res) => {
  res.send('This is an express server')
})

app.listen( 3000 , () => {
  console.log(`youre now listening http://localhost:${3000}`)
})
