// src/controllers/authController.js

import { findUserByCredentials } from '../services/authService.js';
import { generateToken } from '../utils/jwt.js';
import redisClient from '../config/redis.js'; 
import bcrypt from 'bcrypt';

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ status: 'fail', data: { message: 'Username and password are required.' } });
        }
        const user = await findUserByCredentials(username, password);
        if (!user) {
            return res.status(401).json({ status: 'fail', data: { message: 'Invalid credentials.' } });
        }
        const payload = { userId: user.id, role: user.role };
        const token = generateToken(payload);
        res.status(200).json({ status: 'success', data: { user, token } });
    } catch (error) {
        next(error);
    }
};
 
export const logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        await redisClient.set(`blacklist_${token}`, 'true', 'EX', 3600);
        res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Error blacklisting token:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userProfile = req.user;
        if (!userProfile) {
            return res.status(404).json({ status: 'fail', data: { message: 'User profile not found.' } });
        }
        res.status(200).json({ status: 'success', data: { user: userProfile } });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
};



export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role, name, branchId } = req.body;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        name,
        branchId
      }
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json(successResponse(
      { user: userWithoutPassword }, 
      'User created successfully'
    ));
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json(errorResponse('Username or email already exists'));
    }
    next(error);
  }
};  