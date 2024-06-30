import express from 'express';
import cors from 'cors';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', cors(), userController.createUser);

router.post('/login', cors(), authController.adminLogin);

// router.post('/logout', authController);

export default router;
