import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Icon } from '../../components/ui/Icon';
import { Driver } from '../../types';

const driverSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(5, 'Phone required'),
  licenseNumber: z.string().min(1, 'License # required'),
  aadhaar: z.string().min(1, 'Aadhaar required'),
  vehicleType: z.enum(['owned', 'rented']),
  paymentMode: z.enum(['per-trip', 'daily', 'monthly', 'fuel-basis']),
  salary: z.number().min(0, 'Must be >= 0'),
  licenseExpiry: z.string().min(1),
  policeVerificationExpiry: z.string().min(1),
  status: z.enum(['active', 'inactive'])
});

type DriverForm = z.infer<typeof driverSchema>;

export const EditDriver: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drivers, updateDriver } = useApp();
  const driver = drivers.find(d => d.id === id);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema),
    defaultValues: driver ? {
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      aadhaar: driver.aadhaar,
      vehicleType: driver.vehicleType,
      paymentMode: driver.paymentMode,
      salary: driver.salary,
      licenseExpiry: driver.licenseExpiry,
      policeVerificationExpiry: driver.policeVerificationExpiry,
      status: driver.status
    } : undefined
  });

  if (!driver) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Driver not found.</p>
        <Button onClick={() => navigate('/drivers')}>Back</Button>
      </div>
    );
  }

  const onSubmit = (data: DriverForm) => {
    updateDriver(driver.id, data as Partial<Driver>);
    toast.success('Driver updated');
    navigate(`/drivers/${driver.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Icon name="back" className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Driver</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Driver Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input {...register('name')} label="Name" error={errors.name?.message} />
              <Input {...register('phone')} label="Phone" error={errors.phone?.message} />
              <Input {...register('licenseNumber')} label="License Number" error={errors.licenseNumber?.message} />
              <Input {...register('aadhaar')} label="Aadhaar" error={errors.aadhaar?.message} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select {...register('vehicleType')} label="Vehicle Type" error={errors.vehicleType?.message} options={[{value:'owned',label:'Owned'},{value:'rented',label:'Rented'}]} />
              <Select {...register('paymentMode')} label="Payment Mode" error={errors.paymentMode?.message} options={[{value:'per-trip',label:'Per Trip'},{value:'daily',label:'Daily'},{value:'monthly',label:'Monthly'},{value:'fuel-basis',label:'Fuel Basis'}]} />
              <Select {...register('status')} label="Status" error={errors.status?.message} options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input type="number" step="1" {...register('salary', { valueAsNumber: true })} label="Salary / Rate" error={errors.salary?.message} />
              <Input type="date" {...register('licenseExpiry')} label="License Expiry" error={errors.licenseExpiry?.message} />
              <Input type="date" {...register('policeVerificationExpiry')} label="Police Verification Expiry" error={errors.policeVerificationExpiry?.message} />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
