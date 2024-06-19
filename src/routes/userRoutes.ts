import express from 'express';
import { registerUser, loginUser, fundAccount, transferFunds, withdrawFunds } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/fund', fundAccount);
router.post('/transfer', transferFunds);
router.post('/withdraw', withdrawFunds);

export default router;
