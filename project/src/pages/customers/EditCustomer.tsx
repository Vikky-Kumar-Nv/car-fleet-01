import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { companyAPI } from '../../services/api';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const customerSchema = z.object({
  customerType: z.enum(['random','company']),
  companyId: z.string().optional(),
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Phone required'),
  email: z.string().email('Invalid email').optional().or(z.literal('').transform(()=>undefined)),
  address: z.string().optional(),
}).refine(d => d.customerType === 'random' || (d.customerType==='company' && !!d.companyId), { message:'Select company', path:['companyId'] });

type CustomerForm = z.infer<typeof customerSchema>;

export const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, updateCustomer } = useApp();
  const navigate = useNavigate();

  const customer = customers.find(c => c.id === id);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<CustomerForm>({ resolver: zodResolver(customerSchema) });
  const customerType = watch('customerType');
  const [companies,setCompanies] = React.useState<{ id:string; label:string }[]>([]);
  React.useEffect(()=>{ (async()=>{ try { const list = await companyAPI.list(); setCompanies(list.map(c=>({ id:c.id, label:c.name }))); } catch(e){ console.warn('Load companies failed', e);} })(); },[]);

  useEffect(() => {
    if (customer) {
      reset({ name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, customerType: customer.companyId ? 'company':'random', companyId: customer.companyId });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerForm) => {
    if (!id) return;
    try {
  const { customerType, companyId, ...rest } = data;
  await updateCustomer(id, { ...rest, companyId: customerType==='company' ? companyId : undefined });
      toast.success('Customer updated');
      navigate(`/customers/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  if (!customer) return <div className="p-6 text-gray-500">Customer not found (maybe refresh?)</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={()=>navigate(`/customers/${id}`)}>Back</Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Customer Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Customer Type" value={customerType || (customer?.companyId?'company':'random')} onChange={e=>{ const val = e.target.value as 'random'|'company'; setValue('customerType', val); if(val==='random') setValue('companyId', undefined); }} options={[{ value:'random', label:'Random' }, { value:'company', label:'Company' }]} />
              { (customerType || (customer?.companyId?'company':'random')) === 'company' && (
                <Select label="Company" value={watch('companyId')||''} onChange={e=> setValue('companyId', e.target.value)} options={companies.map(c=>({ value:c.id, label:c.label }))} placeholder="Select company" />
              ) }
              <Input {...register('name')} label="Name" error={errors.name?.message} placeholder="Full name" />
              <Input {...register('phone')} label="Phone" error={errors.phone?.message} placeholder="Phone number" />
              <Input {...register('email')} label="Email" error={errors.email?.message} placeholder="email@example.com" />
              <Input {...register('address')} label="Address" error={errors.address?.message} placeholder="Address" />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={()=>navigate(`/customers/${id}`)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting}>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
