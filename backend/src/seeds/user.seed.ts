// src/seeds/user.seed.ts
import bcrypt from 'bcryptjs';
import { User } from '../api/models';

export const seedUsers = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@bolt.com' });
    if (adminExists) {
      console.log('Seed users already exist');
      return;
    }

    const users = [
      {
        email: 'admin@bolt.com',
        name: 'Admin User',
        phone: '+1234567890',
        role: 'admin',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'accountant@bolt.com',
        name: 'John Accountant',
        phone: '+1234567891',
        role: 'accountant',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'dispatcher@bolt.com',
        name: 'Jane Dispatcher',
        phone: '+1234567892',
        role: 'dispatcher',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'driver@bolt.com',
        name: 'Mike Driver',
        phone: '+1234567893',
        role: 'driver',
        password: await bcrypt.hash('password', 10),
      },
    ];

    await User.insertMany(users);
    console.log('Seed users created successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
