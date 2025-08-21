import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { driverReportAPI } from '../../services/api';
import { DriverReportEntry } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const DriverManagementDetailPage: React.FC = () => {
  const { id } = useParams();
  const driverId = id as string;
  const { drivers } = useApp();
  const navigate = useNavigate();
  const driver = drivers.find(d=>d.id===driverId);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState<DriverReportEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [form, setForm] = useState<Partial<DriverReportEntry>>({});
  // (future) loading state removed to satisfy linter

  const entryRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    if (!driverId) return;
    try {
      const list = await driverReportAPI.listForDriverMonth(driverId, year, month);
      setEntries(list);
    } catch { toast.error('Load failed'); }
  }, [driverId, year, month]);
  useEffect(()=>{ load(); }, [load]);

  const editExisting = (entry: DriverReportEntry) => {
    setSelectedDate(entry.date.slice(0,10));
    setForm(entry);
  };

  const jumpToEntry = () => {
    requestAnimationFrame(()=>{
      entryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleChange = (field: keyof DriverReportEntry, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    if (!driverId || !selectedDate) return;
    try {
      const payload = {
        date: selectedDate,
        totalKm: form.totalKm ?? 0,
        daysWorked: form.daysWorked ?? 0,
        nightsWorked: form.nightsWorked ?? 0,
        nightAmount: form.nightAmount ?? 0,
        salaryRate: form.salaryRate ?? driver?.salary,
        totalAmount: form.totalAmount ?? ((form.daysWorked||0) * (form.salaryRate || driver?.salary || 0) + (form.nightAmount||0)),
        notes: form.notes
      };
      const saved = await driverReportAPI.upsert(driverId, payload);
      toast.success('Saved');
      // refresh
      load();
      // sync form with saved
      setForm(saved);
    } catch { toast.error('Save failed'); }
  };

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }).map((_,i)=>{
    const date = new Date(year, month, i+1).toISOString().slice(0,10);
    const entry = entries.find(e=>e.date.slice(0,10)===date);
    return { date, entry };
  });

  const monthOptions = Array.from({ length: 12 }).map((_,i)=>(<option value={i} key={i}>{format(new Date(2024, i, 1), 'MMM')}</option>));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
                  <Button title='Back' variant="outline" onClick={()=>navigate('/drivers/management')}><Icon name="back" className="h-4 w-4 mr-1"/>Back</Button>
          <h1 className="text-2xl font-bold">{driver?.name || 'Driver'} - Management</h1>
        </div>
        <div className="flex gap-2 items-end">
          <label className="text-xs text-gray-600 flex flex-col">Month
            <select aria-label="Month" title="Month" value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="border-gray-300 rounded-md text-sm mt-1">
              {monthOptions}
            </select>
          </label>
          <label className="text-xs text-gray-600 flex flex-col">Year
            <input  type="number" aria-label="Year" title="Year" value={year} onChange={e=>setYear(parseInt(e.target.value)||year)} className="w-24 border-gray-300 rounded-md text-sm mt-1" />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-2 py-1 text-left">Date</th>
              <th className="px-2 py-1">Km</th>
              <th className="px-2 py-1">Days</th>
              <th className="px-2 py-1">Nights</th>
              <th className="px-2 py-1">Night Amt</th>
              <th className="px-2 py-1">Salary Rate</th>
              <th className="px-2 py-1">Total Amount</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {monthDays.map(d => (
              <tr key={d.date} className={"border-b hover:bg-amber-50 " + (selectedDate===d.date ? 'bg-amber-100' : '')}>
                <td className="px-2 py-1 text-left whitespace-nowrap cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.date}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.totalKm || '-'}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.daysWorked || '-'}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.nightsWorked || '-'}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.nightAmount || '-'}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.salaryRate || '-'}</td>
                <td className="px-2 py-1 text-center cursor-pointer" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); }}>{d.entry?.totalAmount || '-'}</td>
                <td className="px-2 py-1 text-center">
                  <button type="button" title='Delete' className="text-amber-600 hover:underline text-xs" onClick={()=>{ setSelectedDate(d.date); editExisting(d.entry || { driverId, date: d.date }); jumpToEntry(); }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={entryRef} className="border rounded-md p-4 space-y-4 bg-white shadow-sm">
        <h2 className="font-semibold">Entry - {selectedDate}</h2>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <label className="flex flex-col text-xs">Total Km
            <input title='Total Km' type="number" value={form.totalKm ?? ''} onChange={e=>handleChange('totalKm', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs">Days Worked
                      <input title='Days Worked' type="number" value={form.daysWorked ?? ''} onChange={e=>handleChange('daysWorked', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs">Nights Worked
            <input title='Nights Worked' type="number" value={form.nightsWorked ?? ''} onChange={e=>handleChange('nightsWorked', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs">Night Amount
             <input title='Night Amount' type="number" value={form.nightAmount ?? ''} onChange={e=>handleChange('nightAmount', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs">Salary Rate
            <input type="number" title='Salary Rate' value={form.salaryRate ?? driver?.salary ?? ''} onChange={e=>handleChange('salaryRate', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs">Total Amount
            <input title='Total Amount' type="number" value={form.totalAmount ?? ''} onChange={e=>handleChange('totalAmount', parseFloat(e.target.value)||0)} className="mt-1 border-gray-300 rounded"/>
          </label>
          <label className="flex flex-col text-xs md:col-span-2">Notes
            <input title='Notes' value={form.notes ?? ''} onChange={e=>handleChange('notes', e.target.value)} className="mt-1 border-gray-300 rounded"/>
          </label>
        </div>
        <div className="flex gap-2">
                  <Button title='Save' onClick={save}><Icon name="file" className="h-4 w-4 mr-1"/>Save</Button>
          <Button variant="outline" onClick={()=>{ setForm({}); }}><Icon name="close" className="h-4 w-4 mr-1"/>Clear</Button>
        </div>
      </div>
    </div>
  );
};
