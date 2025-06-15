import jwt from 'jsonwebtoken';
import { env } from '@configs/env.config';

/**
 * Generate JWT token
 */
export  const generateToken = (payload: { id: string; email: string }) => {
    return jwt.sign(
        {
            id: payload.id,
            email: payload.email,
        },
        env.JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '7d', // 7 Hari
        }
    );
}

/**
 * Verify dan decode JWT token
 */
export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
}