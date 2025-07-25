import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Chat from "../models/chat.model.js";

export const getUserChats=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    if(!userId){
        throw new ApiError(401,'something went wrong');
    }

    const user=await User.findById(userId);
    if(!user){
        throw new ApiError(404,'User not found');
    }

   const chats = await Chat.find({ users: { $in: [userId] } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 });
    
    
    if(!chats){
        throw new ApiError(404,'something went wrong');
    }

    res.status(200).json(new ApiResponse(200,chats,"user all chats"));
})

export const createNewChat=asyncHandler(async(req,res)=>{
    const userId=req.body._id;
    const adminId=req.user._id;
    console.log(userId,adminId);
    if(!userId || !adminId){
        throw new ApiError(401,'Required is incorrect');
    }
    
    const chat=await Chat.findOne({isGroupChat: false,users: { $all: [userId, adminId]}}).where('users').size(2);
    
    await chat.populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage");
    
    if(chat){
        return res.status(200).json(new ApiResponse(200,chat,"chat already exists"));
    }

    const newChat=await Chat.create({
        users: [adminId,userId],
        admin: adminId
    });
    console.log(newChat)
    if(!newChat){
        throw new ApiError(404,'something went wrong');
    }
    await newChat.populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage");
    res.status(201).json(new ApiResponse(201,newChat,"new chatcreated"));
})

export const deleteChat=asyncHandler(async(req,res)=>{
    const chatId=req.params.chatId;
    if(!chatId){
        throw new ApiError(400,'chatId is required');
    }

    const chat=await Chat.findByIdAndDelete(chatId);

    if(!chat){
        throw new ApiError(404,'Chat not found');
    }

    res.status(200).json(new ApiResponse(200,chat,"char deleted successfully"));
})

export const createNewGroupChat=asyncHandler(async(req,res)=>{
    const {name,users}=req.body;
    const adminId=req.user._id;

    if(!name || !users || users.length === 0){
        throw new ApiError(400,'Name and users are required');
    }

    const groupChat=await Chat.create({
        chatName: name,
        isGroupChat: true,
        users: [adminId,...users],
        admin: adminId
    });

    if(!groupChat){
        throw new ApiError(404,'something went wrong');
    }

    res.status(200).json(new ApiResponse(201,groupChat,"new group chat created"));
})