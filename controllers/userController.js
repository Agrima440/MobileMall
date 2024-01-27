import userModel from '../models/userModel.js'
import { getDataUri } from '../utils/features.js'
import cloudinary from "cloudinary"
export const registerController=async(req,res)=>{
try{
const {name,email,password, address,city,country,phone,answer}=req.body
if(!name || !email || !password || !city || !address || !country || !phone || !answer){
return res.status(500).send({
  success:false,
  message:"Please Provide All fields"
})
}

// check existing user
{const existingUser=await userModel.findOne({email})
// validation
if(existingUser){
  res.status(500).send({
  success:false,
  message:"email already taken"
  })
}
}
const user=await userModel.create({
  name,
  email,
  password,
   address,
   city,
   country,
   phone, 
   answer
})
res.status(201).send({
  success:true,
  message:"Registration Success, Please login",
  user
})
}
catch(error){
console.log(error)
res.status(500).send({
  success:false,
  message:"Error In Register API",
  error,
})
}
}

// login
export const loginContainer=async(req,res)=>{
try{
const {email,password}=req.body
if(!email || !password){
  return res.status(500).send({
    success:"false",
    message:"Please Add Email or Password"
  })
}
// check user
const user=await userModel.findOne({email})
// user validation
if(!user){
  return res.status(404).send({
    success:"false",
    message:"user not found"
  })
} 
// check pass
const isMatch=await user.comparePassword(password)
// validation pass
if(!isMatch){
  return res.status(404).send({
    success:"false",
    message:"invalid credentials"
  })
  
}
// token
const token=user.generateToken()

res.status(200).cookie("token",token,{
expires:new Date(Date.now() + 15*24*60*60*1000),
secure:process.env.NODE_ENV==="development"? true:false,
httponly:process.env.NODE_ENV==="development"?true:false,
sameSite:process.env.NODE_ENV==="development"?true:false,
}).send({
  success:true,
  message:"Login Successfully",
  token,
  user
})
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:"false",
    message:"Error in Login Api",
    error
  })
}

}
// user profile

export const getUserProfileController=async(req,res)=>{
try{
  const user=await userModel.findById(req.user._id);
  user.password=undefined
res.status(200).send({
  success:true,
  message:"User Profile Fetched successfully",
  user,
})
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:"false",
    message:"Error in Profile Api"
  })
}
}
// Logout
export const logoutController=async(req,res)=>{
  try{
res.status(200).cookie("token","",{
  expires:new Date(Date.now()),
  secure:process.env.NODE_ENV==="development"? true:false,
  httponly:process.env.NODE_ENV==="development"?true:false,
  sameSite:process.env.NODE_ENV==="development"?true:false,
}).send({
  success:true,
  message:"Logout successfully"
})
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success:"false",
      message:"Error in Logout Api"
  })
}
}
// update user profile
export const updateProfileController=async(req,res)=>{
  try{
const user =await userModel.findById(req.user._id);
const {name,email,address,city,country,phone}=req.body
// validation
if(name)user.name=name
if(email)user.email=email
if(address)user.address=address
if(city)user.city=city
if(country)user.country=country
if(phone)user.phone=phone
// save user
await user.save();
res.status(200).send({
  success:true,
  message:"User Profile Updated"
})
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success:"false",
      message:"Error in Update profile Api"
  })
  }
}

// updated password
export const updatePasswordController=async(req,res)=>{
try{
const user=await userModel.findById(req.user._id)
const {oldPassword, newPassword}=req.body
// validation
if(!oldPassword || !newPassword){
  return res.status(500).send({
    success:false,
    message:'Please provide old or new password'
  })
}
// old password check
const isMatch=await user.comparePassword(oldPassword)
// Validation
if(!isMatch){
  return res.status(500).send({
    success:false,
    message:"Invalid old password"
  })
}
user.password=newPassword;
await user.save();
res.status(200).send({
  success:true,
  message:"Password Updated Successfully"
})

}
catch(error){
  console.log("error")
  res.status(500).send({
    success:"false",
    message:"Error in Update Password Api"
})
}
}

// update profile pic
export const updateProfilePicController=async(req,res)=>{
try{
const user=await userModel.findById(req.user._id);
// file get from client
const file=getDataUri(req.file)
// delete pre image
await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
// update
const cdb=await cloudinary.v2.uploader.upload(file.content);
user.profilePic={
  public_id:cdb.public_id,
  url:cdb.secure_url,
}
// sav func
await user.save()

res.status(200).send({
  success:true,
  message:"profile picture updated"
})
}
catch(error){
  console.log("error")
  res.status(500).send({
    success:"false",
    message:"Error in Update Password Api"
})
}
}


export const passwordResetController=async(req,res)=>{
  try{
const {email,newPassword, answer}=req.body
// validation
if(!email || !newPassword || !answer){
  return res.status(500).send({
    success:false,
    message:"Please provide all fields"
  })
}
const user=await userModel.findOne({email,answer})
if(!user){
  return res.status(404).send({
    success:false,
    message:"Invalid user or answer"
  })
}
user.password=newPassword
await user.save();

res.status(200).send({
success:true,
message:"Your password has been reset successfully",

})

  }
  catch(error){
    console.log("error")
    res.status(500).send({
      success:"false",
      message:"Error in reset Password Api"
  })
  }
}


