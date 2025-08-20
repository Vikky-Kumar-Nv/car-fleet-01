export const getUserById = async (id: string) => {
  return User.findById(id).select('-password');
};
// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../../config';
import { IUser } from '../types';

export const registerUser = async (data: Omit<IUser, '_id' | 'createdAt'>) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('Email in use');
  const hashed = await bcrypt.hash(data.password, 10);
  const user = new User({ ...data, password: hashed });
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id.toString(), role: user.role }, config.jwtSecret, { expiresIn: '1d' });
  return { 
    token, 
    user: { 
      id: user._id.toString(), 
      email: user.email, 
      name: user.name, 
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString()
    } 
  };
};

export const getUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);
  return { users, total };
};

export const updateUser = async (id: string, updates: Partial<IUser>) => {
  if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
  return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
};

export const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
};