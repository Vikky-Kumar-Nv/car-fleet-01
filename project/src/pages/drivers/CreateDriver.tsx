import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Icon } from '../../components/ui/Icon';

const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  aadhaar: z.string().min(12, 'Valid Aadhaar number is required'),
  vehicleType: z.enum(['owned', 'rented']),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  policeVerificationExpiry: z.string().min(1, 'Police verification expiry is required'),
  paymentMode: z.enum(['per-trip', 'daily', 'monthly', 'fuel-basis']),
  salary: z.number().min(0, 'Salary must be positive'),
});

type DriverFormData = z.infer<typeof driverSchema>;

export const CreateDriver: React.FC = () => {
  const navigate = useNavigate();
  const { addDriver } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      salary: 0,
    }
  });

  const onSubmit = async (data: DriverFormData) => {
    try {
      const driverData = {
        ...data,
        advances: [],
        status: 'active' as const,
      };

      addDriver(driverData);
      toast.success('Driver created successfully!');
      navigate('/drivers');
  } catch {
      toast.error('Failed to create driver');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/drivers')}
        >
          <Icon name="back" className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Driver</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Driver Information</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('name')}
                label="Full Name"
                error={errors.name?.message}
                placeholder="Enter driver's full name"
              />

              <Input
                {...register('phone')}
                label="Phone Number"
                error={errors.phone?.message}
                placeholder="Enter phone number"
              />

              <Input
                {...register('licenseNumber')}
                label="License Number"
                error={errors.licenseNumber?.message}
                placeholder="Enter driving license number"
              />

              <Input
                {...register('aadhaar')}
                label="Aadhaar Number"
                error={errors.aadhaar?.message}
                placeholder="Enter Aadhaar number"
              />
            </div>

            {/* Vehicle & Employment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                {...register('vehicleType')}
                label="Vehicle Ownership"
                error={errors.vehicleType?.message}
                placeholder="Select vehicle type"
                options={[
                  { value: 'owned', label: 'Own Vehicle' },
                  { value: 'rented', label: 'Company Vehicle' }
                ]}
              />

              <Select
                {...register('paymentMode')}
                label="Payment Mode"
                error={errors.paymentMode?.message}
                placeholder="Select payment mode"
                options={[
                  { value: 'per-trip', label: 'Per Trip' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'fuel-basis', label: 'Fuel Basis' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                {...register('salary', { valueAsNumber: true })}
                type="number"
                step="0.01"
                label="Salary/Rate Amount"
                error={errors.salary?.message}
                placeholder="0.00"
              />

              <Input
                {...register('licenseExpiry')}
                type="date"
                label="License Expiry Date"
                error={errors.licenseExpiry?.message}
              />

              <Input
                {...register('policeVerificationExpiry')}
                type="date"
                label="Police Verification Expiry"
                error={errors.policeVerificationExpiry?.message}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/drivers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
              >
                Create Driver
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};