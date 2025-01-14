const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const dbconnection = require('./config/mongoose-connection')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/products')
dbconnection()

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzgyNzE1MTg1ZDNmZjU4ODIwZDcwYzMiLCJpYXQiOjE3MzY2MDE5MzcsImV4cCI6MTczNjYwNTUzN30.PS2skxs6XQh43u9pwUl0w-EXAyr4a5oSOZyH41ZBnr4"

// sign token -->     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzgyNzE1MTg1ZDNmZjU4ODIwZDcwYzMiLCJpYXQiOjE3MzY2MDIwMDYsImV4cCI6MTczNjYwNTYwNn0.68on3MkgBCvYS9TFVLwBCbiGw-gN2ww4hxCdY8RqXxw"

// latest token     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzgzNjU3NThlNTlhN2FlMTQ5ZjFjYjkiLCJpYXQiOjE3MzY2NjQ0MzcsImV4cCI6MTczNjY2ODAzN30.IGYfTwHlB0lEOCNzKYIlJZfqKLuK3b3sI6vjgJRKOuQ"


require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/" , indexRouter)
app.use('/user' , userRouter )  
app.use('/product' , productRouter)

app.listen(4000 , (err)=>{
    if(err) return console.log(err.message)
        return console.log("connected to server by noman running good")
})