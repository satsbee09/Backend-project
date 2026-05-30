import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import{User}from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens=async(userId)=>{
   try {
      const user=await User.findById(userId);
      const accessToken=user.generateAccessToken();
      const refreshToken=user.generateRefreshToken();
      user.refreshToken=refreshToken;
      await user.save({valideBeforeSave:false})
      return {accessToken,refreshToken};
      
   } catch (error) {
      throw new ApiError(500,"Something went Wrong while Genrating refresh token ")
      
   }
}

const registerUser= asyncHandler(async(req,res)=>{
// get user details from frontend
//validate - not empty, email format, password strength
// check if user already exists
// check for images, avatar
// upload them to cloudinary,avatar
// create user object -create entry in database
// remove password and refresh token from response})
//check for user creation 
// return  resp
 const {fullName, email, username,password}=req.body
 /*if(fullname===""){
   throw new ApiError(400,"Fullname is requried")
 }*/

   if(
      [ fullName,email,username,password].some((field)=>
         field?.trim()=="")
      )
      {
       throw newApiError(400,"All Fields required")
      }
      const existedUser= await User.findOne({
         $or:[{username},{email}]
      })
      if(existedUser){
         throw new ApiError(409,"User with email already exists")
      }
     const avatarLocalPath= req.files?.avatar[0]?.path;
     //const coverImageLocalPath=req.files?.coverImage[0]?.path;
     // agar cover image nhi  send karenge toh above wala error dega, toh isliye niche wala code likha hai
     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
         coverImageLocalPath=req.files.coverImage[0].path;
     }
     if(!avatarLocalPath){
      throw new ApiError(400,"Avator required");
     }
    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
      throw new ApiError(400,"Avatar is required")
    }
    if(!coverImage){
      throw new ApiError(400,"Cover image is required")
    }
    const user= await User.create({
      fullName,
      email,
      password,
      username:username.toLowerCase(),
      avatar:avatar.url,
      coverImage:coverImage.url
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken");
      if(!createdUser){
         throw new ApiError(500, "Something went wrong while registering the user")
      }

      return res.status(201).json(
         new ApiResponse(200,createdUser,"User Created Sucessfully ")
      )

})
const loginUser=asyncHandler(async(req,res)=>{
   const {email,username,password}=req.body
   if(!(username||email)){
      throw new ApiError(400,"Username or email is requried")
   }
   const user=await User.findOne({
      $or:[{email},{username}]
   })
   if(!user){
      throw new ApiError(404,"User Does Not exist")
   }
   const isPasswordValid=await user.isPasswordCorrect(password);
   if(!isPasswordValid){
      throw new ApiError(404,"Password does not correct")
   }
   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);
   const loggedInUser=User.findById(user._id).
   select("-password -refreshtoken");
   const options={
      httpOnly:true,
      secure:true
   }
   return res
   ,status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json
   new ApiResponse(
      200,
      {
         user:loggedInUser,accessToken,refreshToken
      },
      "User Logged In Successfully"
   )
})
const logoutUser= asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(
   req.user._id,
   {
      $set:{
         refreshToken:undefined
      }
   },
   {
   new:true}
  )
  const options={
      httpOnly:true,
      secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,"User Logout Successfully"));
})

export {registerUser,loginUser,logoutUser}