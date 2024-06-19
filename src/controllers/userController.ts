import { Request, Response } from 'express';
import { User } from '../models/user';
import { Transaction } from '../models/transaction';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db'; 


export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Construct the URL with the actual email address
    const karmaUrl = `${'https://adjutor.lendsqr.com/v2/verification/karma'}/${encodeURIComponent(email)}`;

    // Checking Karma
    const { data: karmaData } = await axios.get(karmaUrl, {
      headers: {
        'Authorization': `Bearer sk_live_2D1YDWaeySERRKaWb9hiRxzzazp1drbE3eWOuF9C`
      }
    });

    console.log('Karma response:', karmaData);

    // If Karma indicates user is blacklisted or any other issue
    if (karmaData.status === 'success') {
      return res.status(403).json({ message: 'User is blacklisted in Karma' });
    }

    // Proceed with registration if user not found in Karma
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Log the request body
    console.log('loginUser request body:', req.body);

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



export async function fundAccount(req: Request, res: Response) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findUserById(req.app.get('db'), userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newBalance = user.balance + amount;
        await User.updateUserBalance(req.app.get('db'), userId, newBalance);
        
        await Transaction.createTransaction(req.app.get('db'), { userId, type: 'fund', amount });
        res.status(200).json({ message: 'Account funded successfully', newBalance });
    } catch (error) {
        res.status(500).json({ message: 'Error funding account', error });
    }
}

export async function transferFunds(req: Request, res: Response) {
    const { fromUserId, toUserId, amount } = req.body;

    try {
        const fromUser = await User.findUserById(req.app.get('db'), fromUserId);
        const toUser = await User.findUserById(req.app.get('db'), toUserId);
        
        if (!fromUser || !toUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (fromUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        
        await User.updateUserBalance(req.app.get('db'), fromUserId, fromUser.balance - amount);
        await User.updateUserBalance(req.app.get('db'), toUserId, toUser.balance + amount);
        
        await Transaction.createTransaction(req.app.get('db'), { userId: fromUserId, type: 'transfer', amount: -amount });
        await Transaction.createTransaction(req.app.get('db'), { userId: toUserId, type: 'transfer', amount });
        
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error transferring funds', error });
    }
}

export async function withdrawFunds(req: Request, res: Response) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findUserById(req.app.get('db'), userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        
        const newBalance = user.balance - amount;
        await User.updateUserBalance(req.app.get('db'), userId, newBalance);
        
        await Transaction.createTransaction(req.app.get('db'), { userId, type: 'withdraw', amount });
        res.status(200).json({ message: 'Withdrawal successful', newBalance });
    } catch (error) {
        res.status(500).json({ message: 'Error withdrawing funds', error });
    }
}
