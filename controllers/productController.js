import productModel from "../models/productModel.js"
import cloudinary from "cloudinary"
import { getDataUri } from "../utils/features.js";
export const getAllProductsController=async(req,res)=>{
  const {keyword,category}=req.query;
  try{
const products=await productModel.find({
  name:{
    $regex:keyword?keyword:"",
    $options:"i",
  },
// category:category? category:undefined, 
}).populate("category")
res.status(200).send({
  success:true,
  message:"all products fetched successfully",
 totalProducts:products.length,
  products
})

}
catch(error){
  console.log(error)
  res.status(500).send({
    success:"false",
    message:"Error in Ge Api",
error
  })
}
}

// get top products
export const getTopProductsController=async(req,res)=>{
try{
const products=await productModel.find({}).sort({rating:-1}).limit(3);
res.status(200).send({
  success:true,
  message:"top 3 products",
  products
})
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:"false",
    message:"Error in Ge Api",
error
  })
}
}

export const getSingleProductController=async(req,res)=>{
  try{
const product=await productModel.findById(req.params.id)
  // validation 
  if(!product){
    return res.status(404).send({
      success:false,
      message:"product not found"
    })
  } 
  res.status(200).send({
    success:true,
    message:"product found",
    product,
  })

}
  catch(error){
    console.log(error)
    // cast error || object id
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in get single products Api"
  })
}
}


export const createProductController=async(req,res)=>{
try{
const {name,description ,price,category,stock}=req.body
// validation
// if(!name || !description || !price || !stock){
//   return res.status(500).send({
//     success:false,
//     message:"please provide all fields"
//   })
// }
if(!req.file){
  return res.status(500).send({
    success:false,
    message:"please provide product images"

  })
}
const file =getDataUri(req.file)
const cdb=await cloudinary.v2.uploader.upload(file.content)
const image={
  public_id:cdb.public_id,
  url:cdb.secure_url
}
await productModel.create({
  name,description,price,category,stock,images:[image]
})
res.status(201).send({
  success:true,
  messsage:"product created successfully"
})
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:"false",
    message:"Error in Get single Products Api",
    error,
  })
}
}

export const updateProductController=async(req,res)=>{
  try{
const product=await productModel.findById(req.params.id)
// validation
if(!product){
  return res.status(404).send({
    success:false,
    message:"product not found"
  })
}
const {name,description,price,stock,category}=req.body
// validate and update
if(name) product.name=name;
if(description) product.description=description;
if(price) product.price=price;
if(stock) product.stock=stock;
if(category) product.category=category;

await product.save();
res.status(200).send({
  success:true,
  message:"product details updated"
})

}
  catch(error){
    console.log(error)
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in Get single Products Api",
      error,
    })
  }
}

export const updateProductImageController=async(req,res)=>{
  try{
    const product=await productModel.findById(req.params.id)
if(!product){
  return res.status(404).send({
    success:false,
    message:"Product not found"
  })
}
// check file
if(!req.file){
  return res.status(404).send({
    success:false,
    message:"Product image not found"
  })
}
const file=getDataUri(req.file)
const cdb=await cloudinary.v2.uploader.upload(file.content)
const image={
  public_id:cdb.public_id,
  url:cdb.secure_url
}
// save
product.images.push(image);
await product.save();
res.status(200).send({
  success:true,
  message:"product image updated"
})
  }
  catch(error){
    console.log(error)
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in Get update Products Api",
      error,
    })
  }
}

export const deleteProductImageController=async(req,res)=>{
  try{
    // find product
    const product=await productModel.findById(req.params.id)
  // validate
  if(!product){
    return res.status(404).send({
      success:false,
      message:"Product Not Found"
    })
  }
  // image id find
  const id=req.query.id;
  if(!id){
    return res.status(404).send({
      success:false,
      message:"product image not found"
    })
  }
  let isExist=-1;
  product.images.forEach((item,index)=> {
    
    if(item._id.toString()===id.toString()) isExist=index;
  });
if(isExist<0){
return res.status(404).send({
  success: false,
  message:"Image Not Found"
})
}
// Delete product image
await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
product.images.splice(isExist,1);
await product.save();
return res.status(200).send({
  success:true,
  message:"Product Image Deleted successfully"
}) 


}
  catch(error){
    console.log(error)
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in delete image Products Api",
      error,
    })
  }
}

export const deleteProductController=async(req,res)=>{

try {
  // find product
  const product = await productModel.findById(req.params.id);
  // validation
  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product Not Found",
    });
  }

  // image id find
  const id = req.query.id;
  if (!id) {
    return res.status(404).send({
      success: false,
      message: "product image not found",
    });
  }

  let isExist = -1;
  product.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });
  if (isExist < 0) {
    return res.status(404).send({
      success: false,
      message: "Image Not Found",
    });
  }
  // DELETE PRODUCT IMAGE
  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
  product.images.splice(isExist, 1);
  await product.save();
  return res.status(200).send({
    success: true,
    message: "Product Image Dleteed Successfully",
  });
}
  catch(error){
    console.log(error)
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in product delete Api",
      error,
    })
  }
}

export const productReviewController=async(req,res)=>{
  try{
 const {comment, rating}=req.body
// find product
const product =await productModel.findById(req.pqrams.id)
// check pevious review
const alreadyReviewed=product.reviews.find((r)=>r.user.toString()=== req.user._id.toString())
if(alreadyReviewed){
  return res.status(400).send({
    success:false,
    message:"Product Already Reviewed"
  })
}
const review={
  name:req.user.name,
  rating:Number(rating),
  comment,
  user:req.user._id
}
// .passing review object to review array
product.reviews.push(review)
// number or reviews
product.numReviews=product.reviews.length
product.rating=product.reviews.reduce((acc,item)=>item.rating + acc,0)/
product.reviews.length
// save
await product.save();
res.status(200).send({
  success:true,
  message:"Review Added!"
})


  }
  catch(error){
    console.log(error)
    if(error.name==="castError"){
      return res.status(500).send({
        success:"false",
      message:"invalid id"
      })
    }
    res.status(500).send({
      success:"false",
      message:"Error in productReview Api",
      error,
    })
  }
}
