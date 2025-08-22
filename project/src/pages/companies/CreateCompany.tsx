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
import { Icon } from '../../components/ui/Icon';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  gst: z.string().min(15, 'Valid GST number is required'),
  address: z.string().min(1, 'Address is required'),
  contactPerson: z.string().min(1, 'Contact person name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const CreateCompany: React.FC = () => {
  const navigate = useNavigate();
  const { addCompany } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const companyData = {
        ...data,
        outstandingAmount: 0,
      };

      addCompany(companyData);
      toast.success('Company created successfully!');
      navigate('/companies');
  } catch {
      toast.error('Failed to create company');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/companies')}
        >
          <Icon name="back" className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Company</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('name')}
                label="Company Name"
                error={errors.name?.message}
                placeholder="Enter company name"
              />

              <Input
                {...register('gst')}
                label="GST Number"
                error={errors.gst?.message}
                placeholder="Enter GST number"
              />
            </div>

            <Input
              {...register('address')}
              label="Address"
              error={errors.address?.message}
              placeholder="Enter complete address"
            />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  {...register('contactPerson')}
                  label="Contact Person"
                  error={errors.contactPerson?.message}
                  placeholder="Enter contact person name"
                />

                <Input
                  {...register('phone')}
                  label="Phone Number"
                  error={errors.phone?.message}
                  placeholder="Enter phone number"
                />

                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  error={errors.email?.message}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/companies')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
              >
                Create Company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};