const mongoose = require('mongoose')
const Schema  = mongoose.Schema;


// this schema is used to logout with react so witht help of this Schema we can logout user . means we will backlist the token when user will come with the that is blacklisted we will say that the schema is not valid please try again .

// here we we play with headers 
let blacklistSchema = new Schema(
  {
    token:{
        type:String,
        required:true
    }
  } , {timestamps :true}
)

blacklistSchema.index({token:1} , {unique:true})

let Blacklist = mongoose.model('blacklist' , blacklistSchema)

module.exports = Blacklist