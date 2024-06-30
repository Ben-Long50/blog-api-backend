import express from 'express';
import cors from 'cors';
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get(
  '/posts',
  cors(),
  authController.verifyToken,
  postController.listPosts,
);

router.get(
  '/posts/:postId',
  authController.verifyToken,
  postController.showPost,
);

router.post(
  '/posts',
  cors(),
  authController.verifyToken,
  postController.createPost,
);

// router.put('/posts/:postId', postController);

router.delete(
  '/posts/:postId',
  authController.verifyToken,
  postController.deletePost,
);

export default router;
