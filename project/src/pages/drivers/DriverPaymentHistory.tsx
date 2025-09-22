import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { financeAPI } from '../../services/api';
import { DriverFinancePayment } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

type GroupMode = 'none' | 'day' | 'month';
type ModeFilter = 'all' | 'per-trip' | 'daily' | 'fuel-basis';

export const DriverPaymentHistory: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [payments, setPayments] = React.useState<DriverFinancePayment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [modeFilter, setModeFilter] = React.useState<ModeFilter>('all');
  const [groupMode, setGroupMode] = React.useState<GroupMode>('none');
  const [search, setSearch] = React.useState('');
  const [month, setMonth] = React.useState<string>(''); // YYYY-MM
  const [selectedPayment, setSelectedPayment] = React.useState<DriverFinancePayment | null>(null);
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const monthHasData = React.useCallback((y: number, mIndex: number) => {
    // mIndex 0-11
    const key = `${y}-${String(mIndex+1).padStart(2,'0')}`;
    return payments.some(p => p.date.startsWith(key));
  }, [payments]);
  const formattedMonthLabel = React.useMemo(() => {
    if (!month) return 'All Months';
    const date = new Date(month + '-01T00:00:00Z');
    return date.toLocaleString(undefined,{ month: 'long', year: 'numeric' });
  }, [month]);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const list = await financeAPI.getDriverPayments(id);
        setPayments(list);
      } catch (err) {
        console.error('Failed to fetch driver payments', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const filtered = React.useMemo(() => {
    return payments.filter(p => {
      if (modeFilter !== 'all' && p.mode !== modeFilter) return false;
      if (month) {
        const pMonth = new Date(p.date).toISOString().slice(0,7);
        if (pMonth !== month) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        const text = [p.description, p.booking?.pickupLocation, p.booking?.dropLocation].filter(Boolean).join(' ').toLowerCase();
        if (!text.includes(s)) return false;
      }
      return true;
    });
  }, [payments, modeFilter, month, search]);

  interface GroupBucket { key: string; label: string; total: number; count: number; items: DriverFinancePayment[]; }
  const grouped: GroupBucket[] = React.useMemo(() => {
    if (groupMode === 'none') return [];
    const map: Record<string, GroupBucket> = {};
    filtered.forEach(p => {
      const d = new Date(p.date);
      const key = groupMode === 'day' ? d.toISOString().slice(0,10) : d.toISOString().slice(0,7);
      if (!map[key]) {
        map[key] = { key, label: key, total: 0, count: 0, items: [] };
      }
      map[key].total += p.amount;
      map[key].count += 1;
      map[key].items.push(p);
    });
    return Object.values(map).sort((a,b)=> b.key.localeCompare(a.key));
  }, [filtered, groupMode]);

  const displayPayments = groupMode === 'none' ? filtered.sort((a,b)=> b.date.localeCompare(a.date)) : [];

  // Close on escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPayment(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' onClick={()=>navigate(`/drivers/${id}`)}><Icon name='back' className='h-4 w-4 mr-1'/>Back</Button>
          <h1 className='text-2xl font-bold text-gray-900'>Driver Payment History</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Filters</h2>
        </CardHeader>
        <CardContent className='grid md:grid-cols-4 gap-4 text-sm'>
          <div>
            <label className='block text-xs font-medium text-gray-500 mb-1'>Mode</label>
            <select aria-label='Mode filter' value={modeFilter} onChange={e=>setModeFilter(e.target.value as ModeFilter)} className='w-full border rounded px-2 py-1'>
              <option value='all'>All</option>
              <option value='per-trip'>Per Trip</option>
              <option value='daily'>Daily</option>
              <option value='fuel-basis'>Fuel Basis</option>
            </select>
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-500 mb-1'>Group By</label>
            <select aria-label='Group by selector' value={groupMode} onChange={e=>setGroupMode(e.target.value as GroupMode)} className='w-full border rounded px-2 py-1'>
              <option value='none'>None</option>
              <option value='day'>Day</option>
              <option value='month'>Month</option>
            </select>
          </div>
          <div className='relative'>
            <label className='block text-xs font-medium text-gray-500 mb-1'>Month</label>
            <Button variant='outline' size='sm' onClick={()=>setMonthPickerOpen(o=>!o)} aria-expanded={monthPickerOpen} aria-haspopup='dialog' className='w-full justify-between'>
              <span>{formattedMonthLabel}</span>
              <Icon name={monthPickerOpen? 'chevronUp':'chevronDown'} className='h-4 w-4'/>
            </Button>
            {monthPickerOpen && (
              <div className='absolute z-20 mt-1 w-72 bg-white border rounded shadow-lg p-3' role='dialog' aria-label='Select month'>
                <div className='flex items-center justify-between mb-2'>
                  <Button size='sm' variant='outline' onClick={()=>setYear(y=>y-1)}><Icon name='chevronLeft' className='h-4 w-4'/></Button>
                  <span className='font-medium'>{year}</span>
                  <Button size='sm' variant='outline' onClick={()=>setYear(y=>y+1)}><Icon name='chevronRight' className='h-4 w-4'/></Button>
                </div>
                <div className='grid grid-cols-3 gap-2 text-xs'>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((lbl, idx) => {
                    const key = `${year}-${String(idx+1).padStart(2,'0')}`;
                    const active = month === key;
                    const has = monthHasData(year, idx);
                    return (
                      <button
                        key={key}
                        onClick={() => { setMonth(key); setMonthPickerOpen(false); }}
                        className={[
                          'px-2 py-2 rounded border flex flex-col items-center gap-1',
                          active ? 'bg-amber-600 text-white border-amber-600' : 'bg-white hover:bg-amber-50',
                          has ? 'shadow-sm' : 'opacity-50'
                        ].join(' ')}
                        title={has ? 'Month has payments' : 'No payments recorded'}
                      >
                        <span>{lbl}</span>
                        {has && <span className='w-2 h-2 rounded-full bg-amber-500'></span>}
                      </button>
                    );
                  })}
                </div>
                <div className='flex items-center justify-between mt-3'>
                  <Button size='sm' variant='outline' onClick={()=>{ setMonth(''); setMonthPickerOpen(false); }}>All</Button>
                  <Button size='sm' variant='primary' onClick={()=>setMonthPickerOpen(false)}>Close</Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-500 mb-1'>Search</label>
            <input placeholder='Description or location' value={search} onChange={e=>setSearch(e.target.value)} className='w-full border rounded px-2 py-1'/>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <h2 className='text-lg font-semibold'>Results ({groupMode==='none'?displayPayments.length:grouped.length})</h2>
          <div className='text-sm text-gray-600'>Total Amount: ₹{filtered.reduce((s,p)=>s+p.amount,0).toLocaleString()}</div>
        </CardHeader>
        <CardContent className='space-y-3 text-sm'>
          {loading && <p className='text-gray-500'>Loading...</p>}
          {!loading && groupMode==='none' && displayPayments.map(p => {
            const bookingLabel = p.booking ? `${p.booking.pickupLocation || ''}${p.booking.pickupLocation && p.booking.dropLocation ? ' → ' : ''}${p.booking.dropLocation || ''}` : (p.bookingId ? `#${p.bookingId.slice(-6)}` : '—');
            return (
              <div key={p.id} className='p-3 border rounded hover:bg-amber-50 transition cursor-pointer' onClick={()=>setSelectedPayment(p)}>
                <div className='flex justify-between'>
                  <div className='space-y-1'>
                    <div className='flex gap-2 flex-wrap items-center'>
                      <span className='font-medium'>₹{p.amount.toLocaleString()}</span>
                      {p.mode && <span className='px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-300'>{p.mode}</span>}
                      {p.settled && <span className='px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 border border-green-300'>settled</span>}
                    </div>
                    <p className='text-xs text-gray-600'>{new Date(p.date).toLocaleString()} • {p.description || 'Payment'}{p.bookingId && <> • Booking: <button className='underline text-amber-700' onClick={()=>navigate(`/bookings/${p.bookingId}`)}>{bookingLabel}</button></>}
                    </p>
                    {p.mode==='fuel-basis' && p.fuelQuantity !== undefined && p.fuelRate !== undefined && (
                      <p className='text-xs text-gray-500'>Fuel: {p.fuelQuantity} L × ₹{p.fuelRate} = ₹{(p.computedAmount ?? p.fuelQuantity * p.fuelRate).toLocaleString()}</p>
                    )}
                  </div>
                  <span className={p.type==='paid'? 'text-red-600':'text-green-600'}>{p.type==='paid'?'-':'+'}₹{p.amount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}

          {!loading && groupMode!=='none' && grouped.map(g => (
            <div key={g.key} className='border rounded'>
              <div className='flex justify-between items-center p-3 bg-gray-50'>
                <p className='font-medium'>{groupMode==='day' ? g.label : g.label}</p>
                <p className='text-sm font-semibold'>₹{g.total.toLocaleString()} <span className='text-xs text-gray-500'>({g.count} payments)</span></p>
              </div>
              <div className='divide-y'>
                {g.items.sort((a,b)=> b.date.localeCompare(a.date)).map(p => {
                  const bookingLabel = p.booking ? `${p.booking.pickupLocation || ''}${p.booking.pickupLocation && p.booking.dropLocation ? ' → ' : ''}${p.booking.dropLocation || ''}` : (p.bookingId ? `#${p.bookingId.slice(-6)}` : '—');
                  return (
                    <div key={p.id} className='p-2 text-xs flex justify-between cursor-pointer hover:bg-amber-50' onClick={()=>setSelectedPayment(p)}>
                      <div className='space-y-0.5'>
                        <div className='flex gap-2 flex-wrap items-center'>
                          <span className='font-medium'>₹{p.amount.toLocaleString()}</span>
                          {p.mode && <span className='px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 border border-amber-300'>{p.mode}</span>}
                          {p.settled && <span className='px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 border border-green-300'>settled</span>}
                        </div>
                        <p className='text-gray-600'>{new Date(p.date).toLocaleTimeString()} • {p.description || 'Payment'}{p.bookingId && <> • <button className='underline text-amber-700' onClick={()=>navigate(`/bookings/${p.bookingId}`)}>{bookingLabel}</button></>}</p>
                        {p.mode==='fuel-basis' && p.fuelQuantity !== undefined && p.fuelRate !== undefined && (
                          <p className='text-gray-500'>Fuel: {p.fuelQuantity} L × ₹{p.fuelRate} = ₹{(p.computedAmount ?? p.fuelQuantity * p.fuelRate).toLocaleString()}</p>
                        )}
                      </div>
                      <span className={p.type==='paid'? 'text-red-600':'text-green-600'}>{p.type==='paid'?'-':'+'}₹{p.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {!loading && filtered.length===0 && <p className='text-gray-500'>No payments match filters.</p>}
        </CardContent>
      </Card>
      {selectedPayment && (
        <div className='fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg relative'>
            <div className='flex items-center justify-between px-4 py-3 border-b'>
              <h3 className='font-semibold text-lg'>Payment Details</h3>
              <button onClick={()=>setSelectedPayment(null)} className='text-gray-500 hover:text-gray-700'>✕</button>
            </div>
            <div className='p-4 space-y-4 text-sm'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <p className='text-xs text-gray-500'>Amount</p>
                  <p className='font-medium'>₹{selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Type</p>
                  <p className={selectedPayment.type==='paid' ? 'text-red-600' : 'text-green-600'}>{selectedPayment.type}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Date & Time</p>
                  <p>{new Date(selectedPayment.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Mode</p>
                  <p>{selectedPayment.mode || '—'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Settled</p>
                  <p>{selectedPayment.settled ? `Yes (${selectedPayment.settledAt ? new Date(selectedPayment.settledAt).toLocaleString(): ''})` : 'No'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Booking</p>
                  {selectedPayment.bookingId ? (
                    <button className='underline text-amber-700' onClick={()=>{ navigate(`/bookings/${selectedPayment.bookingId}`); }}>
                      {selectedPayment.booking ? `${selectedPayment.booking.pickupLocation || ''}${selectedPayment.booking.pickupLocation && selectedPayment.booking.dropLocation ? ' → ' : ''}${selectedPayment.booking.dropLocation || ''}` : `#${selectedPayment.bookingId.slice(-6)}`}
                    </button>
                  ) : <p>—</p>}
                </div>
              </div>
              {selectedPayment.description && (
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Description</p>
                  <p className='whitespace-pre-wrap'>{selectedPayment.description}</p>
                </div>
              )}
              {selectedPayment.mode==='fuel-basis' && selectedPayment.fuelQuantity!==undefined && selectedPayment.fuelRate!==undefined && (
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Fuel Calculation</p>
                  <p>{selectedPayment.fuelQuantity} L × ₹{selectedPayment.fuelRate} = ₹{(selectedPayment.computedAmount ?? selectedPayment.fuelQuantity * selectedPayment.fuelRate).toLocaleString()}</p>
                </div>
              )}
              <div className='pt-2 flex justify-end'>
                <Button variant='primary' onClick={()=> setSelectedPayment(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverPaymentHistory;