import express from 'express';
import cors from 'cors';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/admin/signup', cors(), userController.createAdmin);

router.post('/users/signup', cors(), userController.createUser);

router.post('/admin/login', cors(), authController.adminLogin);

router.post('/users/login', cors(), authController.userLogin);

export default router;
