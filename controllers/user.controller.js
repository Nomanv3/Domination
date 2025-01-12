const UserModel = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')
const ProductModel = require('../models/product.model')
const paymentModel = require('../models/payment')
const orderModel = require('../models/order.model')

require('dotenv').config()

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports.Signup = async (req,res,next)=>{
    let {username , email , password , role} = req.body;
    try {

        if(!username && !email && !password){
            res.status(400).json({
                message:"All feilds are required"
            })
        }

        let user = await UserModel.findOne({email})

        if(user) return res.status(400).json({message:"user already exist"})

      let salt = await bcrypt.genSalt(10)
      let hashedpass = await bcrypt.hash(password , salt)

        user  = await UserModel.create({
            username,
            email,
            password:hashedpass,
            role
        })

        const token = jwt.sign({_id : user._id} , process.env.JWT_SECRET , {expiresIn:"1h"})

        // res.cookie("token" , token , {
        //     httpOnly:true,
        //     secure:true,
        //     maxAge:30*24*60*60*1000
        // })

        res.status(201).json({
            message:"User created succesfully",
            user,
            token
        })

    } catch (error) {
          next(error) 
    }
}


module.exports.Sign = async (req,res,next)=>{
    const {email , password} = req.body;
    try {
  
        if(!email && !password){
            res.status(400).json({message:"All feilds are required"})
        }

        let user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        let ispasswordCorrect =  bcrypt.compare(password , user.password)

        if(!ispasswordCorrect){
             return res.status(400).json({
                message:"Invalid email or password"
             })
        }

        const token = jwt.sign({_id:user._id} , process.env.JWT_SECRET , {expiresIn:"1h"})

        res.status(200).json({
            message:"User Signed in Successfully",
            user,
            token
        })
        
    } catch (error) {
        
    }
}

module.exports.logout = async (req,res , next)=>{
 try {
    let {token} = req.header.authorization.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"Token is required"
        })
    }

    let isTokenBlackListed = await blacklistModel.findOne({token})

    if(isTokenBlackListed){
        return res.status(400).json({message:"Token is already blacklisted"})
    }

    await blacklistModel.create({token})
 } catch (error) {
    next(error)
 }
}

module.exports.getprofile = async (req,res , next)=>{
    try {
        let user = await UserModel.findOne(req.user._id)

        res.status(200).json({
            message:"User fetched succesfully",
            user
        })

    } catch (error) {
        next(error)
    }
}

module.exports.getAllProducts = async (req,res)=>{
    try{
      let products = await ProductModel.find()

      res.status(200).json({
        products
      })
    }catch(err){
       res.status(400).json({
        message:"unable to get the products"
       })
    }
}

module.exports.getProduct = async (req,res)=>{
    try {
        let product = await ProductModel.findOne(req.params._id)

        res.status(200).json({
            product
        })
    } catch (error) {
          res.status(400).json({
            message:"Unable to find the product"
          })        
    }
}

module.exports.createOrder = async (req,res , next)=>{
    try{

        const product = await ProductModel.findOne(req.params._id)
        
        const option = {
            amount:product.amount * 100,
            currency :"INR",
            receipt:product._id
        }

        const order =  instance.orders.create(option)

        res.status(200).json({
            order
        })

        const payment = await paymentModel.create({
            order_id : order.id,
            amount:product.amount,
            currency:'INR',
            status:'pending '
        })

    }catch(err){
        next(err)
    }
}

module.exports.verifyPayment = async (req,res,next)=>{
    try{
  
        const {paymentId , orderId , signature} = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET

        const {validatePaymentVerification} = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')

        const isvalid = validatePaymentVerification({  order_Id : orderId  , payment_id : paymentId},
             signature , secret)

             if(isvalid){
                const payment = await paymentModel.findOne({orderId : orderId})

                payment.paymentId= paymentId,
                payment.signature = signature,
                payment.status = "success"

                await payment.save()
                res.status(200).json({
                    message:"payment verified successfully"
                })
             }else{
                const payment = await paymentModel.findOne({orderId : orderId})

                payment.status = 'failed'
                res.status(400).json({
                    message:"Payment verification failed "
                }) 
            }
    }catch(err){
        next(err)
    }
}