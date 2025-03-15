import express from "express";
import { createPost, getAllPosts } from "../controllers/PostController.js";

const postRouter = express.Router();

postRouter.post("/submit-post", createPost);

postRouter.get("/", getAllPosts);

export default postRouter;
