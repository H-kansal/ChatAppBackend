import { Router } from "express";
import {getChatMessage,newMessage} from "../controllers/message.controller.js";
import validateUser from "../middleware/validateUser.middleware.js";

const messageRouter = Router();
messageRouter.get("/chatmessage/:chatId", getChatMessage);
messageRouter.post("/createmessage",validateUser,newMessage)
export default messageRouter;