import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategory=async(req,res)=>{
  try{
const {category}=req.body;
// validation
if(!category){
  return res.status(404).send({
    success:false,
    message:"please provide category name"
  })
}
await categoryModel.create({category})
res.status(201).send({
  success:true,
  message:`${category} category created successfully`
})
  }
  catch(error){
    console.log(error);
    resizeBy.status(500).send({
      success:false,
      message:"Error in create cat api"
    })
  }
}

export const getAllCategoriesController=async(req,res)=>{
  try{
const categories=await categoryModel.find({})
res.status(200).send({
success:true,
message:"Categories fetched successfully",
totalCat:categories.length,
categories
})
  }
  catch(error){
    console.log(error);
    resizeBy.status(500).send({
      success:false,
      message:"Error in get all cat api"
    })
  }

}
export const deleteCategoryController=async(req,res)=>{
//   try{
// const {category}=await categoryModel.findById(req.params.id)
// // validation
// if(!category){
//   return res.status(404).send({
//     success:false,
//     message:"Category not found"
//   })

// }
// // find product by this category id
// const products=await productModel.find({category:category._id})
// // update product category
// for(let i=0;
//   i<products.length;i++){
//     const product =products[i]
//     product.category=undefined
//     await product.save()
//   }
//   await category.findOneAndRemove()
// res.status(200).send({
//   success:true,
//   message:"category deleted successfully"
// })

//   }
try {
  // find category
  const category = await categoryModel.findById(req.params.id);
  //validation
  if (!category) {
    return res.status(404).send({
      success: false,
      message: "Category not found",
    });
  }
  // find product with this category id
  const products = await productModel.find({ category: category._id });
  // update producty category
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.category = undefined;
    await product.save();
  }
  // save
  await category.deleteOne();
  res.status(200).send({
    success: true,
    message: "Catgeory Deleted Successfully",
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
      message:"Error in category delete Api",
      error,
    })
  }
}

export const updatedCategoriesController=async(req,res)=>{
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    //validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    // get new cat
    const { updatedCategory } = req.body;
    // find product with this category id
    const products = await productModel.find({ category: category._id });
    // update producty category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) category.category = updatedCategory;

    // save
    await category.save();
    res.status(200).send({
      success: true,
      message: "Catgeory Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In UPDATE CATEGPORY API",
      error,
    });
  }

}

