import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { driverReportAPI } from '../../services/api';
import { DriverReportEntry } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const today = new Date();

export const DriverManagementPage: React.FC = () => {
  const { drivers } = useApp();
  const navigate = useNavigate();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [loadingDriverId, setLoadingDriverId] = useState<string | null>(null);
  const [reportsByDriver, setReportsByDriver] = useState<Record<string, DriverReportEntry[]>>({});

  const load = async (driverId: string) => {
    try {
      setLoadingDriverId(driverId);
      const list = await driverReportAPI.listForDriverMonth(driverId, year, month);
      setReportsByDriver(prev => ({ ...prev, [driverId]: list }));
    } catch { toast.error('Failed loading reports'); } finally { setLoadingDriverId(null); }
  };

  useEffect(()=>{
    drivers.forEach(d=>load(d.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[year, month, drivers.length]);

  const monthOptions = Array.from({ length: 12 }).map((_,i)=>(<option value={i} key={i}>{format(new Date(2024, i, 1), 'MMM')}</option>));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button title='Back' variant="outline" onClick={()=>navigate('/drivers')}><Icon name="back" className="h-4 w-4 mr-1"/>Back</Button>
          <h1 className="text-2xl font-bold">Driver Management</h1>
        </div>
        <div className="flex gap-2 items-end">
          <label className="text-xs text-gray-600 flex flex-col">Month
            <select aria-label="Month" title="Month" value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="border-gray-300 rounded-md text-sm mt-1">
              {monthOptions}
            </select>
          </label>
          <label className="text-xs text-gray-600 flex flex-col">Year
            <input type="number" aria-label="Year" title="Year" value={year} onChange={e=>setYear(parseInt(e.target.value)||year)} className="w-24 border-gray-300 rounded-md text-sm mt-1" />
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map(d => {
          const entries = reportsByDriver[d.id] || [];
          const totalKm = entries.reduce((sum,e)=>sum+(e.totalKm||0),0);
          const totalDays = entries.reduce((s,e)=>s+(e.daysWorked||0),0);
            const totalNights = entries.reduce((s,e)=>s+(e.nightsWorked||0),0);
          const totalAmount = entries.reduce((s,e)=>s+(e.totalAmount||0),0);
          return (
            <div key={d.id} className="border rounded-md p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.phone}</p>
                </div>
                      <Button title='Manage' size="sm" variant="outline" onClick={()=>navigate(`/drivers/management/${d.id}`)}>Manage</Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">Km: <span className="font-medium">{totalKm}</span></div>
                <div className="p-2 bg-gray-50 rounded">Days: <span className="font-medium">{totalDays}</span></div>
                <div className="p-2 bg-gray-50 rounded">Nights: <span className="font-medium">{totalNights}</span></div>
                <div className="p-2 bg-gray-50 rounded">Amount: <span className="font-medium">₹{totalAmount.toLocaleString()}</span></div>
              </div>
              {loadingDriverId===d.id && <p className="text-[10px] text-gray-500 mt-2">Loading...</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
