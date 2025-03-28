
import {Register } from "../controllers/UserController.js";
import express from "express";

const userRouter = express();
userRouter.post("/register", Register);

export default userRouter;