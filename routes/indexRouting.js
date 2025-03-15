import express from 'express';
import userRouter from './UserPath.js';
import postRoutes from './Postpath.js';

const mainRouter= express.Router();
mainRouter.use("/user", userRouter);
mainRouter.use('/post', postRoutes);

export default mainRouter;
