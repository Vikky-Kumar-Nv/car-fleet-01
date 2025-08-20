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

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  bookingSource: z.enum(['company', 'travel-agency', 'individual']),
  companyId: z.string().optional(),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropLocation: z.string().min(1, 'Drop location is required'),
  journeyType: z.enum(['outstation', 'local', 'one-way', 'round-trip']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  tariffRate: z.number().min(0, 'Tariff rate must be positive'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  advanceReceived: z.number().min(0, 'Advance must be positive'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const { addBooking, drivers, vehicles, companies } = useApp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tariffRate: 0,
      totalAmount: 0,
      advanceReceived: 0,
    }
  });

  const bookingSource = watch('bookingSource');
  const totalAmount = watch('totalAmount');
  const advanceReceived = watch('advanceReceived');

  // Calculate balance automatically
  React.useEffect(() => {
    // Balance derived value (totalAmount - advanceReceived) can be displayed later if needed
  }, [totalAmount, advanceReceived]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const bookingData = {
        ...data,
        balance: data.totalAmount - data.advanceReceived,
        status: 'booked' as const,
        expenses: [],
        billed: false,
        statusHistory: [{
          id: '1',
          status: 'booked' as const,
          timestamp: new Date().toISOString(),
          changedBy: 'Dispatcher'
        }]
      };

      await addBooking(bookingData); // wait so list has proper id + assignments
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create booking');
    }
  };

  const driverOptions = drivers
    .filter(d => d.status === 'active')
    .map(driver => ({
      value: driver.id,
      label: driver.name
    }));

  const vehicleOptions = vehicles
    .filter(v => v.status === 'active')
    .map(vehicle => ({
      value: vehicle.id,
      label: `${vehicle.registrationNumber} (${vehicle.category})`
    }));

  const companyOptions = companies.map(company => ({
    value: company.id,
    label: company.name
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/bookings')}
        >
          <Icon name="back" className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('customerName')}
                label="Customer Name"
                error={errors.customerName?.message}
                placeholder="Enter customer name"
              />

              <Input
                {...register('customerPhone')}
                label="Customer Phone"
                error={errors.customerPhone?.message}
                placeholder="Enter phone number"
              />
            </div>

            {/* Booking Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                {...register('bookingSource')}
                label="Booking Source"
                error={errors.bookingSource?.message}
                placeholder="Select booking source"
                options={[
                  { value: 'company', label: 'Company' },
                  { value: 'travel-agency', label: 'Travel Agency' },
                  { value: 'individual', label: 'Individual' }
                ]}
              />

              {(bookingSource === 'company' || bookingSource === 'travel-agency') && (
                <Select
                  {...register('companyId')}
                  label={bookingSource === 'company' ? 'Company' : 'Agency'}
                  error={errors.companyId?.message}
                  placeholder={`Select ${bookingSource === 'company' ? 'company' : 'agency'}`}
                  options={companyOptions}
                />
              )}
            </div>

            {/* Journey Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('pickupLocation')}
                label="Pickup Location"
                error={errors.pickupLocation?.message}
                placeholder="Enter pickup location"
              />

              <Input
                {...register('dropLocation')}
                label="Drop Location"
                error={errors.dropLocation?.message}
                placeholder="Enter drop location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                {...register('journeyType')}
                label="Journey Type"
                error={errors.journeyType?.message}
                placeholder="Select journey type"
                options={[
                  { value: 'outstation', label: 'Outstation' },
                  { value: 'local', label: 'Local' },
                  { value: 'one-way', label: 'One Way' },
                  { value: 'round-trip', label: 'Round Trip' }
                ]}
              />

              <Input
                {...register('startDate')}
                type="datetime-local"
                label="Start Date & Time"
                error={errors.startDate?.message}
              />

              <Input
                {...register('endDate')}
                type="datetime-local"
                label="End Date & Time"
                error={errors.endDate?.message}
              />
            </div>

            {/* Vehicle and Driver Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                {...register('vehicleId')}
                label="Assign Vehicle (Optional)"
                error={errors.vehicleId?.message}
                placeholder="Select vehicle"
                options={vehicleOptions}
              />

              <Select
                {...register('driverId')}
                label="Assign Driver (Optional)"
                error={errors.driverId?.message}
                placeholder="Select driver"
                options={driverOptions}
              />
            </div>

            {/* Tariff and Payment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                {...register('tariffRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                label="Tariff Rate (per km/hour)"
                error={errors.tariffRate?.message}
                placeholder="0.00"
              />

              <Input
                {...register('totalAmount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                label="Total Amount"
                error={errors.totalAmount?.message}
                placeholder="0.00"
              />

              <Input
                {...register('advanceReceived', { valueAsNumber: true })}
                type="number"
                step="0.01"
                label="Advance Received"
                error={errors.advanceReceived?.message}
                placeholder="0.00"
              />
            </div>

            {/* Balance Display */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Balance Amount: </span>
                ₹{(totalAmount - advanceReceived).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/bookings')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
              >
                Create Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};