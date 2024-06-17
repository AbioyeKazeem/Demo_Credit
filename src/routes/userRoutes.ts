import {Router } from 'express';
import express from 'express';
import { registerUser, loginUser, transferFunds, withdrawFunds } from '../controllers/userController';

const router = express.Router(); // Use Router() to create a router instance

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/transfer', transferFunds);
router.post('/withdraw', withdrawFunds);

export default router;
