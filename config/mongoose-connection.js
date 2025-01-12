const mongoose = require('mongoose')

async function dbconnection(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/eCommerce")
        .then(()=>{
            console.log("connected to db")
        })
    } catch (error) {
         console.log(error.message)
    }
}

module.exports = dbconnection