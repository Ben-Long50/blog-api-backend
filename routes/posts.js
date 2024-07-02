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

router.post(
  '/posts',
  cors(),
  authController.verifyToken,
  postController.createPost,
);

router.post(
  '/posts/:postId',
  cors(),
  authController.verifyToken,
  postController.updatePost,
);

router.put(
  '/posts/:postId/activity',
  cors(),
  authController.verifyToken,
  postController.updatePostDraft,
);

router.delete(
  '/posts/:postId',
  cors(),
  authController.verifyToken,
  postController.deletePost,
);

export default router;
