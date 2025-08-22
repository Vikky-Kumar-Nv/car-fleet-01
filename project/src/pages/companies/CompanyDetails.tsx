import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';
import { companyAPI } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export const CompanyDetails: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { companies, payments, recordCompanyPayment, bookings } = useApp();
  const [quickAmount, setQuickAmount] = useState('');
  const [desc, setDesc] = useState('');
  interface RemoteCompany { id?: string; _id?: string; name: string; gst: string; address: string; contactPerson: string; phone: string; email: string; outstandingAmount: number; createdAt: string; }
  interface RemoteBooking { id?: string; _id?: string; pickupLocation: string; dropLocation: string; startDate: string | Date; status: string; totalAmount: number; expenses?: { amount: number }[]; }
  interface RemotePayment { id?: string; _id?: string; amount: number; type: string; date: string; description?: string; }
  const [remoteCompany, setRemoteCompany] = useState<RemoteCompany | null>(null);
  const [metrics, setMetrics] = useState<{ bookings: number; revenue: number; expenses: number; completed: number; outstanding: number } | null>(null);
  const [remoteBookings, setRemoteBookings] = useState<RemoteBooking[]>([]);
  const [remotePayments, setRemotePayments] = useState<RemotePayment[]>([]);
  const localCompany = companies.find(c => c.id === id);

  // Fetch backend overview
  useEffect(() => {
    if (!id) return;
    companyAPI.overview(id)
      .then(data => {
        setRemoteCompany(data.company);
        setMetrics(data.metrics);
        setRemoteBookings(data.bookings);
        setRemotePayments(data.payments);
      })
      .catch(err => {
        console.error('Failed to load company overview, falling back to local', err);
  });
  }, [id]);

  const company = remoteCompany || localCompany;
  const companyId: string | undefined = (company && ('id' in company ? (company as Company).id : (company as RemoteCompany)._id)) || undefined;
  const companyBookings = (remoteBookings.length ? remoteBookings : bookings.filter(b => b.companyId === company?.id));
  const paymentsForCompany = (remotePayments.length ? remotePayments : payments.filter(p=>p.entityType==='customer' && p.entityId===company?.id));

  if (!company) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Company not found.</p>
        <Button onClick={() => navigate('/companies')}>Back</Button>
      </div>
    );
  }
  const companyRevenue = metrics ? metrics.revenue : companyBookings.reduce((sum: number, b: RemoteBooking) => sum + b.totalAmount, 0);
  const companyExpenses = metrics ? metrics.expenses : companyBookings.reduce((sum: number, b: RemoteBooking) => sum + (b.expenses?.reduce((eSum: number,e)=>eSum+e.amount,0) || 0), 0);
  const completedTrips = metrics ? metrics.completed : companyBookings.filter((b: RemoteBooking) => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/companies')}>
          <Icon name="back" className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
        <Button variant="outline" onClick={() => navigate(`/companies/${company.id}/edit`)}>
            <Icon name="edit" className="h-4 w-4 mr-2" /> Edit
        </Button>
      </div>
  <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Company Info</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">GST:</span> {company.gst}</div>
          <div><span className="font-medium">Contact:</span> {company.contactPerson}</div>
          <div><span className="font-medium">Phone:</span> {company.phone}</div>
          <div><span className="font-medium">Email:</span> {company.email}</div>
          <div className="md:col-span-2"><span className="font-medium">Address:</span> {company.address}</div>
          <div><span className="font-medium">Outstanding:</span> ₹{(metrics?metrics.outstanding:company.outstandingAmount).toLocaleString()}</div>
          <div><span className="font-medium">Created:</span> {company.createdAt.slice(0,10)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Usage & Performance</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-amber-600">{companyBookings.length}</p>
            <p className="text-xs text-gray-500">Bookings</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">₹{companyRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-600">₹{companyExpenses.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Expenses</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-700">{completedTrips}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p className="text-xl font-bold text-orange-600">₹{company.outstandingAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Outstanding</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Record Payment</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Amount" type="number" value={quickAmount} onChange={e=>setQuickAmount(e.target.value)} />
            <Input label="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
            <div className="flex items-end">
              <Button disabled={!quickAmount || !companyId} onClick={()=>{ if(companyId){ recordCompanyPayment(companyId, parseFloat(quickAmount), desc); setQuickAmount(''); setDesc(''); } }}>
                <Icon name="money" className="h-4 w-4 mr-2"/> Save
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">Recording a payment reduces outstanding amount automatically.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {paymentsForCompany.slice(0,10).map(p => (
            <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{p.description || 'Payment'}</p>
                <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
              </div>
              <span className={p.type==='received'?'text-green-600':'text-red-600'}>
                {p.type==='received'?'+':'-'}₹{p.amount.toLocaleString()}
              </span>
            </div>
          ))}
          {paymentsForCompany.length===0 && <p className="text-gray-500">No payments yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
      {companyBookings.slice(0,5).map((b: RemoteBooking) => (
            <div key={b.id || b._id} className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">#{(b.id||b._id)?.toString().slice(-6)} {b.pickupLocation} → {b.dropLocation}</p>
                <p className="text-xs text-gray-500">{new Date(b.startDate).toLocaleDateString()} • {b.status}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">₹{b.totalAmount.toLocaleString()}</p>
        <p className="text-xs text-red-600">₹{(b.expenses?.reduce((s:number,e)=>s+e.amount,0)||0).toLocaleString()} exp</p>
              </div>
            </div>
          ))}
          {companyBookings.length === 0 && <p className="text-gray-500">No bookings for this company.</p>}
        </CardContent>
      </Card>
    </div>
  );
};
