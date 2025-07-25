import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Message from "../models/message.model.js";

export const getChatMessage=asyncHandler(async(req,res)=>{
    const {chatId}=req.params;
    if(!chatId){
        throw new ApiError(400,'chatId is required');
    }
    const messages=await Message.find({chat:chatId}).populate("sender",'-password -token');
    if(!messages){
        throw new ApiError(404,'Message not found');
    }
    res.status(200).json(new ApiResponse(200,messages,"chat messages retrieved successfully"));
})


export const newMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body;
    const sender=req.user._id; 
    if(!content || !chatId){
        throw new ApiError(400,'Content and chatId are required');
    }

    const message=await Message.create({
        sender: sender,
        content,
        chat: chatId
    });

    if(!message){
        throw new ApiError(404,'Message not created');
    }

    await message.populate("sender", "-password -token");
    await message.populate("chat");
    
    res.status(201).json(new ApiResponse(201,message,"Message created successfully"));
})