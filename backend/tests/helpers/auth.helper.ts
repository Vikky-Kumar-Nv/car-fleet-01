import jwt from 'jsonwebtoken';
import { config } from '../../src/config';
import { UserRole } from '../../src/api/types';

export const generateAuthToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, { expiresIn: '1h' });
};

export const getAuthHeaders = (userId: string, role: UserRole) => {
  const token = generateAuthToken(userId, role);
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getMultipartAuthHeaders = (userId: string, role: UserRole) => {
  const token = generateAuthToken(userId, role);
  return {
    'Authorization': `Bearer ${token}`
  };
};