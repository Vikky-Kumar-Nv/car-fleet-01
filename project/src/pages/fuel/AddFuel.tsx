import React, { useEffect, useState } from 'react';
import { vehicleAPI, bookingAPI, fuelAPI } from '../../services/api';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Icon } from '../../components/ui/Icon';
import { useNavigate } from 'react-router-dom';

interface Option { id: string; label: string; }

const AddFuel: React.FC = () => {
  // user context (reserved for future role-based logic)
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Option[]>([]);
  const [bookings, setBookings] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicleId: '',
    bookingId: '',
    addedByType: 'self',
    fuelFillDate: new Date().toISOString().substring(0,16), // datetime-local
    totalTripKm: '',
    vehicleFuelAverage: '',
    fuelQuantity: '',
    fuelRate: '',
    totalAmount: 0,
    comment: '',
    includeInFinance: true,
  });
  // simple inline validation, errors not stored persistently in refactored version

  useEffect(()=>{ (async()=>{
    try {
      const v = await vehicleAPI.list();
      setVehicles(v.map(x=>({ id: x.id, label: x.registrationNumber })));
      const b = await bookingAPI.list();
      setBookings(b.map(x=>({ id: x.id, label: `${x.pickupLocation} -> ${x.dropLocation}` })));
    } catch { /* ignore */ }
  })(); },[]);

  useEffect(()=>{
    const qty = parseFloat(form.fuelQuantity)||0;
    const rate = parseFloat(form.fuelRate)||0;
    setForm(f=>({ ...f, totalAmount: +(qty*rate).toFixed(2) }));
  },[form.fuelQuantity, form.fuelRate]);

  // Auto-calc fuel quantity when trip km & average provided
  useEffect(()=>{
    const km = parseFloat(form.totalTripKm);
    const avg = parseFloat(form.vehicleFuelAverage);
    if(!isNaN(km) && km>0 && !isNaN(avg) && avg>0){
      const autoQty = +(km/avg).toFixed(2);
      setForm(f=> f.fuelQuantity === String(autoQty) ? f : { ...f, fuelQuantity: String(autoQty) });
    } else {
      // if inputs cleared, reset quantity only if it matches previous auto value (avoid overriding manual edits, though manual not allowed now)
      // We treat fuelQuantity as derived; clear when insufficient data
      setForm(f=> ({ ...f, fuelQuantity: '' }));
    }
  },[form.totalTripKm, form.vehicleFuelAverage]);

  function validate(){
    const e: Record<string,string> = {};
    (['vehicleId','bookingId','fuelFillDate','totalTripKm','vehicleFuelAverage','fuelQuantity','fuelRate'] as const).forEach(k=>{
      if(!(form as Record<string,unknown>)[k]) e[k] = 'Required';
    });
    if (form.totalTripKm && isNaN(Number(form.totalTripKm))) e.totalTripKm = 'Number';
    if (form.vehicleFuelAverage && isNaN(Number(form.vehicleFuelAverage))) e.vehicleFuelAverage = 'Number';
    if (form.fuelQuantity && isNaN(Number(form.fuelQuantity))) e.fuelQuantity = 'Number';
    if (form.fuelRate && isNaN(Number(form.fuelRate))) e.fuelRate = 'Number';
  return Object.keys(e).length===0;
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!validate()) return;
    setLoading(true);
    try {
      await fuelAPI.create({
        vehicleId: form.vehicleId,
        bookingId: form.bookingId,
        addedByType: form.addedByType as 'self'|'driver',
        fuelFillDate: new Date(form.fuelFillDate).toISOString(),
        totalTripKm: Number(form.totalTripKm),
        vehicleFuelAverage: Number(form.vehicleFuelAverage),
        fuelQuantity: Number(form.fuelQuantity),
        fuelRate: Number(form.fuelRate),
        comment: form.comment || undefined,
        includeInFinance: form.includeInFinance,
      });
      setForm(f=>({ ...f, fuelQuantity:'', fuelRate:'', totalAmount:0, comment:'' }));
      alert('Fuel entry saved');
    } catch (err) {
      console.error('Fuel save failed', err);
      alert('Failed to save fuel entry');
    } finally { setLoading(false); }
  }

  function update<K extends keyof typeof form>(key: K, value: string | number | boolean){ setForm(f=>({ ...f, [key]: value })); }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" type="button" onClick={()=>navigate('/fuel')}>
          <Icon name="back" className="h-4 w-4 mr-2"/>Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add Fuel Entry</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Fuel Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select label="Vehicle *" value={form.vehicleId} onChange={e=>update('vehicleId', e.target.value)} options={vehicles.map(v=>({ value:v.id, label:v.label }))} placeholder="Select vehicle" />
              <Select label="Trip / Booking *" value={form.bookingId} onChange={e=>update('bookingId', e.target.value)} options={bookings.map(b=>({ value:b.id, label:b.label }))} placeholder="Select trip" />
              <Select label="Added By *" value={form.addedByType} onChange={e=>update('addedByType', e.target.value)} options={[{value:'self',label:'Self'},{value:'driver',label:'Driver'}]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Input label="Fuel Fill Date *" type="datetime-local" value={form.fuelFillDate} onChange={e=>update('fuelFillDate', e.target.value)} />
              <Input label="Total Trip Km *" value={form.totalTripKm} onChange={e=>update('totalTripKm', e.target.value)} placeholder="e.g. 250" />
              <Input label="Average (km/L) *" value={form.vehicleFuelAverage} onChange={e=>update('vehicleFuelAverage', e.target.value)} placeholder="e.g. 12.5" />
              <Input label="Fuel Quantity (L)" value={form.fuelQuantity} readOnly placeholder="Auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Fuel Rate *" value={form.fuelRate} onChange={e=>update('fuelRate', e.target.value)} placeholder="Rate" />
              <Input label="Total Amount" value={String(form.totalAmount)} readOnly />
              <div className="flex items-center mt-6 space-x-2">
                <input id="includeFinance" type="checkbox" checked={form.includeInFinance} onChange={e=>update('includeInFinance', e.target.checked)} className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                <label htmlFor="includeFinance" className="text-sm text-gray-700">Include in income/expenses</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea value={form.comment} onChange={e=>update('comment', e.target.value)} rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Optional comment" />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={()=>navigate('/fuel')}>Cancel</Button>
              <Button type="submit" disabled={loading} loading={loading}><Icon name="plus" className="h-4 w-4 mr-2"/>Save Fuel Entry</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFuel;
