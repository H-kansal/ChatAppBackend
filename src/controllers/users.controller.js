import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const searchUser=asyncHandler(async(req,res)=>{
    const {keyword}=req.query;
    if(!keyword){
        throw new ApiError(400,'Keyword is required');
    }
    
    const users=await User.find({name:{$regex:keyword,$options:'i'}});

    if(!users){
        throw new ApiError(404,'No users found');
    }

    res.status(200).json(new ApiResponse(200,users,"Users found"));
})

export const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400,'Email and password are required');
    }

    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,'User not found');
    }

    if(!await user.isCorrectPassword(password)){
        throw new ApiError(401,'Incorrect password');
    }   

    const token=user.generateToken();
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    user.token = token; // Store token in user model
    await user.save(); // Save the user with the token
    res.status(200).json(new ApiResponse(200,user,"user logged in"));
})

export const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ApiError(400,'All fields are required');
    }

    const existingUser=await User.findOne({email});
    if(existingUser){
        throw new ApiError(400,'User already exists');
    }

    const user=await User.create({name,email,password});
    
    res.status(201).json(new ApiResponse(201,user,"user re,gistered"));
})

export const getuserbyId=asyncHandler(async(req,res)=>{
    const {id} = req.params;
    if(!id){
        throw new ApiError(400,'User ID is required');
    }

    const user=await User.findById(id);
    if(!user){
        throw new ApiError(404,'User not found');
    }
    res.status(200).json(new ApiResponse(200,user,"user found"));
})

export const checkAuth=asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const user = await User.findById(userId).select('-password'); // Exclude password from response
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, user, "User authenticated successfully"));
})