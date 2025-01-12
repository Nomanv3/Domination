const UserModel = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')

module.exports.isAuthenticated = async (req,res,next)=>{
    try {
         let token = req.headers.authorization.split(" ")[1]
    
         
         let isblacklisted = await blacklistModel.findOne({token})

         if(isblacklisted){
            return res.status(400).json({message:"Unauthorized"})
         }
         const decode = jwt.verify(token , process.env.JWT_SECRET)
         console.log(decode)
         const user = await UserModel.findOne({ _id: decode._id });


         if(!user){
            return res.status(400).json({message:"Unauthorized"})
         }

         req.user = user

         next()


    } catch (error) {
        next(error)
    }
}

module.exports.isSeller = async (req,res,next)=>{
    try {
        const user = req.user;
        if(user.role !== "seller"){
            return res.status(400).json({
                message:"UnAuthorized"
            })
        }

       next()
    } catch (error) {
        next(error)
    }
}