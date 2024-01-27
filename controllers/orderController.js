// import orderModel from "../models/orderModel.js";
// import orderModel from "../models/orderModel.js";
import { stripe } from "../server.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
export const createOrderController=async(req,res)=>{
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    //valdiation
    // if(!shippingInfo || !orderItems || ! paymentMethod || !paymentInfo || ! itemPrice || !tax || !shippingCharges || !totalAmount){
    //   return res.status(500).send({
    //     success:false,
    //     message:"Please Provide All fields"
    //   })
    // }
    // create order
    await orderModel.create({
      user:req.user_id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });
    
    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
}
export const getMyOrdersController=async(req,res)=>{
  try{
const orders=await orderModel.find({user:req.user_id})
if(!orders){
  return res.status(404).send({
    success:false,
message:"no orders found"
  })
}
res.status(200).send({
  success:true,
  message:"your orders data",
  totalOrder:orders.length,
  orders
})
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
}
export const singleOrderDetailsController=async(req,res)=>{
  try{
// find product
const order=await orderModel.findById(req.params.id)
// validation
if(!order){
  return res.status(404).send({
    success:false,
    message:"no order found"
  })
}
res.status(200).send({
  success:true,
  message:"your order fetched",
  order
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

export const paymentsController=async(req,res)=>{
  try{
    const {totalAmount}=req.body
    // validation
    if(!totalAmount){
      return res.status(404).send({
        success:false,
        message:"Total amount is required"
      })
    }
const {client_secret} =await stripe.paymentIntents.create({
  amount:Number(totalAmount*100),
  currency:"usd"
})
res.status(200).send({
  success:true,
  client_secret,
})
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In payment controller API",
      error,
    });
  }
}

export const getAllOrdersController=async(req,res)=>{
  try{
const orders=await orderModel.find({})
res.status(200).send({
  success:true,
  message:"All Orders Data",
  totalOrders:orders.length,
  orders
})
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get all order API",
      error,
    });
  }
}
export const changeOrderStatusController=async(req,res)=>{
  try{
// find order
const order=await orderModel.findById(req.params.id)
// validation
if(!order){
return res.status(404).send({
  success:false,
  message:"order not found"
})
}
if(order.orderStatus==="shipped") order.orderStatus="shipped"
else if(order.orderStatus==="shipped"){
  order.orderStatus="deliverd"
  order.deliverdAt= Date.now()
}
else{
  return res.status(500).send({
    success:false,
    message:"order already delivered"
  })
}
await order.save()
res.status(200).send({
  success:true,
  message:"order status updated"
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
      message:"Error in change order status Api"
  })
}
}



