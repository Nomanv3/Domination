const productModel = require('../models/product.model')
const sharp = require("sharp");


module.exports.productController = async (req,res)=>{
    let {name , description , amount } = req.body  
    try {
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).send("No files uploaded");
        }
        
        const resizedBuffers = await Promise.all(
            req.files.map(async (file) => {
                if (file.size > 2 * 1024 * 1024) {
                    return await sharp(file.buffer)
                        .resize({ width: 1920 })
                        .toBuffer();
                }
                return file.buffer;
            })
        )

        console.log(resizedBuffers )

        if(!name && !description && !amount){
            return res.status(400).json({
                message:"All feilds are required"
            })
        }

        const product = await productModel.create({
              name , 
              description,
              amount,
              image:resizedBuffers,
              seller:req.user._id
        })

        res.status(200).send(product)
      } catch (error) {
        res.status(500).json(error)
      }
}
