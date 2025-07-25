import { Router } from "express";
import {searchUser, loginUser, registerUser,getuserbyId,checkAuth} from "../controllers/users.controller.js";
import validateUser from "../middleware/validateUser.middleware.js";
const userRouter = Router();

userRouter.get("/search", searchUser);
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/getuser", getuserbyId); // Assuming this is for getting user details
userRouter.get("/checkauth",validateUser,checkAuth); // Assuming this is for getting user details
export default userRouter;