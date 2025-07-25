import { Router } from "express";
import {getUserChats, createNewChat, deleteChat, createNewGroupChat} from "../controllers/chats.controller.js";
import validateUser from "../middleware/validateUser.middleware.js";

const chatRouter = Router();
chatRouter.get("/getuserchats", validateUser,getUserChats);
chatRouter.post("/createnewchat", validateUser,createNewChat);
chatRouter.delete("/deletechat:chatId", deleteChat);
chatRouter.post("/newgroupchat", validateUser,createNewGroupChat);
export default chatRouter;