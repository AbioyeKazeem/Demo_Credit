import { Request, Response } from 'express';
import express from "express";
import bcrypt from 'bcryptjs';
import db from '../db';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const API_URL = "https://adjutor.lendsqr.com/v2/";

const getHeaders = (accessToken: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
});

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  console.log('Request body:', req.body); // Logging the request body to check its content
  const { name, email, phone_number, password } = req.body;

  try {
    if (!name || !email || !phone_number || !password) {
      console.error('Missing fields:', { name, email, phone_number, password });
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db('users').insert({
      name,
      email,
      phone_number,
      password: hashedPassword
    });

    const accessToken = process.env.ACCESS_TOKEN as string;
    const response = await axios.post(API_URL + 'register', {
      name,
      email,
      phone_number,
      password
    }, {
      headers: getHeaders(accessToken)
    });


 // Simulate API response due to network issue
 // const apiResponse = { status: 'success', message: 'Simulated API response' }   


    res.status(201).json({ user: newUser, apiResponse: response.data });
  } catch (error: any) {
    console.error('Error registering user:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};



export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const accessToken = process.env.ACCESS_TOKEN as string;
    const response = await axios.post(API_URL + 'login', { email, password }, {
      headers: getHeaders(accessToken)
    });

    res.status(200).json({ user, apiResponse: response.data });
  } catch (error: any) {
    console.error('Error logging in user:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to login user' });
  }
};


export const transferFunds = async (req: Request, res: Response): Promise<void> => {
  const { fromAccount, toAccount, amount } = req.body;

  try {
    const accessToken = process.env.ACCESS_TOKEN as string;
    const response = await axios.post(API_URL + 'transfer', { fromAccount, toAccount, amount }, {
      headers: getHeaders(accessToken)
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error transferring funds:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to transfer funds' });
  }
};


export const withdrawFunds = async (req: Request, res: Response): Promise<void> => {
  const { accountId, amount } = req.body;

  try {
    const accessToken = process.env.ACCESS_TOKEN as string;
    const response = await axios.post(API_URL + 'withdraw', { accountId, amount }, {
      headers: getHeaders(accessToken)
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error withdrawing funds:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to withdraw funds' });
  }
};
