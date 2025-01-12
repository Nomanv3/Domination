const mongoose = require('mongoose')

require('dotenv').config()

async function dbconnection(){
    try {
        await mongoose.connect(process.env.DB_CONNECT_URI)
        .then(()=>{
            console.log("connected to db")
        })
    } catch (error) {
         console.log(error.message)
    }
}

module.exports = dbconnection