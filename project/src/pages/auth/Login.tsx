import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center">
              <Icon name="car" className="h-12 w-12 text-amber-600" />
              <span className="ml-2 text-3xl font-bold text-gray-900">Car Fleet</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email address"
              error={errors.email?.message}
              placeholder="Enter your email"
            />
            
            <Input
              {...register('password')}
              type="password"
              label="Password"
              error={errors.password?.message}
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-amber-700 space-y-1">
              <div>Admin: admin@bolt.com / password</div>
              <div>Accountant: accountant@bolt.com / password</div>
              <div>Dispatcher: dispatcher@bolt.com / password</div>
              <div>Driver: driver@bolt.com / password</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};