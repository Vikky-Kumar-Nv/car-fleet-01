import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export const DriverProfile: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { drivers, payments, settleDriverAdvance, addDriverAdvance } = useApp();
  const [advAmount, setAdvAmount] = React.useState('');
  const [advDesc, setAdvDesc] = React.useState('');
  const driver = drivers.find(d => d.id === id);

  if (!driver) {
    return (
      <div className='space-y-4'>
        <p className='text-gray-600'>Driver not found.</p>
        <Button onClick={() => navigate('/drivers')}>Back</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
  <Button variant='outline' onClick={() => navigate('/drivers')}><Icon name='back' className='h-4 w-4 mr-2'/>Back</Button>
        <h1 className='text-3xl font-bold text-gray-900'>{driver.name}</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold text-gray-900'>Basic Info</h2>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div><span className='font-medium'>Phone:</span> {driver.phone}</div>
          <div><span className='font-medium'>License #:</span> {driver.licenseNumber}</div>
          <div><span className='font-medium'>Aadhaar:</span> {driver.aadhaar}</div>
          <div><span className='font-medium'>Vehicle Type:</span> {driver.vehicleType}</div>
          <div><span className='font-medium'>Payment Mode:</span> {driver.paymentMode}</div>
          <div><span className='font-medium'>Salary/Rate:</span> ₹{driver.salary.toLocaleString()}</div>
          <div><span className='font-medium'>License Expiry:</span> {driver.licenseExpiry}</div>
          <div><span className='font-medium'>Police Verification Expiry:</span> {driver.policeVerificationExpiry}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold text-gray-900'>Advances</h2>
        </CardHeader>
        <CardContent className='space-y-3 text-sm'>
          <div className='flex flex-col md:flex-row md:items-end md:space-x-3 space-y-2 md:space-y-0'>
            <div className='flex-1'>
              <label className='block text-xs font-medium text-gray-500 mb-1'>Amount</label>
              <input aria-label='Advance amount' value={advAmount} onChange={e=>setAdvAmount(e.target.value)} type='number' className='w-full border rounded px-2 py-1 text-sm'/>
            </div>
            <div className='flex-1'>
              <label className='block text-xs font-medium text-gray-500 mb-1'>Description</label>
              <input aria-label='Advance description' value={advDesc} onChange={e=>setAdvDesc(e.target.value)} placeholder='Advance reason' className='w-full border rounded px-2 py-1 text-sm'/>
            </div>
            <Button size='sm' disabled={!advAmount} onClick={()=>{ addDriverAdvance(driver.id, { amount: parseFloat(advAmount), date: new Date().toISOString().slice(0,10), description: advDesc || 'Advance' }); setAdvAmount(''); setAdvDesc(''); }}>
              <Icon name='plus' className='h-4 w-4 mr-1'/> Add
            </Button>
          </div>
          {driver.advances.length === 0 && <p className='text-gray-500'>No advances.</p>}
          {driver.advances.map(a => {
            const settlementPayment = payments.find(p => p.relatedAdvanceId === a.id);
            return (
              <div key={a.id} className='flex items-center justify-between p-2 border rounded-md'>
                <div>
                  <p className='font-medium'>₹{a.amount.toLocaleString()} {a.settled && <span className='text-green-600'>(Settled)</span>}</p>
                  <p className='text-xs text-gray-500'>{a.description} • {a.date}</p>
                  {settlementPayment && <p className='text-xs text-green-600'>Settled on {new Date(settlementPayment.date).toLocaleDateString()}</p>}
                </div>
                {!a.settled && (
                  <Button size='sm' variant='outline' onClick={() => settleDriverAdvance(driver.id, a.id)}>
                    <Icon name='success' className='h-4 w-4 mr-1'/> Settle
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold text-gray-900'>Recent Payments</h2>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
          {payments.filter(p => p.entityType==='driver' && p.entityId===driver.id).slice(-5).reverse().map(p => (
            <div key={p.id} className='flex items-center justify-between p-2 bg-gray-50 rounded'>
              <div>
                <p className='font-medium'>{p.description || 'Payment'} {p.relatedAdvanceId && <span className='text-xs text-green-600'>(Advance)</span>}</p>
                <p className='text-xs text-gray-500'>{new Date(p.date).toLocaleDateString()}</p>
              </div>
              <span className={p.type==='paid'?'text-red-600':'text-green-600'}>
                {p.type==='paid' ? '-' : '+'}₹{p.amount.toLocaleString()}
              </span>
            </div>
          ))}
          {payments.filter(p => p.entityType==='driver' && p.entityId===driver.id).length===0 && <p className='text-gray-500'>No payments yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
};
