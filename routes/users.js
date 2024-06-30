import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/users', userController.listUsers);

router.get('/users/:userId', userController.showUser);

router.delete('/users/:userId', userController.deleteUser);

export default router;
