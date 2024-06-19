// routes.ts

import express from 'express';
import { registerUser, loginUser, transferFunds, withdrawFunds } from '../controllers/userController';

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.post('/users/transfer', transferFunds);
router.post('/users/withdraw', withdrawFunds);

export default router;
