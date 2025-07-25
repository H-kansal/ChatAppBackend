import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDb from "./config/db.config.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173', // Replace with your frontend URL
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    }
})

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin:'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))
dotenv.config({    // this is to config the dotenv
    path:'./.env'
});

const PORT=process.env.PORT;   // way to access the data from .env file
console.log(PORT);
// console.log(process.env)
// console.log(process.env.MONGO_URL);
ConnectDb()
.then((res)=>{
    server.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`);
    })    
})
.catch((err)=>{
   console.log("Mongo is failing to connect");
})

app.get("/",(req,res)=>{
    res.send("Welcome to the Chat Application Backend");
})

import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chats.route.js";
import messageRouter from "./routes/message.route.js";

app.use("/api/v1/users",userRouter);
app.use("/api/v1/chats",chatRouter);
app.use("/api/v1/messages",messageRouter);


io.on("connection",(socket)=>{
    console.log("socket connected:", socket.id);

    socket.on("setup", (roomId) => {
        console.log("User setup with roomId:", roomId);
        socket.join(roomId);
        socket.emit("connected");
    });

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);    // join all the users of a chat to a specific room
        console.log(`User joined room: ${roomId}`);
    });
    
    socket.on("typing", (roomId) => {
        console.log(`User is typing in room: ${roomId}`);
        socket.in(roomId).emit("typing");
    });
    socket.on("stopTyping", (roomId) => {
        console.log(`User stopped typing in room: ${roomId}`);
        socket.in(roomId).emit("stopTyping");
    });
    
    socket.on("newMessage", (message) => {
        message.chat.users.forEach((element) => {
            const userId = typeof element === 'string' ? element : element._id;

            if (userId !== message.sender._id) {
                socket.in(userId).emit("newMessage", message);
            }
        });
    });
})