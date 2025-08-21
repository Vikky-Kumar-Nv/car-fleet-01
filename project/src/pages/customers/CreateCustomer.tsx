import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const customerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Phone required'),
  email: z.string().email('Invalid email').optional().or(z.literal('').transform(()=>undefined)),
  address: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

export const CreateCustomer: React.FC = () => {
  const { addCustomer } = useApp();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerForm>({ resolver: zodResolver(customerSchema) });

  const onSubmit = async (data: CustomerForm) => {
    try {
      await addCustomer(data);
      toast.success('Customer created');
      navigate('/customers');
    } catch (err) {
      console.error(err);
      toast.error('Create failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={()=>navigate('/customers')}>Back</Button>
        <h1 className="text-3xl font-bold text-gray-900">New Customer</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Customer Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input {...register('name')} label="Name" error={errors.name?.message} placeholder="Full name" />
              <Input {...register('phone')} label="Phone" error={errors.phone?.message} placeholder="Phone number" />
              <Input {...register('email')} label="Email" error={errors.email?.message} placeholder="email@example.com" />
              <Input {...register('address')} label="Address" error={errors.address?.message} placeholder="Address" />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={()=>navigate('/customers')}>Cancel</Button>
              <Button type="submit" loading={isSubmitting}>Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
