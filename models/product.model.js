const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    image:[
        {
            type:Buffer
        }
    ],
        
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
} , {timestamps : true} );

const product = mongoose.model('product' , productSchema)

module.exports = product