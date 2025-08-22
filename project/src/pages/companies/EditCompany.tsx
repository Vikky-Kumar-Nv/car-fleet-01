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
import { Icon } from '../../components/ui/Icon';
import { Company } from '../../types';

const companyEditSchema = z.object({
  name: z.string().min(1),
  gst: z.string().min(5),
  address: z.string().min(1),
  contactPerson: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().email(),
  outstandingAmount: z.number().min(0)
});

type CompanyEditForm = z.infer<typeof companyEditSchema>;

export const EditCompany: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { companies, updateCompany } = useApp();
  const company = companies.find(c => c.id === id);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyEditForm>({
    resolver: zodResolver(companyEditSchema),
    defaultValues: company ? {
      name: company.name,
      gst: company.gst,
      address: company.address,
      contactPerson: company.contactPerson,
      phone: company.phone,
      email: company.email,
      outstandingAmount: company.outstandingAmount
    } : undefined
  });

  if (!company) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Company not found.</p>
        <Button onClick={() => navigate('/companies')}>Back</Button>
      </div>
    );
  }

  const onSubmit = (data: CompanyEditForm) => {
    updateCompany(company.id, data as Partial<Company>);
    toast.success('Company updated');
    navigate(`/companies/${company.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Icon name="back" className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input {...register('name')} label="Name" error={errors.name?.message} />
              <Input {...register('gst')} label="GST" error={errors.gst?.message} />
            </div>
            <Input {...register('address')} label="Address" error={errors.address?.message} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input {...register('contactPerson')} label="Contact Person" error={errors.contactPerson?.message} />
              <Input {...register('phone')} label="Phone" error={errors.phone?.message} />
              <Input type="email" {...register('email')} label="Email" error={errors.email?.message} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input type="number" step="1" {...register('outstandingAmount', { valueAsNumber: true })} label="Outstanding (₹)" error={errors.outstandingAmount?.message} />
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
