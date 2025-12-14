// src/services/authService.js

import prisma from '../config/database.js';
import bcrypt from 'bcrypt';

export const findUserByCredentials = async (username, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error('Error in findUserByCredentials:', error);
        throw new Error('Database query failed.');
    }
};